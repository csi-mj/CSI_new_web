"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Orbitron, Poppins } from "next/font/google";
import {
  Megaphone,
  PenTool,
  CalendarDays,
  Code2,
  Cpu,
  Users,
  Camera,
  Box,
  FileText,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Fonts — delete this block if Orbitron/Poppins are already set up    */
/* in your layout, and point the two class strings below at them.      */
/* ------------------------------------------------------------------ */
const orbitronFont = Orbitron({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-orbitron",
});
const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
});
const ORBITRON = "font-[family-name:var(--font-orbitron)]";
const POPPINS = "font-[family-name:var(--font-poppins)]";

const ACCENT = "#ff1e35";

export type Portfolio = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
};

export const DEFAULT_PORTFOLIOS: Portfolio[] = [
{
  id: "marketing",
  name: "Marketing",
  icon: Megaphone,
  description:
    "Build the CSI brand through creative campaigns, strategic outreach and campus engagement. This portfolio makes sure CSI’s ideas, events and initiatives reach the right audience.",
  tags: ["Brand Strategy", "Outreach", "PR"],
},
{
  id: "design",
  name: "Design",
  icon: PenTool,
  description:
    "Shape CSI’s identity through compelling visuals and creative storytelling. From event creatives to digital experiences, this portfolio turns ideas into designs that stand out.",
  tags: ["Visual Design", "UI/UX", "Branding"],
},
{
  id: "events",
  name: "Events",
  icon: CalendarDays,
  description:
    "Turn ideas into impactful experiences by planning and executing technical, non-technical and flagship events from concept to completion.",
  tags: ["Planning", "Execution", "Coordination"],
},
{
  id: "web",
  name: "Web",
  icon: Code2,
  description:
    "Build and maintain the digital face of CSI. This portfolio creates fast, accessible and engaging web experiences that bring the chapter’s ideas online.",
  tags: ["Development", "UI/UX", "Maintenance"],
},
{
  id: "tech",
  name: "Tech & Innovation",
  icon: Cpu,
  description:
    "Build technical solutions and drive innovation across CSI through workshops, hands-on projects and experimentation with emerging technologies.",
  tags: ["Workshops", "Projects", "Innovation"],
},
{
  id: "hr",
  name: "Human Resources",
  icon: Users,
  description:
    "Build a strong CSI community by managing recruitment, onboarding and member engagement while creating a culture where people can learn, collaborate and grow.",
  tags: ["Recruitment", "People", "Engagement"],
},
{
  id: "media",
  name: "Media & Press",
  icon: Camera,
  description:
    "Capture CSI’s journey and bring its stories to life through photography, videography and press coverage. This portfolio makes every moment worth remembering.",
  tags: ["Photography", "Videography", "Press"],
},
{
  id: "logistics",
  name: "Logistics",
  icon: Box,
  description:
    "Make every CSI event run smoothly behind the scenes by managing venues, resources, schedules and on-ground operations.",
  tags: ["Operations", "Resources", "Coordination"],
},
{
  id: "editorial",
  name: "Editorial",
  icon: FileText,
  description:
    "Craft content that reflects the voice of CSI through articles, newsletters, announcements and official communication that informs and connects the community.",
  tags: ["Writing", "Editing", "Content"],
},
{
  id: "rnd",
  name: "Research & Development",
  icon: FlaskConical,
  description:
    "Explore new ideas, conduct technical research and prototype solutions that push CSI forward. Contribute to research, experimentation and knowledge creation.",
  tags: ["Research", "Prototyping", "Innovation"],
},
];

/* ------------------------------------------------------------------ */
/* Carousel geometry                                                   */
/* ------------------------------------------------------------------ */
const SPRING = { type: "spring", stiffness: 240, damping: 30, mass: 0.9 } as const;
const SCALE = [1, 0.84, 0.72, 0.62];
const OPACITY = [1, 0.9, 0.5, 0.2];
const DIM = [0, 0.42, 0.65, 0.8];
const ROTATE = [0, 26, 32, 36];

