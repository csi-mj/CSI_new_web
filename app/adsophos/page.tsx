"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AdsophosAbout from "./components/AdsophosAbout";
import LivePreview from "./components/LivePreview";
import RedirectButton from "./components/RedirectButton";
import HackrevCta from "../home/_components/Hot/HackrevCta";

const PINK = "#ec4899";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap";

const AdsophosPortalPage = () => {
  /* Load arcade fonts via <link> injected into <head> */
  useEffect(() => {
    if (!document.getElementById("adsophos-fonts")) {
      const link = document.createElement("link");
      link.id = "adsophos-fonts";
      link.rel = "stylesheet";
      link.href = FONT_URL;
      document.head.appendChild(link);
    }
  }, []);

  return (
    <main
      className="min-h-screen overflow-hidden text-white"
      style={{
        backgroundColor: 'rgb(9,9,11)',
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.015) 2px,
            rgba(255,255,255,0.015) 4px
          )
        `
      }}
    >
      {/* ── HERO — Logo + ADSOPHOS heading ── */}
      <div className="flex items-center justify-center gap-6 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="cursor-target"
        >
          <Image
            src="/logos/adsophos.png"
            alt="ADSOPHOS 2026"
            width={220}
            height={220}
            className="w-24 md:w-36"
            priority
          />
        </motion.div>

        <motion.h1
          className="cursor-target flex justify-center text-2xl tracking-[0.1em] text-white uppercase md:text-5xl"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            textShadow: `3px 3px 0px ${PINK}, 6px 6px 0px rgba(0,0,0,0.5)`
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {'ADSOPHOS'.split('').map((letter, index) => (
            <motion.span
              key={index}
              className="inline-block hover:text-[#ffba00]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.06 }}
              whileHover={{
                y: -8,
                scale: 1.2,
                transition: { type: 'spring', stiffness: 100 }
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      {/* About Section — 1:1 replica from Adsophos */}
      <div className="">
        <AdsophosAbout />
      </div>

      {/* Live Iframe Preview */}
      <div className="">
        <div
          className="mb-4 py-8 text-center text-xl tracking-widest text-white uppercase md:text-2xl"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            textShadow: `3px 3px 0px ${PINK}, 6px 6px 0px rgba(0,0,0,1)`
          }}
        >
          <a
            className="cursor-target"
            href="https://adsophos.com"
            target="_blank"
          >
            Click To Visit
          </a>
        </div>
        <HackrevCta />
      </div>

      {/* Final CTA */}
      {/* <div className="container mx-auto max-w-5xl pb-32">
        <RedirectButton href="https://adsophos.vercel.app/" />
      </div> */}
    </main>
  );
};

export default AdsophosPortalPage;