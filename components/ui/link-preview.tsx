"use client";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { encode } from "qss";
import React from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";

import { cn } from "@/lib/utils";

type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLAnchorElement>;
  id?: string;
  tooltipLabel?: string; // when provided, render an animated tooltip instead of an image preview
} & (
  | { isStatic: true; imageSrc: string }
  | { isStatic?: false; imageSrc?: never }
);

export const LinkPreview = ({
  children,
  url,
  id='cursor-mid',
  className,
  width = 200,
  height = 125,
  isStatic = false,
  imageSrc = "",
  tooltipLabel,
  onMouseEnter,
  onMouseLeave,
}: LinkPreviewProps) => {
  let src;
  // Only compute remote screenshot when not static and not in tooltip-only mode
  if (!isStatic && !tooltipLabel) {
    const params = encode({
      url,
      screenshot: true,
      meta: false,
      embed: "screenshot.url",
      colorScheme: "dark",
      "viewport.isMobile": true,
      "viewport.deviceScaleFactor": 1,
      "viewport.width": width * 3,
      "viewport.height": height * 3,
    });
    src = `https://api.microlink.io/?${params}`;
  } else {
    src = imageSrc;
  }

  const [isOpen, setOpen] = React.useState(false);

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);

  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = event.currentTarget;
    const targetRect = target.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2; // Reduce the effect to make it subtle
    x.set(offsetFromCenter);
  };

  return (
    <>
      {isMounted ? (
        tooltipLabel ? null : (
          <div className="hidden">
            <Image
              src={src}
              width={width}
              height={height}
              alt="hidden image"
              unoptimized
            />
          </div>
        )
      ) : null}

      <HoverCardPrimitive.Root
        openDelay={50}
        closeDelay={100}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <HoverCardPrimitive.Trigger asChild>
          <a
            href={url}
            onMouseMove={handleMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={cn("text-white", className)}
            target="_blank"
            rel="noreferrer noopener"
            id={id}
          >
            {children}
          </a>
        </HoverCardPrimitive.Trigger>

        <HoverCardPrimitive.Portal>
          <HoverCardPrimitive.Content
            className="[transform-origin:var(--radix-hover-card-content-transform-origin)] z-[60] pointer-events-auto"
            side="top"
            align="center"
            sideOffset={10}
          >
            <AnimatePresence>
              {isOpen && (
                tooltipLabel ? (
                  <motion.div
                    initial={{ opacity: 0, y: 14, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="z-[60] rounded-lg bg-black/80 text-white border border-white/10 shadow-xl"
                    style={{ x: translateX }}
                  >
                    <div className="px-3 py-1.5 text-xs font-medium">
                      {tooltipLabel}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.6 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      },
                    }}
                    exit={{ opacity: 0, y: 20, scale: 0.6 }}
                    className="shadow-xl rounded-xl z-[60]"
                    style={{
                      x: translateX,
                    }}
                  >
                    <a
                      href={url}
                      className="block p-1 bg-white border-2 border-transparent shadow rounded-xl hover:border-neutral-200 dark:hover:border-neutral-800"
                      style={{ fontSize: 0 }}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <Image
                        src={isStatic ? imageSrc : src}
                        width={width}
                        height={height}
                        className="rounded-lg"
                        alt="preview image"
                        unoptimized
                      />
                    </a>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </HoverCardPrimitive.Content>
        </HoverCardPrimitive.Portal>
      </HoverCardPrimitive.Root>
    </>
  );
};