/** Shortest signed circular distance from `active` to `i`. */
function circularOffset(i: number, active: number, n: number) {
  let d = (i - active + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

type Props = {
  portfolios?: Portfolio[];
  initialIndex?: number;
  onChange?: (portfolio: Portfolio, index: number) => void;
  className?: string;
};

export default function PortfolioCarousel({
  portfolios = DEFAULT_PORTFOLIOS,
  initialIndex = 0,
  onChange,
  className = "",
}: Props) {
  const n = portfolios.length;
  const [active, setActive] = useState(initialIndex);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(900);
  const dragging = useRef(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mounted = useRef(false);

  const select = useCallback(
    (i: number) => {
      const next = ((i % n) + n) % n;
      setActive(next);
      onChange?.(portfolios[next], next);
    },
    [n, onChange, portfolios]
  );
  const next = () => select(active + 1);
  const prev = () => select(active - 1);

  // Measure the stage so card size/spacing adapt (desktop / tablet / mobile).
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setStageW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Keep the selected button visible in the scrollable mobile selector.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    buttonRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [active]);

  const cardW = Math.min(320, Math.max(220, stageW * 0.58));

  return (
    <section
      className={`${orbitronFont.variable} ${poppinsFont.variable} ${POPPINS}  w-full overflow-x-clip bg-black px-4 py-12 text-white sm:px-6 ${className}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
    >
      {/* Header */}
      <header className="mx-auto max-w-2xl text-center">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-10 sm:w-14" style={{ background: ACCENT }} />
          <span className={`${ORBITRON} text-[11px] tracking-[0.35em] text-white/90 sm:text-xs`}>
            EXPLORE OUR
          </span>
          <span className="h-px w-10 sm:w-14" style={{ background: ACCENT }} />
        </div>
        <h2 className={`${ORBITRON} mt-4 text-4xl font-black tracking-wide sm:text-6xl`}>
          PORT<span style={{ color: ACCENT }}>FOLIOS</span>
        </h2>
        <p className="mt-5 text-sm font-light leading-relaxed text-white/70 sm:text-base">
          Find a team that matches your interests and skills. Each portfolio offers unique
          opportunities to learn, contribute and make an impact.
        </p>
      </header>

      {/* Carousel */}
      <div ref={stageRef} className="relative mx-auto mt-10 max-w-5xl">
        <motion.div
          className="relative h-100 cursor-grab touch-pan-y select-none active:cursor-grabbing"
          style={{ perspective: 1200 }}
          drag="x"
          dragSnapToOrigin
          dragMomentum={false}
          dragElastic={0.12}
          onDragStart={() => (dragging.current = true)}
          onDragEnd={(_, info) => {
            const power = info.offset.x + info.velocity.x * 0.2;
            if (power < -60) next();
            else if (power > 60) prev();
            setTimeout(() => (dragging.current = false), 60);
          }}
        >
          {portfolios.map((p, i) => {
            const o = circularOffset(i, active, n);
            const abs = Math.abs(o);
            const c = Math.min(abs, 3);
            const sign = Math.sign(o);
            const isActive = o === 0;
            const x = isActive ? 0 : sign * (cardW * 0.76 + (c - 1) * cardW * 0.28);
            const Icon = p.icon;

            return (
              <motion.div
                key={p.id}
                role="button"
                tabIndex={abs <= 1 ? 0 : -1}
                aria-label={`Show ${p.name} portfolio`}
                aria-current={isActive}
                onClick={() => !dragging.current && !isActive && select(i)}
                onKeyDown={(e) => e.key === "Enter" && select(i)}
                className="
  absolute top-4
  h-[400px]
  w-[calc(100vw-48px)]
  max-w-[350px]
  rounded-2xl
  border border-[#ff1e35]/70
  bg-[#0a0a0b]/95
  p-5
  outline-none
  backdrop-blur-sm
  will-change-transform
  sm:top-6
  sm:h-[350px]
  sm:w-[340px]
  sm:p-6
"
                style={{
                  width: cardW,
                  left: "50%",
                  marginLeft: -cardW / 2,
                  zIndex: 10 - abs,
                  pointerEvents: abs > 3 ? "none" : "auto",
                  transformStyle: "preserve-3d",
                }}
                initial={false}
                animate={{
                  x,
                  y: isActive ? -10 : 0,
                  scale: SCALE[c],
                  rotateY: -sign * ROTATE[c],
                  opacity: abs > 3 ? 0 : OPACITY[c],
                  borderColor: isActive ? ACCENT : "rgba(255,255,255,0.12)",
                  boxShadow: isActive
                    ? "0 0 36px rgba(255,30,53,0.28), inset 0 0 24px rgba(255,30,53,0.06)"
                    : "0 0 0 rgba(255,30,53,0)",
                  filter: abs >= 2 ? "blur(1.5px)" : "blur(0px)",
                }}
                transition={SPRING}
              >
                {/* Icon + index */}
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-xl border"
                    style={{
                      borderColor: ACCENT,
                      color: ACCENT,
                      background: "rgba(255,30,53,0.08)",
                    }}
                  >
                    <Icon size={26} strokeWidth={1.6} />
                  </div>
                  <span className="text-sm text-white/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className={`${ORBITRON} mt-5 text-[26px] font-extrabold uppercase leading-tight`}>
                  {p.name}
                </h3>
                <p className="mt-3 line-clamp-5 text-[13px] font-light leading-relaxed text-white/85">
                  {p.description}
                </p>

                {/* Divider + tags (active card only shows the divider) */}
                <motion.span
                  className="mt-4 block h-px w-10"
                  style={{ background: ACCENT }}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={SPRING}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border px-3 py-1 text-[11px]"
                      style={{ borderColor: ACCENT, color: "#fff" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Dim overlay for non-active cards */}
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-black"
                  initial={false}
                  animate={{ opacity: DIM[c] }}
                  transition={SPRING}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Arrows */}
        {(["prev", "next"] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            aria-label={dir === "prev" ? "Previous portfolio" : "Next portfolio"}
            onClick={dir === "prev" ? prev : next}
            className={`absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-black text-white transition-colors hover:border-[#ff1e35] hover:text-[#ff1e35] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff1e35] ${
              dir === "prev" ? "left-0" : "right-0"
            }`}
          >
            {dir === "prev" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-2 flex items-center justify-center gap-3">
        {portfolios.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-label={`Go to ${p.name}`}
            onClick={() => select(i)}
            className="p-1"
          >
            <motion.span
              className="block h-2 w-2 rounded-full"
              animate={{
                backgroundColor: i === active ? ACCENT : "rgba(255,255,255,0.22)",
                scale: i === active ? 1.3 : 1,
              }}
              transition={{ duration: 0.25 }}
            />
          </button>
        ))}
      </div>

      {/* Bottom selector: 5-col grid on md+, horizontally scrollable 2-row strip on mobile */}
      <div className="mx-auto mt-10 w-full max-w-5xl px-1">
  <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
    {portfolios.map((p, i) => {
      const Icon = p.icon;
      const selected = i === active;

      return (
        <button
          key={p.id}
          ref={(el) => {
            buttonRefs.current[i] = el;
          }}
          type="button"
          onClick={() => select(i)}
          aria-pressed={selected}
          className="
            relative flex h-14 min-w-0
            items-center gap-2
            rounded-xl
            border border-white/20
            bg-black
            px-3
            text-left text-xs
            outline-none
            transition-colors duration-300
            focus-visible:outline-2
            focus-visible:outline-[#ff1e35]
            sm:h-16 sm:gap-3 sm:px-4 sm:text-sm
          "
        >
          {selected && (
            <motion.span
              className="absolute inset-0 rounded-xl border border-[#ff1e35]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              style={{
                background: "rgba(255,30,53,0.07)",
                boxShadow: "0 0 22px rgba(255,30,53,0.3)",
              }}
            />
          )}

          <Icon
            size={20}
            strokeWidth={1.5}
            className="relative shrink-0"
            style={{
              color: selected ? ACCENT : "#fff",
            }}
          />

          <span className="relative min-w-0 leading-tight">
            {p.name}
          </span>
        </button>
      );
    })}
  </div>
</div>
    </section>
  );
}