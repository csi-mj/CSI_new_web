'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Orbitron, Poppins } from 'next/font/google';
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
  type LucideIcon
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Fonts — delete this block if Orbitron/Poppins are already set up    */
/* in your layout, and point the two class strings below at them.      */
/* ------------------------------------------------------------------ */
const orbitronFont = Orbitron({
  subsets: ['latin'],
  weight: ['500', '700', '800', '900'],
  variable: '--font-orbitron'
});
const poppinsFont = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins'
});
const ORBITRON = 'font-[family-name:var(--font-orbitron)]';
const POPPINS = 'font-[family-name:var(--font-poppins)]';

import { iconColors, borderColors, translucentBgColors, bgColors } from "@/config/colors";

const ACCENT = '#ff1e35';

export type Portfolio = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
  color: keyof typeof iconColors;
};

export const DEFAULT_PORTFOLIOS: Portfolio[] = [
  {
    id: 'marketing',
    name: 'Marketing',
    icon: Megaphone,
    color: 'orange',
    description:
      'Build the CSI brand through creative campaigns, strategic outreach and campus engagement. This portfolio makes sure CSI’s ideas, events and initiatives reach the right audience.',
    tags: ['Brand Strategy', 'Outreach', 'PR']
  },
  {
    id: 'design',
    name: 'Design',
    icon: PenTool,
    color: 'pink',
    description:
      'Shape CSI’s identity through compelling visuals and creative storytelling. From event creatives to digital experiences, this portfolio turns ideas into designs that stand out.',
    tags: ['Visual Design', 'UI/UX', 'Branding']
  },
  {
    id: 'events',
    name: 'Events',
    icon: CalendarDays,
    color: 'yellow',
    description:
      'Turn ideas into impactful experiences by planning and executing technical, non-technical and flagship events from concept to completion.',
    tags: ['Planning', 'Execution', 'Coordination']
  },
  {
    id: 'web',
    name: 'Web',
    icon: Code2,
    color: 'blue',
    description:
      'Build and maintain the digital face of CSI. This portfolio creates fast, accessible and engaging web experiences that bring the chapter’s ideas online.',
    tags: ['Development', 'UI/UX', 'Maintenance']
  },
  {
    id: 'tech',
    name: 'Tech & Innovation',
    icon: Cpu,
    color: 'purple',
    description:
      'Build technical solutions and drive innovation across CSI through workshops, hands-on projects and experimentation with emerging technologies.',
    tags: ['Workshops', 'Projects', 'Innovation']
  },
  {
    id: 'hr',
    name: 'Human Resources',
    icon: Users,
    color: 'green',
    description:
      'Build a strong CSI community by managing recruitment, onboarding and member engagement while creating a culture where people can learn, collaborate and grow.',
    tags: ['Recruitment', 'People', 'Engagement']
  },
  {
    id: 'media',
    name: 'Media & Press',
    icon: Camera,
    color: 'cyan',
    description:
      'Capture CSI’s journey and bring its stories to life through photography, videography and press coverage. This portfolio makes every moment worth remembering.',
    tags: ['Photography', 'Videography', 'Press']
  },
  {
    id: 'logistics',
    name: 'Logistics',
    icon: Box,
    color: 'teal',
    description:
      'Make every CSI event run smoothly behind the scenes by managing venues, resources, schedules and on-ground operations.',
    tags: ['Operations', 'Resources', 'Coordination']
  },
  {
    id: 'editorial',
    name: 'Editorial',
    icon: FileText,
    color: 'rose',
    description:
      'Craft content that reflects the voice of CSI through articles, newsletters, announcements and official communication that informs and connects the community.',
    tags: ['Writing', 'Editing', 'Content']
  },
  {
    id: 'rnd',
    name: 'Research & Development',
    icon: FlaskConical,
    color: 'indigo',
    description:
      'Explore new ideas, conduct technical research and prototype solutions that push CSI forward. Contribute to research, experimentation and knowledge creation.',
    tags: ['Research', 'Prototyping', 'Innovation']
  }
];

