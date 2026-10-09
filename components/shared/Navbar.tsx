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
  { label: 'Events', href: '/events' },
  { label: 'Resources', href: '/resources' },
  { label: 'ADSOPHOS', href: '/adsophos' },
  { label: 'Become a Member', href: '/membership' },
  { label: 'Recruitments', href: '/recruitments' },
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

      // Always frosted; slightly denser once the page moves
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
        className={`fixed top-0 left-0 right-0 z-50 transform transition-[transform,background-color,border-color] duration-500 ${
          showNav ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled
            ? 'border-b border-white/[0.08] bg-black/60 backdrop-blur-xl'
            : 'border-b border-white/[0.06] bg-black/35 backdrop-blur-xl'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-4 md:px-8 lg:py-5">
          {/* Logo */}
          <Link
            href="/"
            aria-label="CSI MJCET home"
            className="relative inline-flex shrink-0 items-center justify-center transition-transform duration-500 cursor-target lg:hover:rotate-[360deg]"
            id="cursor-mid"
          >
            <Image
              src="/logos/csi_logo.png"
              alt="CSI"
              width={70}
              height={70}
              className="w-14 object-contain lg:w-12"
            />
          </Link>

          {/* Desktop links: plain text, a red underline draws in on hover and stays on the current page */}
          <ul className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex">
            {linkItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative block whitespace-nowrap px-2.5 py-2 text-[13px] font-medium transition-colors duration-200 cursor-target xl:px-3 xl:text-[14px] after:absolute after:inset-x-2.5 after:bottom-0.5 after:h-[1.5px] after:origin-left after:bg-[#ff2a3d] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] xl:after:inset-x-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      active
                        ? 'text-white after:scale-x-100'
                        : 'text-white/60 after:scale-x-0 hover:text-white hover:after:scale-x-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop: the one highlighted action */}
          <Link
            href={cta.href}
            aria-current={isActive(cta.href) ? 'page' : undefined}
            className="hidden min-h-10 shrink-0 items-center gap-2 rounded-full bg-[#ff2a3d] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff4152] cursor-target focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:inline-flex"
          >
            {cta.label}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>

          {/* Right: Mobile Hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative z-[60] grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:bg-white/15"
              aria-label="Toggle Menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
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
              damping: 25,
              stiffness: 200,
              duration: 0.4
            }}
            className="fixed top-0 right-0 bottom-0 w-[300px] bg-[#0B0B0D]/90 backdrop-blur-xl border-l border-white/10 z-50 lg:hidden flex flex-col"
          >
            {/* Menu Header */}
            <div className="flex shrink-0 items-center justify-end border-b border-white/10 px-6 py-4">
              <button
                onClick={() => setMenuOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:bg-white/15"
                aria-label="Close Menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Menu Items: text links; the current page gets a short red line */}
            <ul className="flex flex-1 flex-col overflow-y-auto px-6 py-4">
              {linkItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.3
                    }}
                    className="border-b border-white/[0.06]"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex min-h-12 items-center gap-3 text-[17px] font-medium transition-colors ${
                        active ? 'text-white' : 'text-white/65 hover:text-white'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`h-[1.5px] bg-[#ff2a3d] transition-all duration-300 ${active ? 'w-4' : 'w-0'}`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            {/* Menu Footer: the one highlighted action */}
            <div className="shrink-0 space-y-3 border-t border-white/10 p-5">
              <Link
                href={cta.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ff2a3d] text-[15px] font-semibold text-white transition-colors hover:bg-[#ff4152]"
              >
                {cta.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <p className="text-white/50 text-xs text-center">
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
