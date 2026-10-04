'use client';
import React, { useRef, useState } from 'react';
import { Developer } from './Developer';
import {
  ArrowUp,
  Github,
  Linkedin,
  Instagram,
  Calendar,
  Users,
  BookOpen,
  Award,
  Phone,
  Mail,
  User2
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { FaMedium } from 'react-icons/fa';
import { iconColors, translucentBgColors, borderColors, IconColor } from '@/config/colors';

function Footer() {
  const pathname = usePathname();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/orgs/csi-mj', label: 'GitHub', color: 'indigo' as IconColor },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/company/csi-mjcet',
      label: 'LinkedIn',
      color: 'blue' as IconColor
    },
    { icon: FaMedium, href: 'https://medium.com/@csi_mjcet', label: 'Medium', color: 'teal' as IconColor },
    {
      icon: Instagram,
      href: 'https://www.instagram.com/csi_mjcet',
      label: 'Instagram',
      color: 'pink' as IconColor
    }
  ];

  const quickLinks = [
    { name: 'About Us', href: '/#about', icon: Users, color: 'blue' as IconColor },
    { name: 'Team', href: '/team', icon: Users, color: 'purple' as IconColor },
    { name: 'Magazine', href: '/magazine', icon: BookOpen, color: 'rose' as IconColor },
    { name: 'Events', href: '/events', icon: Calendar, color: 'orange' as IconColor },
    { name: 'Resources', href: '/resources', icon: Award, color: 'yellow' as IconColor },
    { name: 'Membership', href: '/membership', icon: Users, color: 'teal' as IconColor }
  ];

  const [showDev, setShowDev] = useState(true);
  const devRef = useRef<HTMLDivElement | null>(null);

  // Hide the public site footer inside the admin portal (after all hooks!)
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="relative w-full border-t border-zinc-800/40 bg-black">
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Column 1: Branding & Description */}
          <div className="space-y-6 lg:col-span-4">
            <div className="cursor-target flex items-center gap-4">
              <img
                src="/logos/csi_logo.png"
                alt="CSI Logo"
                width={80}
                height={80}
                className="h-20 w-20 object-contain"
              />
              <div>
                <h3 className="text-2xl font-bold text-white">CSI MJCET</h3>
                <p className="text-sm text-zinc-400">
                  Computer Society of India
                </p>
              </div>
            </div>

            <p className="leading-relaxed text-zinc-400">
              Empowering students through technology, innovation, and community.
              Join us in our mission to create future tech leaders.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, idx) => (
                <a
                  id="cursor"
                  key={idx}
                  href={social.href}
                  target="_blank"
                  aria-label={social.label}
                  className={`group cursor-target relative rounded-xl border ${borderColors[social.color]} bg-zinc-900 p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]`}
                >
                  <social.icon className={`h-5 w-5 ${iconColors[social.color]} transition-transform group-hover:scale-110`} />
                </a>
              ))}
            </div>

            {/* Developer Credit moved below main grid */}
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
              <div className="bg-primary h-6 w-1 rounded-full"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-3 text-zinc-400 transition-colors hover:text-white"
                  >
                    <div className="cursor-target flex items-center gap-3 px-4">
                      <div className={`rounded-lg border ${borderColors[link.color]} bg-zinc-900 p-2 transition-all group-hover:scale-110`}>
                        <link.icon className={`h-4 w-4 ${iconColors[link.color]}`} />
                      </div>
                      <span className="text-sm font-medium transition-colors group-hover:text-white">{link.name}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Map */}
          <div className="lg:col-span-5">
            <div className="cursor-target pointer-events-auto overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
              <iframe
                className="[filter:invert(100%)_hue-rotate(180deg)]"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.6563289934675!2d78.44032770923653!3d17.428272983396894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90cd7708dfd7%3A0x77482b7aa8b696f3!2sMuffakham%20Jah%20College%20of%20Engineering%20%26%20Technology%20(MJCET)!5e0!3m2!1sen!2sin!4v1762498137572!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Get In Touch Section */}
        <div className="mt-24 mb-16">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Phone className={`h-6 w-6 ${iconColors.blue}`} />
            <h2 className={`text-3xl font-bold md:text-4xl ${iconColors.blue}`}>
              Get In Touch
            </h2>
          </div>
          <p className="mb-8 text-center text-lg text-zinc-400">
            Have questions? We&apos;re here to help.
          </p>

          <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
            {/* Meer Card */}
            <div className="group cursor-target flex items-center gap-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 px-5 py-4 transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/50">
              <User2 className={`h-5 w-5 ${iconColors.indigo}`} />
              <div>
                <h3 className="text-sm font-bold text-white">Meer</h3>
                <a href="tel:+916304739303" className={`flex items-center gap-2 text-xs font-mono transition-colors hover:text-white ${iconColors.indigo}`}>
                  +91 63047 39303
                </a>
              </div>
            </div>

            {/* Nusrah Card */}
            <div className="group cursor-target flex items-center gap-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 px-5 py-4 transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/50">
              <User2 className={`h-5 w-5 ${iconColors.rose}`} />
              <div>
                <h3 className="text-sm font-bold text-white">Nusrah</h3>
                <a href="tel:+917997098324" className={`flex items-center gap-2 text-xs font-mono transition-colors hover:text-white ${iconColors.rose}`}>
                  +91 79970 98324
                </a>
              </div>
            </div>

            {/* Danish Card */}
            <div className="group cursor-target flex items-center gap-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 px-5 py-4 transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/50">
              <User2 className={`h-5 w-5 ${iconColors.teal}`} />
              <div>
                <h3 className="text-sm font-bold text-white">Danish</h3>
                <a href="tel:+918106110632" className={`flex items-center gap-2 text-xs font-mono transition-colors hover:text-white ${iconColors.teal}`}>
                  +91 81061 10632
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="group cursor-target flex items-center gap-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 px-5 py-4 transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/50">
              <Mail className={`h-5 w-5 ${iconColors.purple}`} />
              <div>
                <h3 className="text-sm font-bold text-white">Email Us</h3>
                <a href="mailto:csi@mjcollege.ac.in" className={`flex items-center gap-2 text-xs font-mono transition-colors hover:text-white ${iconColors.purple}`}>
                  csi@mjcollege.ac.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Credit (Centered) */}
        <AnimatePresence initial={false}>
          {showDev && (
            <motion.div
              id="developer-section"
              ref={devRef}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mt-20 pt-10 border-t flex w-full flex-col items-center"
            >
              <h3 className="text-center text-2xl font-bold text-zinc-400">
                Developed by
              </h3>
              <div className="w-full">
                <Developer />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="mb-4 border-t border-zinc-800"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>© {new Date().getFullYear()} CSI MJCET.</span>
            <span className="hidden md:inline">•</span>
            <span>All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <a
              href="#top"
              className="group cursor-target flex items-center gap-2 text-zinc-500 transition-colors hover:text-white"
            >
              <span>Back to Top</span>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-1 transition-colors group-hover:bg-zinc-800">
                <ArrowUp size={14} />
              </div>
            </a>
            <button
              type="button"
              aria-expanded={showDev}
              aria-controls="developer-section"
              onClick={() => {
                setShowDev((prev) => {
                  const next = !prev;
                  if (!prev) {
                    // reveal and scroll after next paint
                    requestAnimationFrame(() => {
                      setTimeout(
                        () =>
                          devRef.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                          }),
                        50
                      );
                    });
                  }
                  return next;
                });
              }}
              className={`cursor-target relative inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-zinc-300 shadow-inner transition-all hover:bg-zinc-900 hover:text-white`}
            >
              <span>{showDev ? 'Hide Developers' : 'Show Developers'}</span>
              <span
                className={`ml-1 h-2 w-2 rounded-full bg-zinc-600 transition-colors group-hover:bg-zinc-400`}
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
