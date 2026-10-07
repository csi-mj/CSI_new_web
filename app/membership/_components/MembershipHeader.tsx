import React from 'react';
import {
  GraduationCap,
  Flame,
  Ticket,
  IdCard,
  Laptop,
  Code,
  Wrench,
  Trophy,
  Users,
  Zap,
  Lightbulb,
  MessageCircle,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  CreditCard,
  User,
  Rocket,
} from 'lucide-react';
import { motion } from 'framer-motion';
const red = '#ff1e35';

const benefits = [
  {
    icon: Ticket,
    title: 'Free Access to Events',
    description: 'Workshops, seminars and tech talks',
  },
  {
    icon: IdCard,
    title: 'Official ID & Benefits',
    description: 'Access to CSI national and regional opportunities',
  },
  {
    icon: Laptop,
    title: 'Explore Tech Domains',
    description: 'AI, Web, Cloud and more',
  },
  {
    icon: Code,
    title: 'DSA & Workshops',
    description: 'For active learning and growth',
  },
  {
    icon: Wrench,
    title: 'Guided Projects',
    description: 'With mentorship from seniors',
  },
  {
    icon: Trophy,
    title: 'Learn from Winners',
    description: 'Sessions with past achievers and industry experts',
  },
];

export default function MembershipHeader() {
  return (
   <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: 0.9,
    ease: [0.22, 1, 0.36, 1],
  }}
  className="relative w-full overflow-hidden bg-[#050505] px-4 py-8 text-white sm:px-6 lg:px-10"
