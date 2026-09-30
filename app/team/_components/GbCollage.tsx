'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import NavTabs from './NavTabs';

gsap.registerPlugin(ScrollTrigger);

export type GbMember = {
  id: string;
  name: string;
  role: string;
  group: string;
  image?: string;
  linkedinUrl?: string;
  githubUrl?: string;
};

type GbCollageProps = {
  members: GbMember[];
  term: string;
};

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty'];

const toWords = (n: number): string => {
  if (n < 20) return ONES[n];
  if (n < 60) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '');
  return String(n);
};

// Deterministic tilt/offset per slot so server and client render the same collage
const tiltFor = (i: number) => ((i * 7919) % 9) - 4;
const nudgeFor = (i: number) => (((i * 37) % 5) - 2) * 3;

// Diamond-ish rows (3,4,5,4,...) on desktop, pairs on mobile; never leave a lone card in the last row
const toRows = <T,>(items: T[], pattern: number[]): T[][] => {
  const rows: T[][] = [];
  let i = 0;
  let k = 0;
  while (i < items.length) {
    const remaining = items.length - i;
    let take = Math.min(pattern[k % pattern.length], remaining);
    if (remaining - take === 1 && take > 2) take -= 1;
    rows.push(items.slice(i, i + take));
    i += take;
    k += 1;
  }
  return rows;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SocialIcon: React.FC<{ href?: string; label: string; hoverClass: string; children: React.ReactNode }> = ({
  href,
  label,
  hoverClass,
  children,
}) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`relative grid size-7 place-items-center rounded-full text-neutral-500 transition-colors before:absolute before:-inset-2 before:content-[''] focus-visible:text-neutral-900 focus-visible:outline-2 focus-visible:outline-neutral-900 ${hoverClass}`}
    >
      {children}
    </a>
  ) : (
    <span aria-hidden title="Not added yet" className="grid size-7 place-items-center text-neutral-300">
      {children}
    </span>
  );

