import React from 'react';
import {
  Ticket,
  IdCard,
  Laptop,
  Code,
  Wrench,
  Trophy,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  User,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: Ticket,
    title: 'Free access to events',
    description: 'Workshops, seminars and tech talks',
  },
  {
    icon: IdCard,
    title: 'Official ID & benefits',
    description: 'Access to CSI national and regional opportunities',
  },
  {
    icon: Laptop,
    title: 'Explore tech domains',
    description: 'AI, Web, Cloud and more',
  },
  {
    icon: Code,
    title: 'DSA & workshops',
    description: 'For active learning and growth',
  },
  {
    icon: Wrench,
    title: 'Guided projects',
    description: 'With mentorship from seniors',
  },
  {
    icon: Trophy,
    title: 'Learn from winners',
    description: 'Sessions with past achievers and industry experts',
  },
];

const reasons = [
  { title: 'Learn, build, compete, lead', description: 'A complete ecosystem to grow your tech journey.' },
  { title: "You don't need to be an expert", description: 'You just need the curiosity to start.' },
  { title: 'Innovate and collaborate', description: 'Turn your ideas into impact.' },
];

const label = 'text-[11px] font-medium uppercase tracking-[0.18em] text-white/55';
const iconCls = 'mt-0.5 h-5 w-5 shrink-0 text-white/60';