>
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-56 top-40 h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-56 top-[420px] h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/2 top-[900px] h-[400px] w-[700px] -translate-x-1/2 bg-red-600/[0.035] blur-[130px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] space-y-10">
        {/* =========================================================
            HEADER
        ========================================================= */}
        <section className="relative flex flex-col items-center pb-2 text-center">
          <div className="mb-5 flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.035] px-5 py-2.5 backdrop-blur-xl">
            <GraduationCap
              className="h-5 w-5"
              style={{ color: red }}
              strokeWidth={1.8}
            />

            <span className="text-sm  font-[Orbitron] font-medium tracking-wide text-white/75 sm:text-base">
              Don’t Just Join a Club. Build Your Tech Journey.
            </span>
          </div>

          <h1 className="text-4xl font-[Orbitron] font-black tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="text-white">CSI-MJCET </span>
            <span
              className="bg-gradient-to-r from-[#ff3047] via-[#ff5365] to-[#d9152c] bg-clip-text text-transparent"
            >
              Membership
            </span>{' '}
            <span className="text-2xl font-[Orbitron] font-bold text-white/70 sm:text-3xl lg:text-4xl">
              (2026–27)
            </span>
          </h1>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-white/55 sm:text-base lg:text-lg">
            Be part of the Computer Society of India, with 100,000+ members
            across 488+ student branches and a community built around
            technology, innovation, collaboration, and leadership.
          </p>
        </section>

        {/* =========================================================
            MAIN CONTENT
        ========================================================= */}
        <section className="grid w-full grid-cols-1 gap-6 xl:grid-cols-12">
          {/* =======================================================
              BENEFITS
          ======================================================= */}
          <div
            className="
              relative overflow-hidden rounded-[26px]
              border border-white/[0.13]
              bg-gradient-to-br from-white/[0.045] via-[#090909] to-[#110304]
              p-6 sm:p-8 lg:p-10
              xl:col-span-7
            "
          >
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-600/10 blur-[90px]" />

            <div className="relative z-10">
              <div className="mb-7">
                <div className="mb-3 flex items-center gap-3">
                  <motion.span
  className="relative flex h-3 w-3 shrink-0 items-center justify-center"
  animate={{
    opacity: [1, 0.65, 1],
  }}
  transition={{
    duration: 1.2,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
>
  {/* Expanding SOS glow */}
  <motion.span
    className="absolute h-5 w-5 rounded-full border border-[#ff1e35]/70"
    animate={{
      scale: [0.7, 1.8],
      opacity: [0.8, 0],
    }}
    transition={{
      duration: 1.4,
      repeat: Infinity,
      ease: 'easeOut',
    }}
  />

  {/* Outer glow */}
  <motion.span
    className="absolute h-4 w-4 rounded-full bg-[#ff1e35]/30 blur-[5px]"
    animate={{
      scale: [0.8, 1.5, 0.8],
      opacity: [0.5, 0.9, 0.5],
    }}
    transition={{
      duration: 1.2,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />

  {/* Red SOS core */}
  <span className="relative h-2.5 w-2.5 rounded-full bg-[#ff1e35] shadow-[0_0_12px_4px_rgba(255,30,53,0.75)]" />
</motion.span>

                  <span className="text-[11px] font-[Orbitron] font-bold uppercase tracking-[0.3em] text-[#ff3148]">
                    Membership Benefits
                  </span>
                </div>

                <h2 className="text-3xl font-[Orbitron] font-black tracking-tight sm:text-4xl lg:text-5xl">
                  What Do You{' '}
                  <span className="text-[#ff263e]">Get?</span>
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
                  A platform to learn, build, collaborate and grow with a
                  community that shares your passion for technology.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      key={benefit.title}
                      className="group flex items-start gap-4"
                    >
                      <div
                        className="
                          flex h-[78px] w-[78px] shrink-0 items-center
                          justify-center rounded-[18px]
                          border border-[#ff1e35]/35
                          bg-gradient-to-br from-[#ff1e35]/10 to-transparent
                          shadow-[inset_0_0_25px_rgba(255,30,53,0.04)]
                          transition-all duration-300
                          group-hover:border-[#ff1e35]/70
                          group-hover:bg-[#ff1e35]/10
                          group-hover:shadow-[0_0_25px_rgba(255,30,53,0.12)]
                        "
                      >
                        <Icon
                          className="h-8 w-8 text-[#ff2942]"
                          strokeWidth={1.8}
                        />
                      </div>

                      <div className="pt-1">
                        <h3 className="text-base font-bold text-white sm:text-lg">
                          {benefit.title}
                        </h3>

                        <p className="mt-1 text-sm leading-5 text-white/50">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =======================================================
              WHY JOIN
          ======================================================= */}
          <div
            className="
              relative min-h-full overflow-hidden rounded-[26px]
              border border-[#ff1e35]/25
              bg-gradient-to-br from-[#100405] via-[#090909] to-[#120507]
              p-6 sm:p-8 lg:p-10
              xl:col-span-5
            "
          >
            {/* Decorative geometric shapes */}
            <div className="pointer-events-none absolute -right-12 top-8 h-36 w-36 rotate-[38deg] rounded-2xl border border-[#ff1e35]/25 bg-[#ff1e35]/[0.025]" />

            <div className="pointer-events-none absolute -right-24 top-20 h-36 w-36 rotate-[38deg] rounded-2xl border border-[#ff1e35]/20 bg-[#ff1e35]/[0.025]" />

            <div className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-red-600/10 blur-[80px]" />

            <div className="relative z-10">
              <div className="mb-7">
                <div className="mb-3 flex items-center gap-3">
                  <motion.span
  className="relative flex h-3 w-3 shrink-0 items-center justify-center"
  animate={{
    opacity: [1, 0.65, 1],
  }}
  transition={{
    duration: 1.2,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
>
  {/* Expanding SOS glow */}
  <motion.span
    className="absolute h-5 w-5 rounded-full border border-[#ff1e35]/70"
    animate={{
      scale: [0.7, 1.8],
      opacity: [0.8, 0],
    }}
    transition={{
      duration: 1.4,
      repeat: Infinity,
      ease: 'easeOut',
    }}
  />

  {/* Outer glow */}
  <motion.span
    className="absolute h-4 w-4 rounded-full bg-[#ff1e35]/30 blur-[5px]"
    animate={{
      scale: [0.8, 1.5, 0.8],
      opacity: [0.5, 0.9, 0.5],
    }}
    transition={{
      duration: 1.2,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />

  {/* Red SOS core */}
  <span className="relative h-2.5 w-2.5 rounded-full bg-[#ff1e35] shadow-[0_0_12px_4px_rgba(255,30,53,0.75)]" />
</motion.span>

                  <span className="text-[11px] font-[Orbitron] font-bold uppercase tracking-[0.3em] text-[#ff3148]">
                    Why Join CSI-MJCET?
                  </span>
                </div>

                <h2 className="max-w-lg text-3xl font-[Orbitron] font-black leading-[1.1] tracking-tight sm:text-4xl">
                  More Than Just
                  <br />
                  a <span className="text-[#ff263e]">Club</span>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/55 sm:text-base">
                  Whether you’re a beginner or already building, CSI-MJCET
                  gives you the skills, people, and opportunities to level up.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#ff1e35]/50 bg-[#ff1e35]/[0.06]">
                    <Zap
                      className="h-6 w-6 text-[#ff2942]"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      Learn. Build. Compete. Collaborate. Lead.
                    </h3>
                    <p className="mt-1 text-sm text-white/50">
                      A complete ecosystem to grow your tech journey.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#ff1e35]/50 bg-[#ff1e35]/[0.06]">
                    <Users
                      className="h-6 w-6 text-[#ff2942]"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      You don’t need to be an expert.
                    </h3>

                    <p className="mt-1 flex items-center gap-2 text-sm text-white/50">
                      You just need the curiosity to start.
                      <Rocket
                        className="h-4 w-4 text-[#ff2942]"
                        strokeWidth={1.8}
                      />
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#ff1e35]/50 bg-[#ff1e35]/[0.06]">
                    <Lightbulb
                      className="h-6 w-6 text-[#ff2942]"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      Innovate. Collaborate. Dominate.
                    </h3>
                    <p className="mt-1 text-sm text-white/50">
                      Turn your ideas into impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CONTACT + CASH PAYMENT
        ========================================================= */}
        <section className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          {/* CONTACT */}
          <div
            className="
              relative overflow-hidden rounded-[26px]
              border border-[#ff1e35]/60
              bg-gradient-to-br from-[#0d0809] via-[#080808] to-[#100304]
              p-6 sm:p-8
            "
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-red-600/10 blur-[80px]" />

            <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 border-l border-b border-[#ff1e35]/30" />

            <div className="relative z-10">
              <div className="mb-8 flex items-center gap-5">
                <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-[20px] border border-[#ff1e35]/50 bg-[#ff1e35]/[0.07]">
                  <MessageCircle
                    className="h-10 w-10 text-[#ff2942]"
                    strokeWidth={1.6}
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-[Orbitron] font-black sm:text-3xl">
                    Contact <span className="text-[#ff263e]">Us</span>
                  </h2>

                  <p className="mt-1 text-sm text-white/50 sm:text-base">
                    Feel free to reach out to us for any queries.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                <div className="space-y-7">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[17px] border border-[#ff1e35]/40 bg-[#ff1e35]/[0.05]">
                      <Phone
                        className="h-7 w-7 text-[#ff2942]"
                        strokeWidth={1.7}
                      />
                    </div>

                    <div className="pt-1">
                      <p className="font-bold text-white">Meer Aymaan Ali</p>
                      <a
                        href="tel:+916304739303"
                        className="mt-1 block text-sm text-white/50 transition-colors hover:text-[#ff2942]"
                      >
                        +91 6304739303
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[17px] border border-[#ff1e35]/40 bg-[#ff1e35]/[0.05]">
                      <Phone
                        className="h-7 w-7 text-[#ff2942]"
                        strokeWidth={1.7}
                      />
                    </div>

                    <div className="pt-1">
                      <p className="font-bold text-white">Nusrah Khan</p>
                      <a
                        href="tel:+917997098324"
                        className="mt-1 block text-sm text-white/50 transition-colors hover:text-[#ff2942]"
                      >
                        +91 79970 98324
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border-white/[0.08] sm:border-l sm:pl-8">
                  <div className="space-y-6">
                    <a
                      href="mailto:csi@mjcollege.ac.in"
                      className="flex items-center gap-4 transition-colors group"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-[#ff1e35]/40 bg-[#ff1e35]/[0.05]">
                        <Mail
                          className="h-6 w-6 text-[#ff2942]"
                          strokeWidth={1.7}
                        />
                      </div>

                      <span className="font-bold text-white transition-colors group-hover:text-[#ff2942]">
                        csi@mjcollege.ac.in
                      </span>
                    </a>

                    <a
                      href="https://www.instagram.com/csi_mjcet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 transition-colors group"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-[#ff1e35]/40 bg-[#ff1e35]/[0.05]">
                        <Instagram
                          className="h-6 w-6 text-[#ff2942]"
                          strokeWidth={1.7}
                        />
                      </div>

                      <span className="font-bold text-white transition-colors group-hover:text-[#ff2942]">
                        @csi_mjcet
                      </span>
                    </a>

                    <a
                      href="https://www.linkedin.com/company/csi-mjcet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 transition-colors group"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-[#ff1e35]/40 bg-[#ff1e35]/[0.05]">
                        <Linkedin
                          className="h-6 w-6 text-[#ff2942]"
                          strokeWidth={1.7}
                        />
                      </div>

                      <span className="font-bold text-white transition-colors group-hover:text-[#ff2942]">
                        CSI-MJCET
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CASH PAYMENT */}
          <div
            className="
              relative overflow-hidden rounded-[26px]
              border border-[#ff1e35]/60
              bg-gradient-to-br from-[#0d0809] via-[#080808] to-[#100304]
              p-6 sm:p-8
            "
          >
            <div className="pointer-events-none absolute -right-16 top-10 h-48 w-48 rotate-[35deg] rounded-2xl border border-[#ff1e35]/20 bg-[#ff1e35]/[0.025]" />

            <div className="pointer-events-none absolute -right-24 bottom-0 h-52 w-52 rounded-full bg-red-600/10 blur-[80px]" />

            <div className="relative z-10">
              <div className="mb-8 flex items-center gap-5">
                <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-[20px] border border-[#ff1e35]/50 bg-[#ff1e35]/[0.07]">
                  <CreditCard
                    className="h-10 w-10 text-[#ff2942]"
                    strokeWidth={1.6}
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-[Orbitron] font-black sm:text-3xl">
                    Cash <span className="text-[#ff263e]">Payment</span>
                  </h2>

                  <p className="mt-1 text-sm text-white/50 sm:text-base">
                    You can also pay the membership fee in cash.
                  </p>
                </div>
              </div>

              <div className="space-y-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[17px] border border-[#ff1e35]/40 bg-[#ff1e35]/[0.05]">
                    <Phone
                      className="h-7 w-7 text-[#ff2942]"
                      strokeWidth={1.7}
                    />
                  </div>

                  <div className="pt-1">
                    <p className="font-bold text-white">Mir Danish Ahmed</p>

                    <a
                      href="tel:+918106110632"
                      className="mt-1 block text-sm text-white/50 transition-colors hover:text-[#ff2942]"
                    >
                      +91 8106110632
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[17px] border border-[#ff1e35]/40 bg-[#ff1e35]/[0.05]">
                    <User
                      className="h-7 w-7 text-[#ff2942]"
                      strokeWidth={1.7}
                    />
                  </div>

                  <div className="pt-1">
                    <p className="font-bold text-white">Faculty Coordinator</p>
                    <p className="mt-1 text-sm text-white/50">
                      Mr. Zainuddin Naveed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}