const PrintCard: React.FC<{ member: GbMember; index: number; large: boolean }> = ({ member, index, large }) => {
  const tilt = tiltFor(index);
  return (
    <div
      data-gb-card
      data-tilt={tilt}
      className="group relative -mx-1 md:-mx-3 hover:z-30 focus-within:z-30"
      style={{ opacity: 0, marginTop: nudgeFor(index), ['--tilt' as string]: tilt }}
    >
      <article
        tabIndex={0}
        aria-label={`${member.name}, ${member.role}`}
        className={`bg-[#ecebe6] p-1.5 md:p-2 pb-0 md:pb-0 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.85)] outline-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:[transform:rotate(calc(var(--tilt)*-1deg))_translateY(-22px)_scale(1.12)] group-focus-within:[transform:rotate(calc(var(--tilt)*-1deg))_translateY(-22px)_scale(1.12)] group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.95)] focus-visible:ring-2 focus-visible:ring-white/70 ${
          large ? 'w-[42vw] max-w-[190px] md:w-[210px] md:max-w-none lg:w-[230px]' : 'w-[40vw] max-w-[170px] md:w-[150px] md:max-w-none lg:w-[172px] xl:w-[188px]'
        }`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-300 grayscale transition-[filter] duration-500 group-hover:grayscale-0 group-focus-within:grayscale-0">
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(min-width: 1280px) 230px, (min-width: 768px) 190px, 42vw"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,oklch(0.7_0.2_25),oklch(0.35_0.15_20)_55%,oklch(0.15_0.03_20))]"
            >
              <span className="font-instrument-serif text-5xl italic text-white/90 md:text-6xl">
                {initials(member.name)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-1 px-0.5 pb-2 pt-2 md:pb-2.5">
          <div className="min-w-0">
            <p className="truncate font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-900 md:text-xs">
              {member.name}
            </p>
            <p className="truncate font-instrument-serif text-[13px] italic leading-tight text-neutral-500 md:text-sm">
              {member.role}
            </p>
          </div>
          <div className="-mr-1 flex shrink-0 items-center">
            <SocialIcon href={member.linkedinUrl} label={`${member.name} on LinkedIn`} hoverClass="hover:text-[#0a66c2]">
              <FaLinkedinIn size={14} aria-hidden />
            </SocialIcon>
            <SocialIcon href={member.githubUrl} label={`${member.name} on GitHub`} hoverClass="hover:text-neutral-900">
              <FaGithub size={14} aria-hidden />
            </SocialIcon>
          </div>
        </div>
      </article>
    </div>
  );
};

export default function GbCollage({ members, term }: GbCollageProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const introDone = useRef(false);
  const exitTween = useRef<gsap.core.Tween | null>(null);
  const dealTween = useRef<gsap.core.Tween | null>(null);

  const [isDesktop, setIsDesktop] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [shownTab, setShownTab] = useState(0);

  const tabs = useMemo(() => ['All', ...Array.from(new Set(members.map((m) => m.group)))], [members]);

  useEffect(() => {
    setActiveTab(0);
    setShownTab(0);
  }, [members]);

  const visible = useMemo(() => {
    const tab = tabs[shownTab] ?? 'All';
    return tab === 'All' ? members : members.filter((m) => m.group === tab);
  }, [members, tabs, shownTab]);

  const rows = useMemo(() => toRows(visible, isDesktop ? [3, 4, 5, 4] : [2]), [visible, isDesktop]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const getCards = () =>
    Array.from(stageRef.current?.querySelectorAll<HTMLElement>('[data-gb-card]') ?? []);

  const settleCards = (cards: HTMLElement[]) =>
    gsap.set(cards, { opacity: 1, x: 0, y: 0, scale: 1, rotation: (_: number, el: HTMLElement) => Number(el.dataset.tilt) });

  // Cards fly in from a pile at the centre of the stage and settle at their tilt
  const dealIn = (cards: HTMLElement[], fast: boolean) => {
    const stage = stageRef.current;
    if (!stage || cards.length === 0) return null;
    settleCards(cards);
    gsap.set(cards, { opacity: 0 });
    const box = stage.getBoundingClientRect();
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const deltas = cards.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2) };
    });
    return gsap.fromTo(
      cards,
      {
        x: (i: number) => deltas[i].x * 0.85,
        y: (i: number) => deltas[i].y * 0.85,
        rotation: (i: number, el: HTMLElement) => Number(el.dataset.tilt) + (i % 2 ? 18 : -18),
        scale: 1.12,
        opacity: 0,
      },
      {
        x: 0,
        y: 0,
        rotation: (_: number, el: HTMLElement) => Number(el.dataset.tilt),
        scale: 1,
        opacity: 1,
        duration: fast ? 0.55 : 0.8,
        ease: 'expo.out',
        stagger: fast ? 0.03 : 0.045,
      }
    );
  };

  // Intro: headline rises, pill pops, cards are dealt, labels fade in — once, on scroll into view
  useIsoLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const rise = root.querySelectorAll('[data-gb-rise]');
      const pill = root.querySelectorAll('[data-gb-pill]');
      const fades = root.querySelectorAll('[data-gb-fade]');

      if (prefersReducedMotion()) {
        gsap.set([rise, pill, fades], { opacity: 1, yPercent: 0, scale: 1 });
        settleCards(getCards());
        introDone.current = true;
        return;
      }

      gsap.set(rise, { yPercent: 110 });
      ScrollTrigger.create({
        trigger: root,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          introDone.current = true;
          const tl = gsap.timeline();
          tl.to(rise, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.08 })
            .fromTo(pill, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.6');
          const deal = dealIn(getCards(), false);
          if (deal) {
            dealTween.current = deal;
            tl.add(deal, '-=0.35');
          }
          tl.to(fades, { opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.6');
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Re-deal whenever the visible set changes after the intro (filter tab, year switch, breakpoint)
  useIsoLayoutEffect(() => {
    if (!introDone.current) return;
    const cards = getCards();
    if (prefersReducedMotion()) {
      settleCards(cards);
      return;
    }
    dealTween.current?.kill();
    dealTween.current = dealIn(cards, true);
  }, [rows]);

  // Light parallax: each row drifts a little further than the one above it
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      stage.querySelectorAll<HTMLElement>('[data-gb-row]').forEach((row, i) => {
        const amp = 4 + i * 3;
        gsap.fromTo(
          row,
          { y: amp },
          {
            y: -amp,
            ease: 'none',
            scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
    });
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [rows]);

  useEffect(
    () => () => {
      exitTween.current?.kill();
      dealTween.current?.kill();
    },
    []
  );

  const handleTab = (idx: number) => {
    if (idx === activeTab) return;
    setActiveTab(idx);
    const cards = getCards();
    if (!introDone.current || prefersReducedMotion() || cards.length === 0) {
      setShownTab(idx);
      return;
    }
    const stage = stageRef.current!.getBoundingClientRect();
    const cx = stage.left + stage.width / 2;
    const cy = stage.top + stage.height / 2;
    exitTween.current?.kill();
    dealTween.current?.kill();
    exitTween.current = gsap.to(cards, {
      x: (_: number, el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return (cx - (r.left + r.width / 2)) * 0.6;
      },
      y: (_: number, el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return (cy - (r.top + r.height / 2)) * 0.6;
      },
      scale: 0.85,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      stagger: { each: 0.015, from: 'end' },
      onComplete: () => setShownTab(idx),
    });
  };

  const count = visible.length;
  const large = count <= 3;
  let slot = 0;

  return (
    <div ref={sectionRef} className="relative mt-16 pb-12">
      <h2 className="sr-only">Governing Body</h2>

      <div aria-hidden className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 md:px-8">
        <span className="overflow-hidden">
          <span
            data-gb-rise
            style={{ opacity: 0 }}
            className="block font-inter text-[clamp(1.6rem,6.2vw,5.5rem)] font-normal uppercase leading-[0.95] tracking-[-0.03em] text-white"
          >
            Governing
          </span>
        </span>
        <span
          data-gb-pill
          style={{ opacity: 0 }}
          className="shrink-0 whitespace-nowrap rounded-[50%] border border-white/80 px-[0.9em] py-[0.3em] font-instrument-serif text-[clamp(0.85rem,2.3vw,2rem)] leading-none text-white"
        >
          <em>Term of</em> {term}
        </span>
        <span className="overflow-hidden">
          <span
            data-gb-rise
            style={{ opacity: 0 }}
            className="block font-inter text-[clamp(1.6rem,6.2vw,5.5rem)] font-normal uppercase leading-[0.95] tracking-[-0.03em] text-white"
          >
            Body
          </span>
        </span>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2 px-2 md:mt-10">
        <NavTabs tabs={tabs} activeIdx={activeTab} onChange={handleTab} />
      </div>

      <div className="relative mx-auto mt-10 max-w-7xl md:mt-14">
        <div
          aria-hidden
          data-gb-fade
          style={{ opacity: 0 }}
          className="pointer-events-none mb-6 flex justify-between px-4 font-inter text-[11px] uppercase tracking-[0.25em] text-white/80 md:px-8 md:text-sm xl:absolute xl:inset-x-0 xl:top-1/2 xl:mb-0 xl:-translate-y-1/2"
        >
          <span>{toWords(count)}</span>
          <span>{count === 1 ? 'Member' : 'Members'}</span>
        </div>

        <div ref={stageRef} className="relative flex flex-col items-center">
          {rows.map((row, r) => (
            <div
              key={`row-${shownTab}-${r}`}
              data-gb-row
              className={`relative flex justify-center hover:z-30 focus-within:z-30 ${r === 0 ? '' : '-mt-1 md:-mt-2'}`}
            >
              {row.map((member) => {
                const index = slot++;
                return <PrintCard key={member.id} member={member} index={index} large={large} />;
              })}
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden
        data-gb-fade
        style={{ opacity: 0 }}
        className="mx-auto mt-14 flex max-w-7xl justify-between px-4 font-inter text-[11px] uppercase tracking-[0.25em] text-white/80 md:mt-20 md:px-8 md:text-sm"
      >
        <span>Leading</span>
        <span>The chapter</span>
        <span>Forward</span>
      </div>
    </div>
  );
}
