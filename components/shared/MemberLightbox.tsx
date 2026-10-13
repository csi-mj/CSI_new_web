'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { animate } from 'framer-motion';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { IoChevronBack, IoChevronForward, IoClose } from 'react-icons/io5';

export type LightboxMember = {
  id: string;
  name: string;
  role: string;
  image?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  email?: string;
};

type MemberLightboxProps = {
  members: LightboxMember[];
  openId: string;
  /** The polaroid that was clicked; the popup flies out of (and back into) it */
  originEl?: HTMLElement | null;
  /** Return focus to the card on close (keyboard users); mouse/touch users get focus cleared so nothing looks selected */
  restoreFocus?: boolean;
  /** Match the photo shape of the cards it opens from, so the flight is one print growing and shrinking */
  photoAspect?: 'square' | 'portrait';
  onClose: () => void;
};

const POLAROID_TILT = -4;
const CARD_TILT = 2;
// Soft deceleration for the return flight (no overshoot when landing in a tight spot)
const EASE_LAND: [number, number, number, number] = [0.32, 0.72, 0, 1];

/** Elements opt in with data-polaroid-id; pick the copy most visible on screen (marquees render duplicates) */
const findOrigin = (id: string): HTMLElement | null => {
  const els = document.querySelectorAll<HTMLElement>(`[data-polaroid-id="${CSS.escape(id)}"]`);
  let best: HTMLElement | null = null;
  let bestArea = 0;
  for (const el of Array.from(els)) {
    const r = el.getBoundingClientRect();
    const w = Math.max(0, Math.min(r.right, window.innerWidth) - Math.max(r.left, 0));
    const h = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
    if (w * h > bestArea) {
      bestArea = w * h;
      best = el;
    }
  }
  return best;
};

const tiltOf = (el: HTMLElement) => parseFloat(getComputedStyle(el).getPropertyValue('--tilt')) || 0;

const center = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Where the details card hides: tucked behind the polaroid (left on desktop, up on mobile) */
const cardTuck = () => (window.matchMedia('(min-width: 768px)').matches ? { x: -180, y: 0 } : { x: 0, y: -140 });

const PHOTO_SIZES = '340px';

/** A fresh image per member (keyed by the caller) that fades in once loaded, so a slow
 *  connection never shows the previous member's photo under the new name */
