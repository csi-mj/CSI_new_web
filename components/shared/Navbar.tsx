'use client';
import React from 'react';
import PillNav from '../PillNav';
import Image from 'next/image';


const items = [
  { label: 'Home', href: '/home' },
  { label: 'About', href: '/home#about' },
  { label: 'Connect', href: '/home#connect' },
  { label: 'Team', href: '/team' },
  { label: 'Magazine', href: '/magazine' },
  { label: 'Events', href: '/events' },
  { label: 'Resources', href: '/resources' },
  { label: 'Become a Member', href: '/membership' }
];

const Navbar = () => {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex w-full justify-center px-4">
        <Image src="/logos/csi_logo.png" alt="Company Logo" width={100} height={100} />
      <div className="mt-3 flex h-[62px] max-w-fit items-center rounded-full border border-white/12 bg-white/5 px-[3px] shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] backdrop-blur-md z-50">
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

    </nav>
  );
};

export default Navbar;