/* ------------------------------------------------------------------ */
/* Carousel geometry                                                   */
/* ------------------------------------------------------------------ */
const SPRING = {
  type: 'spring',
  stiffness: 240,
  damping: 30,
  mass: 0.9
} as const;
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
  className = ''
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
    const ro = new ResizeObserver(([entry]) =>
      setStageW(entry.contentRect.width)
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Keep the selected button visible if the selector strip scrolls sideways.
  // Only that strip moves: scrollIntoView also scrolled the page, dragging it down on every card change.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const btn = buttonRefs.current[active];
    const strip = btn?.parentElement;
    if (!btn || !strip || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollTo({
      left: btn.offsetLeft - (strip.clientWidth - btn.offsetWidth) / 2,
      behavior: 'smooth'
    });
  }, [active]);

  const cardW = Math.min(320, Math.max(220, stageW * 0.58));
  // One title size for every card, small enough that the longest single word (e.g. DEVELOPMENT)
  // fits on one line inside the card's padding; capped at the original 26px on wide cards.
  const longestWord = Math.max(
    ...portfolios.flatMap((p) => p.name.split(/\s+/)).map((w) => w.length),
    1
  );
  const titleSize = Math.min(26, (cardW - 48) / (longestWord * 0.92));

  return (
    <section
      className={`${orbitronFont.variable} ${poppinsFont.variable} ${POPPINS} w-full overflow-x-clip bg-black px-4 py-12 text-white sm:px-6 ${className}`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      }}
    >
      {/* Header */}
      <header className="mx-auto max-w-2xl text-center">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-10 sm:w-14" style={{ background: ACCENT }} />
          <span
            className={`${ORBITRON} text-[11px] tracking-[0.35em] text-white/90 sm:text-xs`}
          >
            EXPLORE OUR
          </span>
          <span className="h-px w-10 sm:w-14" style={{ background: ACCENT }} />
        </div>
        <h2
          className={`${ORBITRON} mt-4 text-4xl font-black tracking-wide sm:text-6xl`}
        >
          PORT<span style={{ color: ACCENT }}>FOLIOS</span>
        </h2>
        <p className="mt-5 text-sm leading-relaxed font-light text-white/70 sm:text-base">
          Find a team that matches your interests and skills. Each portfolio
          offers unique opportunities to learn, contribute and make an impact.
        </p>
      </header>

      {/* Carousel */}
      <div ref={stageRef} className="relative mx-auto mt-10 max-w-5xl">
        <motion.div
          className="relative h-[428px] cursor-grab touch-pan-y select-none active:cursor-grabbing sm:h-100"
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
            const x = isActive
              ? 0
              : sign * (cardW * 0.76 + (c - 1) * cardW * 0.28);
            const Icon = p.icon;

            return (
              <motion.div
                key={p.id}
                role="button"
                tabIndex={abs <= 1 ? 0 : -1}
                aria-label={`Show ${p.name} portfolio`}
                aria-current={isActive}
                onClick={() => !dragging.current && !isActive && select(i)}
                onKeyDown={(e) => e.key === 'Enter' && select(i)}
                className={`absolute top-4 h-[400px] w-[calc(100vw-48px)] max-w-[350px] overflow-hidden rounded-2xl border-2 bg-[#0a0a0b]/95 p-5 backdrop-blur-sm will-change-transform outline-none sm:top-6 sm:h-[350px] sm:w-[340px] sm:p-6 cursor-target transition-colors duration-300 ${isActive ? borderColors[p.color] : 'border-white/10'}`}
                style={{
                  width: cardW,
                  left: '50%',
                  marginLeft: -cardW / 2,
                  zIndex: 10 - abs,
                  pointerEvents: abs > 3 ? 'none' : 'auto',
                  transformStyle: 'preserve-3d'
                }}
                initial={false}
                animate={{
                  x,
                  y: isActive ? -10 : 0,
                  scale: SCALE[c],
                  rotateY: -sign * ROTATE[c],
                  opacity: abs > 3 ? 0 : OPACITY[c],
                  filter: abs >= 2 ? 'blur(1.5px)' : 'blur(0px)'
                }}
                transition={SPRING}
              >
                {/* Icon + index */}
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl border ${borderColors[p.color]} ${translucentBgColors[p.color]}`}
                  >
                    <Icon size={26} strokeWidth={1.6} className={iconColors[p.color]} />
                  </div>
                  <span className="text-sm text-white/50">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3
                  className={`${ORBITRON} mt-5 leading-tight font-extrabold [overflow-wrap:anywhere] uppercase`}
                  style={{ fontSize: titleSize }}
                >
                  {p.name}
                </h3>
                <p className="mt-3 line-clamp-4 text-[13px] leading-relaxed font-light text-white/85 sm:line-clamp-5">
                  {p.description}
                </p>

                {/* Divider + tags (active card only shows the divider) */}
                <motion.span
                  className={`mt-4 block h-px w-10 ${bgColors[p.color]}`}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={SPRING}
                />
                <div className="my-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className={`rounded-full border ${borderColors[p.color]} px-3 py-1 text-[11px] text-white`}
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
        {(['prev', 'next'] as const).map((dir) => {
          const activeColorClass = iconColors[portfolios[active].color];
          
          return (
            <button
              key={dir}
              type="button"
              aria-label={
                dir === 'prev' ? 'Previous portfolio' : 'Next portfolio'
              }
              onClick={dir === 'prev' ? prev : next}
              className={`absolute top-[calc(100%+44px)] z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black transition-colors hover:border-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:top-1/2 sm:h-10 sm:w-10 sm:-translate-y-1/2 ${
                dir === 'prev'
                  ? 'left-[calc(50%-56px)] sm:left-0'
                  : 'right-[calc(50%-56px)] sm:right-0'
              }`}
            >
              {dir === 'prev' ? (
                <ChevronLeft size={20} className={activeColorClass} />
              ) : (
                <ChevronRight size={20} className={activeColorClass} />
              )}
            </button>
          );
        })}
      </div>

      {/* Dots */}
      <div className="mt-2 flex items-center justify-center gap-3">
        {portfolios.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-label={`Go to ${p.name}`}
            onClick={() => select(i)}
            className="p-1 cursor-pointer"
          >
            <motion.span
              className={`block h-2 w-2 rounded-full transition-colors ${i === active ? bgColors[p.color] : 'bg-white/20'}`}
              animate={{
                scale: i === active ? 1.3 : 1
              }}
              transition={{ duration: 0.25 }}
            />
          </button>
        ))}
      </div>

      {/* Bottom selector: 5-col grid on md+, horizontally scrollable 2-row strip on mobile */}
      <div className="mx-auto mt-24 w-full max-w-5xl px-1 sm:mt-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
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
                className="relative flex h-14 min-w-0 items-center gap-2 rounded-xl border border-white/20 bg-black px-3 text-left text-xs transition-colors duration-300 outline-none focus-visible:outline-2 focus-visible:outline-[#ff1e35] sm:h-16 sm:gap-3 sm:px-4 sm:text-sm cursor-target cursor-pointer"
              >
                {selected && (
                  <motion.span
                    className={`absolute inset-0 rounded-xl border-2 ${borderColors[p.color]}`}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.25,
                      ease: 'easeOut'
                    }}
                  />
                )}

                <Icon
                  size={20}
                  strokeWidth={1.5}
                  className={`relative shrink-0 ${selected ? iconColors[p.color] : 'text-white'}`}
                />

                <span className="relative min-w-0 leading-tight">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
