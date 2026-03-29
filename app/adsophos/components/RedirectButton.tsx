"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ── Hardcoded Adsophos tokens ── */
const PINK = "#ec4899";
const YELLOW = "#ffba00";
const CYAN = "#00f5ff";

const BORDER = `2px solid ${PINK}`;
const SHADOW = `3px 3px 0px ${CYAN}`;
const SHADOW_HOVER = `5px 5px 0px ${CYAN}`;

interface RedirectButtonProps {
  href: string;
}

const RedirectButton: React.FC<RedirectButtonProps> = ({ href }) => {
  return (
    <div className="w-full py-20 flex flex-col items-center gap-10">
      {/* CTA Text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center uppercase tracking-widest"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "10px",
          color: CYAN,
          textShadow: "2px 2px 0px rgba(0,0,0,1)",
        }}
      >
        READY TO BEGIN YOUR QUEST?
      </motion.p>

      {/* CTA Button — exact EventCard button pattern */}
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -6, boxShadow: SHADOW_HOVER }}
        className="group flex items-center justify-center gap-3 px-8 py-4 cursor-pointer transition-all duration-300"
        style={{
          backgroundColor: "transparent",
          border: BORDER,
          boxShadow: SHADOW,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "11px",
          color: YELLOW,
          textShadow: "1px 1px 0px rgba(0,0,0,1)",
        }}
      >
        <span className="group-hover:text-white transition-colors">
          LAUNCH ADSOPHOS
        </span>
        <ArrowRight size={16} style={{ color: YELLOW }} />
      </motion.a>
    </div>
  );
};

export default RedirectButton;
