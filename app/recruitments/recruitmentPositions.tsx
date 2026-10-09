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
      "Executive Committee (Execom) members lead specific portfolios of the organization. They are responsible for planning, coordinating, and overseeing the work of their respective portfolios and guiding the Core team working under them.",
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
    title: "CORE MEMBERS",
    icon: Users,
    description:
      "Core Members work under the Execom leads in their respective portfolios. They learn the required technologies and skills, contribute to the portfolio’s core work, and execute assigned tasks under the guidance of the Execom lead.",
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
    <section id="about-recruitment" className="relative px-6 py-24 text-white">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">Know more</p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-3 font-inter text-[clamp(32px,5vw,52px)] font-semibold leading-[1.05] tracking-[-0.03em]"
          >
            Roles at <span className="serif-accent text-[1.2em] text-[#ff2a3d]">CSI</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-white/70"
          >
            Get to know how CSI functions and the different opportunities to grow, contribute and make an
            impact.
          </motion.p>
        </div>

        {/* ================= ROLES: one panel, two columns ================= */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel grid grid-cols-1 p-6 sm:p-10 lg:grid-cols-2"
        >
          {roles.map((role, index) => {
            const RoleIcon = role.icon;

            return (
              <article
                key={role.title}
                className={`min-w-0 ${
                  index === 0
                    ? 'pb-10 lg:pb-0 lg:pr-12'
                    : 'border-t border-white/[0.09] pt-10 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0'
                }`}
              >
                <div className="flex items-center gap-3">
                  <RoleIcon size={18} strokeWidth={1.6} className="text-white/60" aria-hidden />
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
                    {role.number}
                  </span>
                </div>

                <h3 className="mt-4 font-inter text-[clamp(26px,3vw,32px)] font-semibold uppercase tracking-[-0.02em] text-white">
                  {role.title}
                </h3>

                <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/70">{role.description}</p>

                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 sm:gap-x-6">
                  {role.highlights.map((item) => {
                    const ItemIcon = item.icon;

                    return (
                      <li key={item.title} className="flex min-w-0 gap-3 border-t border-white/[0.09] py-4">
                        <ItemIcon size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-white/60" aria-hidden />
                        <div className="min-w-0">
                          <p className="text-[15px] font-medium leading-tight text-white">{item.title}</p>
                          <p className="mt-1 text-[13px] leading-tight text-white/60">{item.subtitle}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
