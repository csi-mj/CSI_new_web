'use client'
import React, { useRef, useState } from 'react'
import { Developer } from './Developer'
import { ArrowUp, Mail, MapPin, Phone, Github, Linkedin, Twitter, Instagram, Calendar, Users, BookOpen, Award } from 'lucide-react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { FaMedium } from 'react-icons/fa'



function Footer() {
  const socialLinks = [
    { icon: Github, href: 'https://github.com/orgs/csi-mj', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/csi-mjcet', label: 'LinkedIn' },
    { icon: FaMedium, href: 'https://medium.com/@csi_mjcet', label: 'Medium' },
    { icon: Instagram, href: 'https://www.instagram.com/csi_mjcet', label: 'Instagram' },
  ]

  const quickLinks = [
    { name: 'About Us', href: '/#about', icon: Users },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Magazine', href: '/magazine', icon: BookOpen },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Resources', href: '/resources', icon: Award },
    { name: 'Membership', href: '/membership', icon: Users },
  ]

  const contactInfo = [
    { icon: Mail, text: 'csi@mjcet.ac.in', href: 'mailto:csi@mjcet.ac.in' },
  ]

  const [showDev, setShowDev] = useState(false)
  const devRef = useRef<HTMLDivElement | null>(null)

  return (
    <footer className="relative w-full border-t border-zinc-800/40">

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Column 1: Branding & Description */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex cursor-target items-center gap-4">
              <img
                src="/logos/csi_logo.png"
                alt="CSI Logo"
                width={80}
                height={80}
                className="h-20 w-20 object-contain"
              />
              <div>
                <h3 className="text-2xl font-bold text-white">CSI MJCET</h3>
                <p className="text-sm text-zinc-400">Computer Society of India</p>
              </div>
            </div>

            <p className="text-zinc-400 leading-relaxed">
              Empowering students through technology, innovation, and community. Join us in our mission to create future tech leaders.
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
                  className="group relative p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all duration-300 cursor-target"
                >
                  <social.icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
            {/* Developer Credit moved below main grid */}

          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-3 cursor-target px-4">
                      <div className="p-2 bg-zinc-900 group-hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors ">
                        <link.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{link.name}</span>
                    </div>

                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Newsletter */}
          <div className="lg:col-span-5 space-y-8">
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                Get in Touch
              </h3>
              <ul className="space-y-4">
                {contactInfo.map((contact, idx) => (
                  <li key={idx}>
                    <a
                      id="cursor"
                      href={contact.href}
                      className="group flex items-start gap-4 p-4 bg-zinc-900/50 cursor-target hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all duration-300"
                    >
                      <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                        <contact.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-zinc-400 group-hover:text-white transition-colors">
                        {contact.text}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-xl overflow-hidden cursor-target border border-zinc-800 bg-zinc-900/50 pointer-events-auto">
                <iframe
                  className="[filter:invert(100%)_hue-rotate(180deg)]"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.6563289934675!2d78.44032770923653!3d17.428272983396894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90cd7708dfd7%3A0x77482b7aa8b696f3!2sMuffakham%20Jah%20College%20of%20Engineering%20%26%20Technology%20(MJCET)!5e0!3m2!1sen!2sin!4v1762498137572!5m2!1sen!2sin"
                  width="100%"
                  height="180"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
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
              transition={{ duration: .6, ease: 'easeOut' }}
              className="mt-24 w-full flex flex-col items-center"
            >
              <h3 className="text-2xl font-bold text-zinc-400 text-center">Developed by</h3>
              <div className="w-full">
                <Developer />
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Divider */}
        <div className="mt-16 mb-8 border-t border-zinc-800"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>© {new Date().getFullYear()} CSI MJCET.</span>
            <span className="hidden md:inline">•</span>
            <span>All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-sm">

            <a
              href="#top"
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group cursor-target"
            >
              <span>Back to Top</span>
              <div className="p-1 bg-zinc-900 group-hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors">
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
                      setTimeout(() => devRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
                    });
                  }
                  return next;
                });
              }}
              className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-target shadow-inner
                bg-zinc-900/50 cursor-pointer border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white
              `}
            >
              <span>{showDev ? 'Hide Developers' : 'Developers'}</span>
              <span
                className={`ml-1 h-2 w-2 rounded-full transition-colors bg-zinc-600 group-hover:bg-zinc-400`}
              />
            </button>

          </div>
        </div>


      </div>
    </footer>
  )
}

export default Footer