'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Connect', href: '/#connect' },
  { label: 'Team', href: '/team' },
  { label: 'Magazine', href: '/magazine' },
  // { label: 'Reveal', href: '/reveal' }, 
  { label: 'Events', href: '/events' },
  { label: 'Resources', href: '/resources' },
  { label: 'ADSOPHOS', href: '/adsophos' },
  { label: 'Become a Member', href: '/membership' },
  // { label: 'Recruitments', href: '/recruitments' },
];

// "Become a Member" is the bar's one highlighted action; every other item is a text link
const CTA_HREF = '/membership';
const linkItems = items.filter((item) => item.href !== CTA_HREF);
const cta = items.find((item) => item.href === CTA_HREF)!;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset;
      const lastScrollY = lastScrollYRef.current;

      // Density threshold
      setScrolled(currentScrollY > 20);

      // Do not hide navbar when near top of page
      if (currentScrollY < 80) {
        setShowNav(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      // Keep navbar visible while mobile menu is open
      if (menuOpen) {
        setShowNav(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShowNav(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setShowNav(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [menuOpen]);

  // Hide the public site navbar inside the admin portal
  if (pathname?.startsWith('/admin')) return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 w-full transform transition-all duration-300 ${
          showNav ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled
            ? 'border-b border-white/[0.08] bg-[#070709]/85 backdrop-blur-2xl shadow-[0_4px_25px_rgba(0,0,0,0.6)]'
            : 'border-b border-white/[0.05] bg-black/45 backdrop-blur-xl'
        }`}
      >
        {/* Ambient bottom cyber-red accent line across full width */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ff1e35]/35 to-transparent transition-opacity duration-300 ${
            scrolled ? 'opacity-100' : 'opacity-60'
          }`}
          aria-hidden="true"
        />

        <div
          className={`mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 md:px-8 transition-all duration-300 ${
           'py-3 lg:py-4'
          }`}
        >
          {/* Logo & Chapter Brand */}
          <Link
            href="/"
            aria-label="CSI MJCET home"
            className="group relative inline-flex shrink-0 items-center gap-3 transition-transform duration-300 cursor-target focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            id="navbar-logo"
          >
            <div className="relative flex items-center justify-center">
              <Image
                src="/logos/csi_logo.png"
                alt="CSI MJCET Logo"
                width={70}
                height={70}
                priority
                className="relative w-11 object-contain transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:rotate-720 lg:w-20"
              />
            </div>
          </Link>

          {/* Desktop links: clean frosted pills with active primary text */}
          <ul className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex xl:gap-1.5">
            {linkItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    aria-current={active ? 'page' : undefined}
                    className={`relative inline-flex items-center justify-center whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 cursor-target xl:px-4 xl:text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      active
                        ? 'text-primary bg-white/[0.1] border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] font-semibold'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop: the one highlighted CTA action */}
          <Link
            href={cta.href}
            id="nav-cta-btn"
            aria-current={isActive(cta.href) ? 'page' : undefined}
            className="group relative hidden min-h-10 shrink-0 items-center gap-2 overflow-hidden rounded-full bg-primary px-5 text-[13px] font-semibold text-white  transition-all duration-300  hover:scale-[1.02] active:scale-[0.98] border border-white/20 cursor-target focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:inline-flex"
          >
            <span className="relative z-10 flex items-center gap-2">
              {cta.label}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </span>
            <div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              aria-hidden="true"
            />
          </Link>

          {/* Right: Mobile Hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              id="mobile-nav-toggle-btn"
              className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
              aria-label="Toggle Menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Side Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 26,
              stiffness: 220,
            }}
            className="fixed top-0 right-0 bottom-0 w-[310px] bg-[#09090b]/95 backdrop-blur-2xl border-l border-white/10 z-50 lg:hidden flex flex-col shadow-2xl"
          >
            {/* Menu Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/logos/csi_logo.png"
                  alt="CSI MJCET"
                  width={36}
                  height={36}
                  className="w-8 object-contain"
                />
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                id="mobile-nav-close-btn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white transition hover:bg-white/10"
                aria-label="Close Menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Menu Items */}
            <ul className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
              {linkItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.03,
                      duration: 0.2,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      id={`mobile-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-medium transition-all ${
                        active
                          ? 'bg-white/[0.08] text-primary border border-primary/35 shadow-[0_0_12px_rgba(255,30,53,0.15)] font-semibold'
                          : 'text-white/70 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="text-[15px]">{item.label}</span>
                      <ArrowRight
                        className={`h-3.5 w-3.5 transition-transform ${
                          active ? 'text-[#ff2a3d] translate-x-0.5' : 'text-white/20'
                        }`}
                      />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            {/* Menu Footer */}
            <div className="shrink-0 space-y-3 border-t border-white/[0.08] p-5">
              <Link
                href={cta.href}
                onClick={() => setMenuOpen(false)}
                id="mobile-nav-cta-btn"
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff1e35] via-[#ff2a3d] to-[#e6162d] text-[14px] font-semibold text-white shadow-[0_0_20px_-3px_rgba(255,30,53,0.45)] transition-all hover:scale-[1.01] active:scale-[0.98]"
              >
                {cta.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <p className="text-white/40 text-[11px] text-center font-mono">
                &copy; {new Date().getFullYear()} CSI MJCET. All rights reserved.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;