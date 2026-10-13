'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import PillNav from '../PillNav';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
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
  { label: 'Recruitments', href: '/recruitments' },
  { label: 'Membership', href: '/membership' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const pathname = usePathname();
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset;
      const lastScrollY = lastScrollYRef.current;

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
        className={`fixed top-0 right-0 left-0 z-50 flex transform items-center justify-between bg-black/60 px-6 py-6 transition-transform duration-500 max-2xl:backdrop-blur-lg md:px-8 2xl:bg-transparent ${showNav ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {/* Left: Logo */}
        <Link href="/" className="flex items-center 2xl:hidden">
          <Image
            src="/logos/csi_logo.png"
            alt="CSI"
            width={70}
            height={70}
            className="object-contain"
          />
        </Link>

        <div className="hidden flex-1 justify-center 2xl:flex">
          <div>
            <Link
              href="/"
              aria-label="CSI"
              className="cursor-target relative mr-1 inline-flex h-full items-center justify-center transition-all duration-500 hover:rotate-[360deg]"
              id="cursor-mid"
            >
              <span className="inline-flex h-[62px] w-[62px] items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/5 backdrop-blur-md">
                <Image
                  src="/logos/csi_logo.png"
                  alt="CSI"
                  width={48}
                  height={48}
                  className="w-12 object-contain"
                />
              </span>
            </Link>
          </div>
          <div className="flex h-[62px] items-center rounded-full border border-white/12 bg-white/5 px-[3px] backdrop-blur-md">
            <PillNav
              logo="/logos/csi_logo.png"
              logoAlt="CSI"
              items={items}
              activeHref="/"
              ease="power2.easeOut"
              baseColor="#000000"
              pillColor="#ffffff"
              hoveredPillTextColor="#ffffff"
              pillTextColor="#000000"
              initialLoadAnimation={true}
            />
          </div>
        </div>

        {/* Right: Mobile Hamburger */}
        <div className="flex items-center 2xl:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-[60] rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
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
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm 2xl:hidden"
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
            className="fixed top-0 right-0 bottom-0 z-50 flex w-[300px] flex-col border-l border-white/10 bg-[#0B0B0D]/28 backdrop-blur-xl 2xl:hidden"
          >
            {/* Menu Header */}
            <div className="flex shrink-0 items-center justify-end border-b border-white/10 px-6 py-2">
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
                aria-label="Close Menu"
              >
                <X size={14} />
              </button>
            </div>

            {/* Menu Items */}
            <ul className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              {items.map((item, index) => {
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
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`inline-flex w-full items-center justify-between rounded-full border px-5 py-3 text-base font-semibold tracking-wide uppercase transition-all ${
                        active
                          ? 'bg-primary border-white/20 text-white'
                          : 'border-white/12 bg-white/10 text-white/90 hover:bg-white/20'
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            {/* Menu Footer */}
            <div className="shrink-0 border-t border-white/10 p-3">
              <p className="text-center text-xs text-white/50">
                &copy; {new Date().getFullYear()} CSI MJCET. All rights
                reserved.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
