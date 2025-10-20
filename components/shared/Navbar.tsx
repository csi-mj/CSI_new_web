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
    <nav className="w-full flex justify-center fixed top-0 left-0 right-0 z-50 px-4">
      <div className="h-[62px] px-[3px] max-w-fit bg-white/5 backdrop-blur-lg mt-6 rounded-full flex items-center border border-white/[0.12] shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]">
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
