"use client";

import { motion } from "framer-motion";
import {
  Crown,
  Users,
  UserRound,
  Settings,
  ChartNoAxesCombined,
  Lightbulb,
  Target,
} from "lucide-react";

const roles = [
  {
    number: "01",
    title: "EXECOM",
    icon: Crown,
    description:
      "The Executive Committee (ExeCom) is the core decision-making body of CSI-MJCET. They lead the club, set the vision, plan major initiatives and oversee all portfolios and events.",
    highlights: [
      {
        icon: UserRound,
        title: "Strategic",
        subtitle: "Planning",
      },
      {
        icon: Settings,
        title: "Overall",
        subtitle: "Management",
      },
      {
        icon: ChartNoAxesCombined,
        title: "Guides",
        subtitle: "All Portfolios",
      },
    ],
  },
  {
    number: "02",
    title: "CORE",
    icon: Users,
    description:
      "Core members are the backbone of CSI-MJCET. They work in different portfolios, ideate, execute events and contribute to the smooth functioning of the club.",
    highlights: [
      {
        icon: Lightbulb,
        title: "Hands-on",
        subtitle: "Execution",
      },
      {
        icon: Users,
        title: "Learn &",
        subtitle: "Grow",
      },
      {
        icon: Target,
        title: "Create",
        subtitle: "Real Impact",
      },
    ],
  },
];

export default function RecruitmentRoles() {
  return (
    <section
      id="about-recruitment"
      className="relative overflow-hidden bg-black px-6 py-24 text-white"
    >
      {/* Subtle static glow */}
      <div className="pointer-events-none absolute -left-60 top-20 h-[450px] w-[450px] rounded-full bg-[#ff1e35]/10 blur-[130px]" />

      <div className="pointer-events-none absolute -right-60 bottom-0 h-[450px] w-[450px] rounded-full bg-[#ff1e35]/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mx-auto mb-14 max-w-3xl text-center">

          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-[#ff1e35]" />

            <span className="font-[Orbitron] text-[10px] font-medium tracking-[0.45em] text-white/70">
              KNOW MORE
            </span>

            <span className="h-px w-8 bg-[#ff1e35]" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-[Orbitron] text-4xl font-bold uppercase tracking-tight sm:text-5xl"
          >
            <span className="text-white">Roles at </span>
            <span className="text-[#ff1e35]">CSI</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 --font-poppins text-xs leading-6 text-white/55 sm:text-sm"
          >
            Get to know how CSI functions and the different opportunities
            <br className="hidden sm:block" />
            to grow, contribute and make an impact.
          </motion.p>
        </div>

        {/* ================= ROLE CARDS ================= */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {roles.map((role, index) => {
            const RoleIcon = role.icon;

            return (
              <motion.article
                key={role.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.12,
                }}
                className="
                  group relative overflow-hidden
                  rounded-xl
                  border border-[#ff1e35]/60
                  bg-[#080808]
                  p-6
                  transition-all duration-300
                  hover:border-[#ff1e35]
                  hover:shadow-[0_0_35px_rgba(255,30,53,0.10)]
                  sm:p-7
                "
              >
                {/* Card glow */}
                <div
                  className="
                    pointer-events-none absolute
                    -bottom-24 -right-24
                    h-56 w-56
                    rounded-full
                    bg-[#ff1e35]/10
                    blur-[80px]
                    transition-opacity duration-300
                    group-hover:bg-[#ff1e35]/20
                  "
                />

                {/* Top row */}
                <div className="relative flex items-start justify-between">

                  <div
                    className="
                      flex h-12 w-12 items-center justify-center
                      rounded-lg
                      border border-[#ff1e35]/60
                      bg-[#ff1e35]/5
                    "
                  >
                    <RoleIcon
                      size={24}
                      strokeWidth={1.7}
                      className="text-[#ff1e35]"
                    />
                  </div>

                  <span className="font-[Orbitron] text-xs text-white/40">
                    {role.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="relative mt-5 font-[Orbitron] text-3xl font-bold uppercase tracking-tight">
                  <span className="text-white">
                    {role.title.slice(0, 3)}
                  </span>

                  <span className="text-[#ff1e35]">
                    {role.title.slice(3)}
                  </span>
                </h3>

                {/* Description */}
                <p className="relative mt-2 max-w-xl --font-poppins text-[20px] leading-5 text-white/60 sm:text-xs sm:leading-6">
                  {role.description}
                </p>

                {/* Red divider */}
                <div className="relative group-hover:w-12 duration-150 ease-in mt-5 h-[2px] w-8 bg-[#ff1e35]" />

                {/* Highlights */}
                <div className="relative mt-5 grid grid-cols-3 gap-2">
                  {role.highlights.map((item) => {
                    const ItemIcon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="
                          flex min-h-[58px] items-center gap-2
                          rounded-lg
                          border border-white/10
                          bg-white/[0.025]
                          px-2.5
                          transition-colors duration-300
                          group-hover:border-white/15
                        "
                      >
                        <ItemIcon
                          size={20}
                          strokeWidth={1.7}
                          className="shrink-0 text-[#ff1e35]"
                        />

                        <div className="min-w-0">
                          <p className="--font-poppins text-[16px] leading-3 text-white/80">
                            {item.title}
                          </p>

                          <p className="--font-poppins mt-1.5 text-[12px] leading-3 text-white/45">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}