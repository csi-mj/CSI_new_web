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
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  iconColors,
  borderColors,
  translucentBgColors,
  IconColor
} from '@/config/colors';
import { Button } from '@/components/ui/button';

const red = '#ff1e35';

const benefits: Array<{
  icon: any;
  title: string;
  description: string;
  color: IconColor;
}> = [
  {
    icon: Ticket,
    title: 'Free Access to Events',
    description: 'Workshops, seminars and tech talks',
    color: 'blue'
  },
  {
    icon: IdCard,
    title: 'Official ID & Benefits',
    description: 'Access to CSI national and regional opportunities',
    color: 'pink'
  },
  {
    icon: Laptop,
    title: 'Explore Tech Domains',
    description: 'AI, Web, Cloud and more',
    color: 'teal'
  },
  {
    icon: Code,
    title: 'DSA & Workshops',
    description: 'For active learning and growth',
    color: 'purple'
  },
  {
    icon: Wrench,
    title: 'Guided Projects',
    description: 'With mentorship from seniors',
    color: 'orange'
  },
  {
    icon: Trophy,
    title: 'Learn from Winners',
    description: 'Sessions with past achievers and industry experts',
    color: 'yellow'
  }
];

export default function MembershipHeader() {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const navbarHeight = 110;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition - navbarHeight,
      behavior: 'smooth'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="relative w-full overflow-hidden p-4 text-white sm:px-6 lg:px-10"
    >
      {/* Ambient background glows & decorative curves */}
      <div
        className={`pointer-events-none absolute top-0 -right-40 h-[500px] w-[500px] rounded-full ${translucentBgColors.red} opacity-30 blur-[120px]`}
      />
      <div
        className={`pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full ${translucentBgColors.red} opacity-20 blur-[120px]`}
      />

      {/* Decorative curves */}
      <div
        className={`pointer-events-none absolute -top-48 -right-48 h-[600px] w-[600px] rounded-full border ${borderColors.red}`}
      />
      <div
        className={`pointer-events-none absolute -bottom-80 -left-80 h-[750px] w-[750px] rounded-full border ${borderColors.red}`}
      />
      <div className="pointer-events-none absolute -bottom-72 -left-72 h-[680px] w-[680px] rounded-full border border-white/10" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] space-y-10">
        {/* =========================================================
            HEADER
        ========================================================= */}
        <section className="relative flex flex-col items-center pb-4 text-center">
          <div className="mb-5 flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.035] px-5 py-2.5 backdrop-blur-xl">
            <GraduationCap
              className={`h-5 w-5 ${iconColors.red}`}
              strokeWidth={1.8}
            />

            <span className="font-[Orbitron] text-sm font-medium tracking-wide text-white/75 sm:text-base">
              Don’t Just Join a Club. Build Your Tech Journey.
            </span>
          </div>

          <h1 className="font-[Orbitron] text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="text-white">CSI-MJCET </span>
            <span className={iconColors.red}>Membership</span>{' '}
            <span className="font-[Orbitron] text-2xl font-bold text-white/70 sm:text-3xl lg:text-4xl">
              (2026–27)
            </span>
          </h1>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-white/55 sm:text-base lg:text-lg">
            Be part of the Computer Society of India, with 100,000+ members
            across 488+ student branches and a community built around
            technology, innovation, collaboration, and leadership.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="cursor-target h-12 px-8 text-base font-bold sm:px-10 sm:text-lg"
              onClick={() => handleScrollTo('membership-form-start')}
            >
              Apply Now
              <ArrowRight className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="cursor-target h-12 px-8 text-base font-semibold sm:px-10 sm:text-lg"
              onClick={() => handleScrollTo('membership-benefits')}
            >
              Know More
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* =========================================================
            MAIN CONTENT
        ========================================================= */}
        <section
          id="membership-benefits"
          className="grid w-full grid-cols-1 gap-6 xl:grid-cols-12 scroll-mt-28 sm:scroll-mt-32"
        >
          {/* =======================================================
              BENEFITS
          ======================================================= */}
          <div className="bg-card/30 border-border cursor-target relative overflow-hidden rounded-[26px] border p-6 sm:p-8 lg:p-10 xl:col-span-7">
            <div className="relative z-10">
              <div className="border-border/70 mb-6 border-b pb-5">
                <div className="mb-2 flex items-center gap-3">
                  <span
                    className={`font-[Orbitron] text-[11px] font-bold tracking-[0.3em] ${iconColors.red} uppercase`}
                  >
                    Membership Benefits
                  </span>
                </div>

                <h2 className="font-[Orbitron] text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                  What Do You <span className={`${iconColors.red}`}>Get?</span>
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                  A platform to learn, build, collaborate and grow with a
                  community that shares your passion for technology.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      key={benefit.title}
                      className="group flex items-start gap-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-current bg-transparent transition-all duration-300 ${iconColors[benefit.color]} opacity-80 group-hover:opacity-100`}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </div>

                      <div className="pt-0.5">
                        <h3 className="text-sm font-bold text-white sm:text-base">
                          {benefit.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-white/50 sm:text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-card/30 border-border cursor-target relative flex flex-col justify-between overflow-hidden rounded-[26px] border p-6 sm:p-8 lg:p-10 xl:col-span-5">
            <div className="relative z-10">
              <div className="border-border/70 mb-6 border-b pb-5">
                <div className="mb-2 flex items-center gap-3">
                  <span
                    className={`font-[Orbitron] text-[11px] font-bold tracking-[0.3em] ${iconColors.red} uppercase`}
                  >
                    Why Join CSI-MJCET?
                  </span>
                </div>

                <h2 className="max-w-lg font-[Orbitron] text-2xl leading-[1.1] font-black tracking-tight sm:text-3xl">
                  More Than Just
                  <br />a <span className={`${iconColors.red}`}>Club</span>
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
                  Whether you’re a beginner or already building, CSI-MJCET gives
                  you the skills, people, and opportunities to level up.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-current bg-transparent ${iconColors.yellow} opacity-80 hover:opacity-100`}
                  >
                    <Zap className="h-5 w-5" strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white sm:text-base">
                      Learn. Build. Compete. Collaborate. Lead.
                    </h3>
                    <p className="mt-1 text-xs text-white/50 sm:text-sm">
                      A complete ecosystem to grow your tech journey.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-current bg-transparent ${iconColors.cyan} opacity-80 hover:opacity-100`}
                  >
                    <Users className="h-5 w-5" strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white sm:text-base">
                      You don’t need to be an expert.
                    </h3>

                    <p className="mt-1 text-xs text-white/50 sm:text-sm">
                      You just need the curiosity to start.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-current bg-transparent ${iconColors.orange} opacity-80 hover:opacity-100`}
                  >
                    <Lightbulb className="h-5 w-5" strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white sm:text-base">
                      Innovate. Collaborate. Dominate.
                    </h3>
                    <p className="mt-1 text-xs text-white/50 sm:text-sm">
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
          <div className="bg-card/30 border-border cursor-target relative overflow-hidden rounded-[26px] border p-6 backdrop-blur-[2px] sm:p-8">
            <div className="relative z-10">
              <div className="border-border/70 mb-6 flex items-center gap-4 border-b pb-5">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-current bg-transparent ${iconColors.blue} opacity-80 hover:opacity-100`}
                >
                  <MessageCircle className="h-6 w-6" strokeWidth={1.8} />
                </div>

                <div>
                  <h2 className="font-[Orbitron] text-xl font-black sm:text-2xl">
                    Contact <span className={`${iconColors.red}`}>Us</span>
                  </h2>

                  <p className="mt-0.5 text-sm text-white/50">
                    Feel free to reach out to us for any queries.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="min-w-0 space-y-5">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-current bg-transparent ${iconColors.teal} opacity-80 hover:opacity-100`}
                    >
                      <Phone className="h-5 w-5" strokeWidth={1.8} />
                    </div>

                    <div className="pt-0.5">
                      <p className="text-sm font-bold text-white">
                        Meer Aymaan Ali
                      </p>
                      <a
                        href="tel:+916304739303"
                        className={`mt-0.5 block text-sm text-white/50 transition-colors hover:${iconColors.red}`}
                      >
                        +91 6304739303
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-current bg-transparent ${iconColors.pink} opacity-80 hover:opacity-100`}
                    >
                      <Phone className="h-5 w-5" strokeWidth={1.8} />
                    </div>

                    <div className="pt-0.5">
                      <p className="text-sm font-bold text-white">
                        Nusrah Khan
                      </p>
                      <a
                        href="tel:+917997098324"
                        className={`mt-0.5 block text-sm text-white/50 transition-colors hover:${iconColors.red}`}
                      >
                        +91 79970 98324
                      </a>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 border-white/[0.08] sm:border-l sm:pl-6 [&_span]:min-w-0 [&_span]:[overflow-wrap:anywhere]">
                  <div className="space-y-4">
                    <a
                      href="mailto:csi@mjcollege.ac.in"
                      className="group flex items-center gap-3 transition-colors hover:underline"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-current bg-transparent ${iconColors.orange} opacity-80 hover:opacity-100`}
                      >
                        <Mail className="h-5 w-5" strokeWidth={1.8} />
                      </div>

                      <span
                        className={`min-w-0 text-sm font-bold [overflow-wrap:anywhere] text-white transition-colors group-hover:${iconColors.red}`}
                      >
                        csi@mjcollege.ac.in
                      </span>
                    </a>

                    <a
                      href="https://www.instagram.com/csi_mjcet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 transition-colors hover:underline"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-current bg-transparent ${iconColors.pink} opacity-80 hover:opacity-100`}
                      >
                        <Instagram className="h-5 w-5" strokeWidth={1.8} />
                      </div>

                      <span
                        className={`text-sm font-bold text-white transition-colors group-hover:${iconColors.red}`}
                      >
                        @csi_mjcet
                      </span>
                    </a>

                    <a
                      href="https://www.linkedin.com/company/csi-mjcet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 transition-colors hover:underline"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-current bg-transparent ${iconColors.blue} opacity-80 hover:opacity-100`}
                      >
                        <Linkedin className="h-5 w-5" strokeWidth={1.8} />
                      </div>

                      <span
                        className={`text-sm font-bold text-white transition-colors group-hover:${iconColors.red}`}
                      >
                        CSI-MJCET
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CASH PAYMENT */}
          <div className="bg-card/30 border-border cursor-target relative overflow-hidden rounded-[26px] border p-6 sm:p-8">
            <div className="relative z-10">
              <div className="border-border/70 mb-6 flex items-center gap-4 border-b pb-5">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-current bg-transparent ${iconColors.green} opacity-80 hover:opacity-100`}
                >
                  <CreditCard className="h-6 w-6" strokeWidth={1.8} />
                </div>

                <div>
                  <h2 className="font-[Orbitron] text-xl font-black sm:text-2xl">
                    Cash <span className={`${iconColors.red}`}>Payment</span>
                  </h2>

                  <p className="mt-0.5 text-sm text-white/50">
                    You can also pay the membership fee in cash.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-current bg-transparent ${iconColors.yellow} opacity-80 hover:opacity-100`}
                  >
                    <Phone className="h-5 w-5" strokeWidth={1.8} />
                  </div>

                  <div className="pt-0.5">
                    <p className="text-sm font-bold text-white">
                      Mir Danish Ahmed
                    </p>

                    <a
                      href="tel:+918106110632"
                      className={`mt-0.5 block text-sm text-white/50 transition-colors hover:${iconColors.red}`}
                    >
                      +91 8106110632
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-current bg-transparent ${iconColors.cyan} opacity-80 hover:opacity-100`}
                  >
                    <User className="h-5 w-5" strokeWidth={1.8} />
                  </div>

                  <div className="pt-0.5">
                    <p className="text-sm font-bold text-white">
                      Faculty Coordinator
                    </p>
                    <p className="mt-0.5 text-sm text-white/50">
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
