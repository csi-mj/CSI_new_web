"use client";

import { motion, useReducedMotion } from "framer-motion";
import image from "@/public/about/zainsir.jpg";
export default function Faculty() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="relative w-full py-14 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          className="mb-10 text-center font-semibold tracking-[-0.03em] text-white"
          style={{ fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)" }}
        >
          Faculty <span className="serif-accent text-[1.2em] text-[#ff2a3d]">advisor</span>
        </motion.h2>

        {/* Main Content */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[0.8fr_1.4fr] lg:gap-10">
          {/* Image Placeholder */}
          <motion.div
  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -35 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{
    duration: shouldReduceMotion ? 0 : 0.8,
    ease: [0.22, 1, 0.36, 1],
  }}
  className="group relative h-full min-h-[340px] overflow-hidden rounded-2xl border border-white/10 sm:min-h-[380px] lg:min-h-0"
>
  <img
    src={image.src}
    alt="CSI-MJCET Faculty Advisor"
    className="absolute transition-transform duration-700 ease-in-out group-hover:scale-110 inset-0 h-full w-full object-cover object-center"
  />
</motion.div>

          {/* Right Content */}
          <div className="flex min-w-0 flex-col justify-center">
            {/* Name and Designation */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: shouldReduceMotion ? 0 : 0.15,
                  },
                },
              }}
              className="mb-8"
            >
              <motion.div
                variants={fadeUp}
                className="mb-4 flex items-center gap-3"
              >
                <motion.span
                  className="h-1 w-12 rounded-full bg-gradient-to-r from-red-600 to-rose-400"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.6,
                    ease: "easeOut",
                  }}
                  style={{ transformOrigin: "left" }}
                />

                <span className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-400 sm:text-sm">
                  CSI-MJCET
                </span>
              </motion.div>

              <motion.h3
                variants={fadeUp}
                className="text-[clamp(26px,3.2vw,40px)] font-semibold leading-tight tracking-[-0.02em] text-white"
              >
                Prof.{" "}
                <span>
                  Zainuddin Naveed
                </span>
              </motion.h3>

              <motion.p
                variants={fadeUp}
                className="mt-3 text-sm leading-relaxed text-white/60"
              >
                Assistant Professor · Department of Computer Science and
                Engineering · MJCET
              </motion.p>
            </motion.div>

            {/* Description Box */}
            <motion.div
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 30,
              }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.8,
                delay: shouldReduceMotion ? 0 : 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass-panel relative p-6 sm:p-8"
            >
              {/* Animated Red Accent */}
              <motion.div
                className="absolute bottom-8 left-0 top-8 w-[2px] origin-top rounded-full bg-[#ff2a3d]/70"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.8,
                  delay: shouldReduceMotion ? 0 : 0.35,
                  ease: "easeOut",
                }}
              />

              <p className="pl-5 text-[15px] leading-7 text-white/70 sm:pl-6 sm:text-base sm:leading-8">
                Guiding CSI-MJCET with unwavering support and vision, our
                Faculty Advisor has been a constant source of{" "}
                <span className="font-medium text-white">
                  inspiration, mentorship and encouragement.
                </span>
                As an Assistant Professor in the Department of Computer Science and Engineering at Muffakham Jah College of Engineering and Technology, he plays a pivotal role in nurturing innovation, empowering students to turn ideas into impactful initiatives, and fostering a culture of {""}
                <span className="font-medium text-white">
                  collaboration and continuous learning
                </span>
                . His invaluable guidance and commitment to student development continue to strengthen our community, inspire new possibilities, and shape the future of CSI-MJCET.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
