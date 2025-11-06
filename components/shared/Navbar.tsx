'use client';
import React, { useState } from 'react';
import PillNav from '../PillNav';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-6 bg-black/60 max-lg:backdrop-blur-lg lg:bg-transparent">
        {/* Left: Logo */}
        <div className="flex items-center">
          <img
            src="/logos/csi_logo.png"
            alt="CSI"
            width={70}
            height={70}
            className="object-contain"
          />
        </div>

        {/* Center: Desktop Nav */}
        <div className="hidden lg:flex justify-center flex-1">
          <div className="flex h-[62px] items-center rounded-full border border-white/12 bg-white/5 px-[3px] shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] backdrop-blur-md">
            <PillNav
              logo="/logo.png"
              logoAlt="Company Logo"
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
            <div className="px-6 py-8 border-b border-white/10 flex items-center justify-between">
              <img
                src="/logos/csi_logo.png"
                alt="CSI"
                width={60}
                height={60}
                className="object-contain"
              />
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-lg transition"
                aria-label="Close Menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Menu Items */}
            <ul className="flex flex-col py-6">
              {items.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.3 
                  }}
                >
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-4 text-white hover:bg-white/10 transition-colors text-base font-medium border-l-2 border-transparent hover:border-blue-500"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            {/* Menu Footer (Optional) */}
            {/* <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
              <p className="text-white/50 text-xs text-center">
                © 2024 CSI. All rights reserved.
              </p>
            </div> */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;