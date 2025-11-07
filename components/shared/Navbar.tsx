'use client';
import React, { useState } from 'react';
import PillNav from '../PillNav';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { label: 'Home', href: '/home' },
  { label: 'About', href: '/home#about' },
  { label: 'Connect', href: '/home#connect' },
  { label: 'Team', href: '/team' },
  { label: 'Magazine', href: '/magazine' },
  { label: 'Events', href: '/events' },
  { label: 'Resources', href: '/resources' },
  // { label: 'Become a Member', href: '/membership' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center  px-6 md:px-8 py-6 bg-black/60 max-lg:backdrop-blur-lg lg:bg-transparent">
        {/* Left: Logo */}
        <Link href="/home" className="flex items-center lg:hidden">
          <img
            src="/logos/csi_logo.png"
            alt="CSI"
            width={70}
            height={70}
            className="object-contain"
          />
        </Link>


       


        <div className="hidden lg:flex justify-center flex-1">
           <div>
          <Link
            href="/home"
            aria-label="CSI"
            className="relative inline-flex items-center justify-center h-full mr-1 hover:rotate-[360deg] transition-all duration-500 cursor-target"
            id='cursor-mid'
          >
            <span
              className="inline-flex h-[62px] w-[62px] items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-md overflow-hidden"
            >
              <img
                src="/logos/csi_logo.png"
                alt="CSI"
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
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-lg transition relative z-[60]"
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
            className="fixed top-0 right-0 bottom-0 w-[300px] bg-[#0B0B0D]/28 backdrop-blur-xl border-l border-white/10 z-50 lg:hidden overflow-y-auto"
          >
            {/* Menu Header */}
            <div className="px-6 py-8 border-b border-white/10 flex items-center justify-end">
              {/* <img
                src="/logos/csi_logo.png"
                alt="CSI"
                width={60}
                height={60}
                className="object-contain"
              /> */}
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-lg transition"
                aria-label="Close Menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Menu Items */}
            <ul className="flex flex-col gap-3 py-6 px-4">
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
                      className={`inline-flex items-center justify-between rounded-full border px-5 py-3 text-base font-semibold uppercase tracking-wide transition-all w-full ${active
                          ? 'bg-primary text-white border-white/20'
                          : 'bg-white/10 text-white/90 hover:bg-white/20 border-white/12'
                        }`}
                    >
                      <span>{item.label}</span>

                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            {/* Menu Footer (Optional) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
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