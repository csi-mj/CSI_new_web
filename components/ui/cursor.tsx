"use client";

import React, { useEffect, useCallback, useMemo, useRef } from "react";
import { motion, useSpring } from "framer-motion";

const Cursor = React.memo(function Cursor() {
  const springConfig = useMemo(() => ({ damping: 20, stiffness: 200, mass: 1 }), []);
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  const rotate = useSpring(0, springConfig);
  const rafId = useRef<number | null>(null);
  const pendingPos = useRef<{ x: number; y: number } | null>(null);

  const moveCursor = useCallback((e: MouseEvent) => {
    pendingPos.current = { x: e.clientX, y: e.clientY };
    if (rafId.current == null) {
      rafId.current = requestAnimationFrame(() => {
        const p = pendingPos.current;
        if (p) {
          cursorX.set(p.x);
          cursorY.set(p.y);
        }
        rafId.current = null;
      });
    }
  }, [cursorX, cursorY]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isGenWord = target.closest('[data-gen-word="1"]');
      const inShuffleText = target.closest('[data-shuffle-root="1"]');
      const inCursorWrapper = target.closest('#cursor');
      const inCursorMid = target.closest('#cursor-mid');
      const inCursorBig = target.closest('#cursor-big');
      const inHot = target.closest('#hot');

      // Big scale only for actual generated words and shuffle text
      if (isGenWord || inShuffleText || inCursorBig ) {
        scale.set(5);
        rotate.set(180);
      }
      else if (inCursorMid) {
        scale.set(4);
        rotate.set(120);
      }
      else if (inHot) {
        scale.set(8);
        rotate.set(120);
      }
      else if (
        target.tagName === "P" ||
        target.tagName === "H1" ||
        target.tagName === "H2" ||
        target.tagName === "H3" ||
        target.tagName === "A" ||
        // target.tagName === "SPAN" ||
        target.tagName === "BUTTON" ||
        target.id === "github" ||
        inCursorWrapper
      ) {
        scale.set(3);
        rotate.set(90);
      } else if (target.tagName === "H6") {
        scale.set(7);
        rotate.set(225);
      } else if (target.id === "LOGO") {
        scale.set(4);
        rotate.set(135);
      } else {
        scale.set(1);
        rotate.set(0);
      }
  }, [scale, rotate]);

  useEffect(() => {
    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [moveCursor, handleMouseOver]);

  return (
    <motion.div
      id="custom-cursor"
      className="pointer-events-none fixed z-[2147483647] size-4 rounded-full bg-white/100 mix-blend-exclusion"
      style={{
        left: cursorX,
        top: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        scale,
        rotate:"90deg",
      }}
    />
  );
});

Cursor.displayName = 'Cursor';

export default Cursor;
