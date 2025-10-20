import React from 'react';
import PillNav from '../PillNav';

const items = [
  { label: 'Home', href: '/home' },
  { label: 'Team', href: '/team' },
  { label: 'Events', href: '/events' },

  { label: 'About', href: '/about' },
  { label: 'Contact us', href: '/contactus' },
  { label: 'Become a Member', href: '/membership' }
];

const Navbar = () => {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex w-full justify-center px-4">
      <div className="mt-6 flex h-[62px] max-w-fit items-center rounded-full border border-white/[0.12] bg-white/5 px-[3px] shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] backdrop-blur-lg">
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
