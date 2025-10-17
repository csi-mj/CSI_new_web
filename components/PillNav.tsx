'use client'
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

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
  activePillColor = '#22D3EE',
  activePillTextColor = '#0F172A',
  onMobileMenuClick,
  initialLoadAnimation = true
}) => {
  const resolvedPillTextColor = pillTextColor ?? '#94A3B8';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  // --- FIX: Restored the missing ref declaration ---
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
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` });

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
    if (document.fonts) document.fonts.ready.then(layout).catch(() => {});
    
    // --- FIX: Restored the initial load animation logic ---
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
    if (items[i].href === activeHref) return;
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' });
  };

  const handleLeave = (i: number) => {
    if (items[i].href === activeHref) return;
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' });
  };

  const isExternalLink = (href: string) => href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('#');
  const isRouterLink = (href?: string) => href && !isExternalLink(href);

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor,
    ['--active-pill-bg']: activePillColor,
    ['--active-pill-text']: activePillTextColor,
  } as React.CSSProperties;

  return (
    <div className={`relative ${className}`} style={cssVars}>
      <div ref={navItemsRef} className="relative flex items-center h-full">
        <ul role="menubar" className="list-none flex items-stretch m-0 p-2 h-full gap-2">
          {items.map((item, i) => {
            const isActive = activeHref === item.href;
            const pillStyle: React.CSSProperties = {
              background: isActive ? 'var(--active-pill-bg)' : 'var(--pill-bg)',
              color: isActive ? 'var(--active-pill-text)' : 'var(--pill-text)',
              paddingLeft: '20px',
              paddingRight: '20px',
              transition: 'background 0.3s ease, color 0.3s ease',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              backdropFilter: 'blur(8px)',
            };

            const PillContent = (
              <>
                {!isActive ? (
                  <>
                    <span
                      className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                      style={{ background: 'var(--base)', willChange: 'transform' }}
                      aria-hidden="true"
                      ref={el => { circleRefs.current[i] = el; }}
                    />
                    <span className="label-stack relative inline-block leading-none z-[2]">
                      <span className="pill-label relative z-[2] inline-block" style={{ willChange: 'transform' }}>
                        {item.label}
                      </span>
                      <span
                        className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                        style={{ color: 'var(--hover-text)', willChange: 'transform, opacity' }}
                        aria-hidden="true"
                      >
                        {item.label}
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="pill-label relative z-[2] inline-block">
                    {item.label}
                  </span>
                )}
              </>
            );

            const basePillClasses = 'relative overflow-hidden p-3 inline-flex items-center justify-center h-full no-underline rounded-full box-border font-bold text-[14px] leading-none uppercase tracking-wider whitespace-nowrap cursor-pointer';

            return (
              <li key={item.href} role="none" className="flex h-full">
                {isRouterLink(item.href) ? (
                  <Link
                    role="menuitem"
                    href={item.href}
                    className={basePillClasses}
                    style={pillStyle}
                    aria-label={item.ariaLabel || item.label}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                  >
                    {PillContent}
                  </Link>
                ) : (
                  <a
                    role="menuitem"
                    href={item.href}
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