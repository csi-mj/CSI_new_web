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
    <section className="relative w-full py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          className="mb-12 text-center font-bold uppercase tracking-[0.12em]"
          style={{
            fontFamily: "var(--font-orbitron)",
            fontSize: "clamp(2rem, 5vw, 4.5rem)",
            background:
              "linear-gradient(90deg, #ff8585 0%, #ff263f 45%, #b50920 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Faculty Advisor
        </motion.h2>

        {/* Main Content */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[0.85fr_1.5fr] lg:gap-12">
          {/* Image Placeholder */}
          <motion.div
  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -35 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{
    duration: shouldReduceMotion ? 0 : 0.8,
    ease: [0.22, 1, 0.36, 1],
  }}
  className="relative h-full min-h-[440px] overflow-hidden rounded-2xl border border-red-500/40 sm:min-h-[480px] lg:min-h-0"
>
  <img
    src={image.src}
    alt="CSI-MJCET Faculty Advisor"
    className="absolute inset-0 h-full w-full object-cover object-center"
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
                className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
              >
                Prof.{" "}
                <span className="bg-gradient-to-r from-rose-400 via-red-500 to-red-700 bg-clip-text text-transparent">
                  Zainuddin Naveed
                </span>
              </motion.h3>

              <motion.p
                variants={fadeUp}
                className="mt-4 text-sm leading-relaxed tracking-[0.12em] text-neutral-400 sm:text-base"
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
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      borderColor: "rgba(239,68,68,0.6)",
                    }
              }
              className="relative rounded-2xl border border-red-500/30 bg-transparent p-7 transition-colors duration-300 sm:p-10 lg:p-12"
            >
              {/* Animated Red Accent */}
              <motion.div
                className="absolute bottom-8 left-0 top-8 w-1 origin-top rounded-full bg-gradient-to-b from-rose-400 via-red-500 to-red-800"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.8,
                  delay: shouldReduceMotion ? 0 : 0.35,
                  ease: "easeOut",
                }}
              />

              <p className="pl-5 text-base leading-8 tracking-wide text-neutral-300 sm:pl-7 sm:text-lg sm:leading-9 md:text-xl">
                Guiding CSI-MJCET with unwavering support and vision, our
                Faculty Advisor has been a constant source of{" "}
                <span className="text-rose-400">
                  inspiration, mentorship and encouragement.
                </span>
                As an Assistant Professor in the Department of Computer Science and Engineering at Muffakham Jah College of Engineering and Technology, he plays a pivotal role in nurturing innovation, empowering students to turn ideas into impactful initiatives, and fostering a culture of {""}
                <span className="text-rose-400">
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