export default function MembershipHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative z-10 w-full overflow-x-clip px-4 py-8 text-white sm:px-6 lg:px-10"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1500px] space-y-8 sm:space-y-10">
        {/* HERO: outlined word with a red script laid across it */}
        <section className="relative flex min-h-[calc(100vh-260px)] flex-col items-center justify-center pb-12 pt-0 text-center">

          <div className="flex items-center gap-4 sm:gap-5">
            <span className="hidden h-px w-16 bg-[#ff2a3d] sm:block" />
            <p className={label}>Computer Society of India &middot; 2026–27</p>
            <span className="hidden h-px w-16 bg-[#ff2a3d] sm:block" />
          </div>

          {/* Option B: script sits straight under the word, overlapping it slightly */}
          <h1 className="mt-6 w-full">
            <span className="block font-inter text-[clamp(44px,8vw,96px)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em] text-white">
              Membership
            </span>
            <span className="serif-accent -mt-[0.28em] block whitespace-nowrap text-[clamp(24px,4vw,52px)] leading-none text-[#ff2a3d]">
              join the society
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-7 text-white/70 sm:text-base">
            Don&apos;t just join a club. Build your tech journey with a community built around technology,
            innovation, collaboration and leadership.
          </p>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#membership-form-start"
              className="flex min-h-11 w-full max-w-[250px] items-center justify-center gap-3 whitespace-nowrap border border-[#ff2a3d] bg-[#ff2a3d] px-6 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Become a member <ArrowRight className="h-[18px] w-[18px]" aria-hidden />
            </a>
            <a
              href="#membership-benefits"
              className="flex min-h-11 w-full max-w-[250px] items-center justify-center gap-3 whitespace-nowrap border border-white/80 px-6 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:border-[#ff2a3d] hover:text-[#ff2a3d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              See benefits <ArrowDown className="h-[18px] w-[18px]" aria-hidden />
            </a>
          </div>

          {/* Key figures */}
          <dl className="mt-14 grid w-full max-w-2xl grid-cols-3 divide-x divide-white/10">
            {[
              { value: '100,000+', label: 'Members nationwide' },
              { value: '488+', label: 'Student branches' },
              { value: '₹350', label: 'Membership fee' },
            ].map((f) => (
              <div key={f.label} className="flex flex-col-reverse items-center gap-1.5 px-2">
                <span aria-hidden className="mt-2 h-[3px] w-10 bg-[#ff2a3d]" />
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">{f.label}</dt>
                <dd className="text-[clamp(20px,2.6vw,26px)] font-semibold tabular-nums tracking-[-0.02em] text-white">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* BENEFITS + WHY JOIN: one panel, two columns */}
        <section id="membership-benefits" className="glass-panel scroll-mt-28 grid grid-cols-1 gap-10 p-6 sm:p-10 xl:grid-cols-12 xl:gap-16 xl:p-12">
          <div className="min-w-0 xl:col-span-7">
            <p className={label}>Membership benefits</p>
            <h2 className="mt-3 text-[clamp(28px,4vw,42px)] font-semibold leading-[1.1] tracking-[-0.03em] [text-wrap:balance]">
              What you <span className="serif-accent text-[1.18em] text-[#ff2a3d]">get</span> as a member
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/70">
              A platform to learn, build, collaborate and grow with a community that shares your passion
              for technology.
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <li key={benefit.title} className="flex gap-4 border-t border-white/[0.09] py-5">
                    <Icon className={iconCls} strokeWidth={1.6} aria-hidden />
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-medium text-white">{benefit.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-white/60">{benefit.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="min-w-0 border-t border-white/[0.09] pt-10 xl:col-span-5 xl:border-l xl:border-t-0 xl:pl-12 xl:pt-0">
            <p className={label}>Why join CSI-MJCET</p>
            <h2 className="mt-3 text-[clamp(24px,3vw,30px)] font-semibold leading-[1.2] tracking-[-0.02em]">
              More than just a <span className="serif-accent text-[1.2em]">club</span>
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-white/70">
              Whether you&apos;re a beginner or already building, CSI-MJCET gives you the skills, people and
              opportunities to level up.
            </p>

            <ul className="mt-8 space-y-5">
              {reasons.map((r) => (
                <li key={r.title}>
                  <h3 className="text-[15px] font-medium text-white">{r.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/60">{r.description}</p>
                </li>
              ))}
            </ul>

            <a
              href="#membership-form-start"
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#ff2a3d] px-5 text-sm font-medium text-white transition-colors hover:bg-[#ff4152] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Become a member <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </section>

        {/* CONTACT + CASH PAYMENT: one panel, two columns */}
        <section className="glass-panel grid grid-cols-1 gap-10 p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 xl:p-12">
          <div className="min-w-0">
            <p className={label}>Questions</p>
            <h2 className="mt-3 text-[clamp(24px,3vw,30px)] font-semibold tracking-[-0.02em]">
              Contact <span className="serif-accent text-[1.2em] text-[#ff2a3d]">us</span>
            </h2>
            <p className="mt-2 text-[15px] text-white/70">Feel free to reach out to us for any queries.</p>

            <div className="mt-6 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              <ul className="min-w-0">
                <li className="flex gap-4 border-t border-white/[0.09] py-4">
                  <Phone className={iconCls} strokeWidth={1.6} aria-hidden />
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium text-white">Meer Aymaan Ali</p>
                    <a href="tel:+916304739303" className="mt-1 block text-sm text-white/60 transition-colors hover:text-white">
                      +91 6304739303
                    </a>
                  </div>
                </li>
                <li className="flex gap-4 border-t border-white/[0.09] py-4">
                  <Phone className={iconCls} strokeWidth={1.6} aria-hidden />
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium text-white">Nusrah Khan</p>
                    <a href="tel:+917997098324" className="mt-1 block text-sm text-white/60 transition-colors hover:text-white">
                      +91 79970 98324
                    </a>
                  </div>
                </li>
              </ul>

              <ul className="min-w-0">
                <li className="border-t border-white/[0.09]">
                  <a href="mailto:csi@mjcollege.ac.in" className="flex min-h-11 items-center gap-4 py-4 text-[15px] text-white transition-colors hover:text-white/70">
                    <Mail className="h-5 w-5 shrink-0 text-white/60" strokeWidth={1.6} aria-hidden />
                    <span className="min-w-0 [overflow-wrap:anywhere]">csi@mjcollege.ac.in</span>
                  </a>
                </li>
                <li className="border-t border-white/[0.09]">
                  <a
                    href="https://www.instagram.com/csi_mjcet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center gap-4 py-4 text-[15px] text-white transition-colors hover:text-white/70"
                  >
                    <Instagram className="h-5 w-5 shrink-0 text-white/60" strokeWidth={1.6} aria-hidden />
                    <span className="min-w-0 [overflow-wrap:anywhere]">@csi_mjcet</span>
                  </a>
                </li>
                <li className="border-t border-white/[0.09]">
                  <a
                    href="https://www.linkedin.com/company/csi-mjcet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center gap-4 py-4 text-[15px] text-white transition-colors hover:text-white/70"
                  >
                    <Linkedin className="h-5 w-5 shrink-0 text-white/60" strokeWidth={1.6} aria-hidden />
                    <span className="min-w-0 [overflow-wrap:anywhere]">CSI-MJCET</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="min-w-0 border-t border-white/[0.09] pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
            <p className={label}>Paying offline</p>
            <h2 className="mt-3 text-[clamp(24px,3vw,30px)] font-semibold tracking-[-0.02em]">
              Cash <span className="serif-accent text-[1.2em]">payment</span>
            </h2>
            <p className="mt-2 text-[15px] text-white/70">You can also pay the membership fee in cash.</p>

            <ul className="mt-6">
              <li className="flex gap-4 border-t border-white/[0.09] py-4">
                <Phone className={iconCls} strokeWidth={1.6} aria-hidden />
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-white">Mir Danish Ahmed</p>
                  <a href="tel:+918106110632" className="mt-1 block text-sm text-white/60 transition-colors hover:text-white">
                    +91 8106110632
                  </a>
                </div>
              </li>
              <li className="flex gap-4 border-t border-white/[0.09] py-4">
                <User className={iconCls} strokeWidth={1.6} aria-hidden />
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-white">Faculty Coordinator</p>
                  <p className="mt-1 text-sm text-white/60">Mr. Zainuddin Naveed</p>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
