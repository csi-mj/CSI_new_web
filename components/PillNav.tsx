'use client';
import React, { useState, useEffect, useRef, useReducer } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import TargetCursor from './TargetCursor';

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  activePillColor?: string;
  activePillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.out',
  baseColor = '#22D3EE',
  pillColor = 'rgba(30, 41, 59, 0.5)',
  hoveredPillTextColor = '#0F172A',
  pillTextColor,
  activePillColor = 'red',
  activePillTextColor = '#0F172A',
  onMobileMenuClick,
  initialLoadAnimation = true
}) => {
  const pathname = usePathname();
  const resolvedPillTextColor = pillTextColor ?? '#94A3B8';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine if the current path matches the item's href
  const isActive = (href: string) => {
    // Special case for home page
    if (href === '/') return pathname === '/';
    // For other pages, check if current path starts with the href
    return pathname.startsWith(href);
  };

  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Reset hover state when pathname changes
  useEffect(() => {
    setHoveredIndex(null);

    // Kill all active animations
    activeTweenRefs.current.forEach((tween) => tween?.kill());
    activeTweenRefs.current = [];

    // Reset all timelines
    tlRefs.current.forEach((tl) => {
      if (tl) {
        tl.progress(0).pause(0);
      }
    });
  }, [pathname]);
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | HTMLElement | null>(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, i) => {
        if (!circle?.parentElement) return;
        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector<HTMLElement>('.pill-label');
        const white = pill.querySelector<HTMLElement>('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[i]?.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1.3, duration: 0.4, ease }, 0);
        if (label) tl.to(label, { y: -(h + 8), duration: 0.4, ease }, 0);
        if (white) {
          gsap.set(white, { y: h + 10, opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 0.4, ease }, 0);
        }
        tlRefs.current[i] = tl;
      });
    };

    layout();
    window.addEventListener('resize', layout);
    if (document.fonts) document.fonts.ready.then(layout).catch(() => { });

    if (initialLoadAnimation) {
      const logoEl = logoRef.current;
      const navItemsEl = navItemsRef.current;

      if (logoEl) {
        gsap.set(logoEl, { scale: 0 });
        gsap.to(logoEl, { scale: 1, duration: 0.6, ease });
      }

      if (navItemsEl) {
        gsap.set(navItemsEl, { width: 0, overflow: 'hidden' });
        gsap.to(navItemsEl, { width: 'auto', duration: 0.6, ease, delay: 0.2 });
      }
    }

    return () => window.removeEventListener('resize', layout);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    if (isActive(items[i].href)) {
      // Ensure active item is always in base state
      const tl = tlRefs.current[i];
      if (tl) {
        gsap.set(tl, { time: 0 });
      }
      return;
    }

    setHoveredIndex(i);
    const tl = tlRefs.current[i];
    if (!tl) return;

    // Kill any existing animations
    activeTweenRefs.current[i]?.kill();

    // Only animate if not already at target state
    if (tl.progress() < 0.95) {
      activeTweenRefs.current[i] = gsap.to(tl, {
        duration: 0.3,
        time: tl.duration(),
        ease: 'power2.out',
        onUpdate: forceUpdate
      });
    }
  };

  const handleLeave = (i: number) => {
    if (isActive(items[i].href)) {
      // Force reset the active item's state immediately
      const tl = tlRefs.current[i];
      if (tl) {
        gsap.set(tl, { time: 0 });
      }
      return;
    }

    setHoveredIndex(null);
    const tl = tlRefs.current[i];
    if (!tl) return;

    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = gsap.to(tl, {
      duration: 0.2,
      time: 0,
      ease: 'power2.inOut',
      onUpdate: forceUpdate,
      onComplete: () => {
        // Ensure final state is clean
        if (tl) {
          gsap.set(tl, { time: 0 });
        }
      }
    });
  };

  const isExternalLink = (href: string) =>
    href.startsWith('http') ||
    href.startsWith('//') ||
    href.startsWith('mailto') ||
    href.startsWith('tel') ||
    href.startsWith('#');
  const isRouterLink = (href?: string) => href && !isExternalLink(href);

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor,
    ['--active-pill-text']: 'white',
    ['--active-pill-bg']: activePillColor
  } as React.CSSProperties;

  return (

    <div className={`relative ${className}`} style={cssVars}>

      <div ref={navItemsRef} className="relative flex h-full items-center">

        <ul
          role="menubar"
          className="m-0 flex h-full list-none items-stretch gap-2 p-2"
        >
          {items.map((item, i) => {
            const isItemActive = activeHref ? item.href === activeHref : isActive(item.href);
            const isHovered = hoveredIndex === i;
            const pillStyle: React.CSSProperties = {
              background: isItemActive
                ? 'var(--active-pill-bg)'
                : isHovered
                  ? 'var(--pill-bg-hover, var(--pill-bg))'
                  : 'var(--pill-bg)',
              color: isItemActive
                ? 'var(--active-pill-text, white)'
                : isHovered
                  ? 'var(--hover-text, var(--pill-text))'
                  : 'var(--pill-text)',
              paddingLeft: '20px',
              paddingRight: '20px',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              backdropFilter: 'blur(8px)',
              position: 'relative',
              overflow: 'hidden'
            };

            const PillContent = (
              <>
                <span
                  className="hover-circle cursor-target pointer-events-none absolute bottom-0 left-1/2 z-[1] block rounded-full"
                  style={{ background: 'var(--base)', willChange: 'transform' }}
                  aria-hidden="true"
                  ref={(el) => {
                    circleRefs.current[i] = el;
                  }}
                />
                <span className="label-stack relative z-[2] inline-block leading-none">
                  <span
                    className="pill-label relative z-[2] inline-block"
                    style={{
                      willChange: 'transform',
                      display: isItemActive ? 'block' : 'inline-block'
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="pill-label-hover absolute top-0 left-0 z-[3] inline-block"
                    style={{
                      color: 'var(--hover-text)',
                      willChange: 'transform, opacity',
                      display: isItemActive ? 'none' : 'inline-block'
                    }}
                    aria-hidden="true"
                  >
                    {item.label}
                  </span>
                </span>
              </>
            );

            const basePillClasses =
              'relative overflow-hidden p-3 cursor-target inline-flex items-center justify-center h-full no-underline rounded-full box-border font-bold text-[14px] leading-none uppercase tracking-wider whitespace-nowrap cursor-pointer';

            return (
              <li key={item.href} role="none" className="flex h-full">
                {isRouterLink(item.href) ? (
                  <Link
                    role="menuitem"
                    href={item.href}
                    id='cursor-mid'
                    className={`${basePillClasses} ${isItemActive ? 'active' : ''}`}
                    style={pillStyle}
                    aria-label={item.ariaLabel || item.label}
                    aria-current={isItemActive ? 'page' : undefined}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                  >
                    {PillContent}
                  </Link>
                ) : (
                  <a
                    role="menuitem"
                    href={item.href}
                    id='cursor-mid'
                    className={basePillClasses}
                    style={pillStyle}
                    aria-label={item.ariaLabel || item.label}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                  >
                    {PillContent}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