const LightboxPhoto: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={PHOTO_SIZES}
      loading="eager"
      onLoad={() => setLoaded(true)}
      className={`object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

const LinkPill: React.FC<{ href?: string; label: string; external?: boolean; children: React.ReactNode }> = ({
  href,
  label,
  external = true,
  children,
}) =>
  href ? (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 font-inter text-sm text-white transition-colors hover:border-white/40 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {children}
      {label}
    </a>
  ) : (
    <span
      aria-disabled
      title="Not added yet"
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 font-inter text-sm text-white/35"
    >
      {children}
      {label}
    </span>
  );

export default function MemberLightbox({
  members,
  openId,
  originEl,
  restoreFocus = false,
  photoAspect = 'square',
  onClose,
}: MemberLightboxProps) {
  const [index, setIndex] = useState(() => Math.max(0, members.findIndex((m) => m.id === openId)));
  const member = members[index] ?? members[0];

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const polaroidRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const hiddenSource = useRef<HTMLElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const busy = useRef(true);
  const navDir = useRef(0);

  // Every card the popup hides or fades is tracked, so all of them are guaranteed to come back
  const touched = useRef(new Set<HTMLElement>());
  const fades = useRef<Animation[]>([]);

  const resetCard = (el: HTMLElement) => {
    el.style.visibility = '';
    el.style.opacity = '';
  };

  const restoreAll = () => {
    fades.current.forEach((a) => a.cancel());
    fades.current = [];
    touched.current.forEach(resetCard);
    touched.current.clear();
    hiddenSource.current = null;
  };

  const hideSource = (el: HTMLElement | null) => {
    if (hiddenSource.current && hiddenSource.current !== el) resetCard(hiddenSource.current);
    hiddenSource.current = el;
    if (el) {
      touched.current.add(el);
      el.style.visibility = 'hidden';
    }
  };

  // Open: polaroid flies out of the clicked card, then the details card slides out from behind it
  useLayoutEffect(() => {
    const pol = polaroidRef.current!;
    const card = cardRef.current!;
    const overlay = overlayRef.current!;
    returnFocus.current = (originEl as HTMLElement) ?? (document.activeElement as HTMLElement | null);
    const source = originEl ?? findOrigin(member.id);

    animate(overlay, { opacity: [0, 1] }, { duration: 0.3 });

    if (!source || prefersReducedMotion()) {
      animate(pol, { opacity: [0, 1], scale: [0.96, 1], rotate: POLAROID_TILT }, { duration: 0.3 });
      animate(card, { opacity: [0, 1], rotate: CARD_TILT }, { duration: 0.3, delay: 0.1 }).then(() => {
        busy.current = false;
      });
    } else {
      const from = center(source.getBoundingClientRect());
      const to = center(pol.getBoundingClientRect());
      const dx = from.x - to.x;
      const dy = from.y - to.y;
      const scale = source.offsetWidth / pol.offsetWidth;
      pol.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      pol.style.opacity = '0';

      // The popup polaroid and the card differ in shape, so blend between them rather than swapping
      animate(pol, { opacity: [0, 1] }, { duration: 0.18 });
      touched.current.add(source);
      const fadeOut = source.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 180,
        easing: 'ease-out',
        fill: 'forwards',
      });
      fades.current.push(fadeOut);
      fadeOut.finished
        .then(() => {
          hideSource(source);
          fadeOut.cancel();
        })
        .catch(() => {});

      animate(
        pol,
        { x: [dx, 0], y: [dy, 0], scale: [scale, 1], rotate: [0, POLAROID_TILT] },
        { type: 'spring', stiffness: 170, damping: 22 }
      );
      const tuck = cardTuck();
      animate(
        card,
        { x: [tuck.x, 0], y: [tuck.y, 0], opacity: [0, 1], rotate: [0, CARD_TILT] },
        { type: 'spring', stiffness: 200, damping: 24, delay: 0.35 }
      ).then(() => {
        busy.current = false;
      });
    }

    closeBtnRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    const pol = polaroidRef.current!;
    const card = cardRef.current!;
    const overlay = overlayRef.current!;
    const target = findOrigin(member.id);
    const reduced = prefersReducedMotion();
    const tuck = cardTuck();

    const tuckAway = animate(
      card,
      reduced ? { opacity: 0 } : { x: tuck.x, y: tuck.y, opacity: 0, rotate: 0 },
      { duration: 0.24, ease: 'easeIn' }
    );

    if (target && !reduced) {
      // Real card sits invisible in its spot and fades in as the copy lands on it
      touched.current.add(target);
      if (hiddenSource.current && hiddenSource.current !== target) resetCard(hiddenSource.current);
      hiddenSource.current = null;
      target.style.visibility = '';
      const fadeIn = target.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 260,
        delay: 460,
        easing: 'ease-out',
        fill: 'backwards',
      });
      fades.current.push(fadeIn);
      const from = center(pol.getBoundingClientRect());
      const to = center(target.getBoundingClientRect());
      await Promise.all([
        tuckAway,
        animate(
          pol,
          { x: to.x - from.x, y: to.y - from.y, scale: target.offsetWidth / pol.offsetWidth, rotate: tiltOf(target) },
          { duration: 0.6, ease: EASE_LAND, delay: 0.1 }
        ),
        animate(pol, { opacity: 0 }, { duration: 0.22, delay: 0.5 }),
        fadeIn.finished.catch(() => {}),
        animate(overlay, { opacity: 0 }, { duration: 0.5, delay: 0.1 }),
      ]);
    } else {
      await Promise.all([
        tuckAway,
        animate(pol, { opacity: 0, scale: 0.96 }, { duration: 0.2 }),
        animate(overlay, { opacity: 0 }, { duration: 0.25 }),
      ]);
    }
    restoreAll();
    if (restoreFocus) returnFocus.current?.focus({ preventScroll: true });
    else (document.activeElement as HTMLElement | null)?.blur();
    onClose();
  }, [member.id, onClose, restoreFocus]);

  const go = useCallback(
    async (dir: 1 | -1) => {
      if (busy.current || members.length < 2) return;
      busy.current = true;
      navDir.current = dir;
      // Browsing away from the opened member: bring their card fully back right away
      restoreAll();
      await Promise.all([
        animate(polaroidRef.current!, { x: -dir * 70, opacity: 0, rotate: POLAROID_TILT - dir * 6 }, { duration: 0.18, ease: 'easeIn' }),
        animate(contentRef.current!, { opacity: 0, y: 6 }, { duration: 0.15 }),
      ]);
      setIndex((i) => (i + dir + members.length) % members.length);
    },
    [members.length]
  );

  // After a next/prev swap, bring the new polaroid and details in from the travel direction
  useLayoutEffect(() => {
    const dir = navDir.current;
    if (!dir) return;
    navDir.current = 0;
    Promise.all([
      animate(
        polaroidRef.current!,
        { x: [dir * 70, 0], opacity: [0, 1], rotate: [POLAROID_TILT + dir * 6, POLAROID_TILT] },
        { type: 'spring', stiffness: 260, damping: 26 }
      ),
      animate(contentRef.current!, { opacity: [0, 1], y: [6, 0] }, { duration: 0.25, delay: 0.05 }),
    ]).then(() => {
      busy.current = false;
    });
  }, [index]);

  // Keyboard: Esc closes, arrows navigate, Tab stays inside the dialog
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowRight') {
        go(1);
      } else if (e.key === 'ArrowLeft') {
        go(-1);
      } else if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, go]);

  // Lock page scroll behind the popup without the layout jumping
  useEffect(() => {
    const { body, documentElement } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      restoreAll();
    };
  }, []);

  if (!member) return null;
  const mailHref = member.email && member.email.includes('@') ? `mailto:${member.email}` : undefined;
  const multiple = members.length > 1;
  const neighbours = multiple
    ? [members[(index + 1) % members.length], members[(index - 1 + members.length) % members.length]]
    : [];

  return createPortal(
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="member-lightbox-name" className="fixed inset-0 z-[200]">
      <div
        ref={overlayRef}
        style={{ opacity: 0 }}
        onClick={close}
        className="absolute inset-0 bg-black/80"
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 pb-24 md:pb-4">
        <div className="pointer-events-auto flex flex-col items-center md:flex-row">
          <div
            ref={polaroidRef}
            className="relative z-10 w-[230px] bg-[#ecebe6] will-change-transform p-2.5 pb-0 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] sm:w-[280px] md:w-[340px] md:p-3 md:pb-0"
          >
            <div className={`relative overflow-hidden bg-neutral-300 ${photoAspect === 'portrait' ? 'aspect-[4/5]' : 'aspect-square'}`}>
              {member.image ? (
                <LightboxPhoto key={member.id} src={member.image} alt={member.name} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,oklch(0.7_0.2_25),oklch(0.35_0.15_20)_55%,oklch(0.15_0.03_20))]">
                  <span className="font-instrument-serif text-7xl italic text-white/90 md:text-8xl">
                    {initials(member.name)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex aspect-[10/3] items-end justify-end pb-2 pr-1 md:pb-3">
              <span className="font-instrument-serif text-sm italic text-neutral-400 md:text-base">csi mjcet</span>
            </div>
          </div>

          <div
            ref={cardRef}
            style={{ opacity: 0 }}
            className="relative z-0 -mt-6 w-[270px] will-change-transform rounded-2xl border border-white/20 bg-white/10 p-6 pt-10 text-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:w-[320px] md:-ml-8 md:mt-0 md:w-[380px] md:p-8 md:pl-16"
          >
            <div ref={contentRef}>
              <h2
                id="member-lightbox-name"
                className="font-instrument-serif text-4xl italic leading-[1.05] text-white md:text-5xl"
              >
                {member.name}
              </h2>
              <p className="mt-2 font-inter text-xs font-medium uppercase tracking-[0.2em] text-white/60 md:text-sm">
                {member.role}
              </p>
              <div className="my-5 h-px w-12 bg-primary md:my-6" />
              <div className="flex flex-wrap gap-2">
                <LinkPill href={member.linkedinUrl} label="LinkedIn">
                  <FaLinkedinIn size={15} aria-hidden />
                </LinkPill>
                <LinkPill href={member.githubUrl} label="GitHub">
                  <FaGithub size={15} aria-hidden />
                </LinkPill>
                <LinkPill href={mailHref} label="Email" external={false}>
                  <HiOutlineMail size={16} aria-hidden />
                </LinkPill>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warm the cache for next/previous so arrow browsing shows photos immediately */}
      <div aria-hidden className="pointer-events-none fixed left-0 top-0 size-px overflow-hidden opacity-0">
        {neighbours.map((m, i) =>
          m?.image ? (
            <div key={`${i}-${m.id}`} className="relative size-px">
              <Image src={m.image} alt="" fill sizes={PHOTO_SIZES} loading="eager" />
            </div>
          ) : null
        )}
      </div>

      <button
        ref={closeBtnRef}
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white md:right-6 md:top-6"
      >
        <IoClose size={22} aria-hidden />
      </button>

      {multiple && (
        <p
          aria-live="polite"
          className="absolute inset-x-0 bottom-8 hidden text-center font-inter text-sm tracking-[0.2em] tabular-nums text-white/70 md:block"
        >
          {String(index + 1).padStart(2, '0')} / {String(members.length).padStart(2, '0')}
        </p>
      )}

      {multiple && (
        <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4 md:pointer-events-none md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:justify-between md:px-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous member"
            className="pointer-events-auto grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white md:size-12"
          >
            <IoChevronBack size={20} aria-hidden />
          </button>
          <span className="font-inter text-sm tabular-nums text-white/70 md:hidden">
            {index + 1} / {members.length}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next member"
            className="pointer-events-auto grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white md:size-12"
          >
            <IoChevronForward size={20} aria-hidden />
          </button>
        </div>
      )}
    </div>,
    document.body
  );
}
