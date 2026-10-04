'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import MemberLightbox from '@/components/shared/MemberLightbox';
import { useTeam, useTeamYears } from '@/app/team/_hooks/useTeam';

// Shape returned by /api/team/gb (Supabase csi_team rows)
type DbMember = {
  id: string;
  name: string;
  position: string | null;
  image_url: string | null;
  linkedin: string | null;
  github: string | null;
  mail: string | null;
  gb_position: string | null;
};

type Member = {
  id: string;
  name: string;
  role: string;
  image?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  email?: string;
};

const isEmpty = (v: string) => !v || v === 'N/A' || v === 'NA' || v === '-' || v === '#';

const toUrl = (val?: string | null): string | undefined => {
  const v = val?.trim() ?? '';
  if (isEmpty(v)) return undefined;
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  return `https://www.linkedin.com/in/${v}`;
};

const toGithubUrl = (val?: string | null): string | undefined => {
  const v = val?.trim() ?? '';
  if (isEmpty(v)) return undefined;
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  return `https://github.com/${v}`;
};

const toEmail = (val?: string | null): string | undefined => {
  const v = val?.trim() ?? '';
  return !isEmpty(v) && v.includes('@') ? v : undefined;
};

const fromDb = (rows: DbMember[]): Member[] =>
  rows.map((r) => ({
    id: r.id,
    name: r.name,
    role: (r.gb_position || r.position || 'Member').trim(),
    image: r.image_url || undefined,
    linkedinUrl: toUrl(r.linkedin),
    githubUrl: toGithubUrl(r.github),
    email: toEmail(r.mail),
  }));

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

// Deterministic tilt per print (-3..3deg) so server and client render the same
const tiltFor = (i: number) => ((i * 7919) % 7) - 3;

// Single row scrolling left
const ROWS = [{ reverse: false }];

// Scroll speed: seconds for one print to travel its own width (higher = slower)
const SECONDS_PER_PRINT = 7;

// Each loop copy must be wider than the widest screen, so short rows are repeated inside a copy
const MIN_PER_COPY = 12;

const Social: React.FC<{ href?: string; label: string; focusable: boolean; children: React.ReactNode }> = ({
  href,
  label,
  focusable,
  children,
}) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      tabIndex={focusable ? undefined : -1}
      onClick={(e) => e.stopPropagation()}
      className="relative grid size-7 place-items-center rounded-full bg-black/60 text-white/85 backdrop-blur-sm transition-colors before:absolute before:-inset-1.5 before:content-[''] hover:bg-black/80 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
    >
      {children}
    </a>
  ) : (
    <span aria-hidden title="Not added yet" className="grid size-7 place-items-center rounded-full bg-black/40 text-white/35">
      {children}
    </span>
  );

const Polaroid: React.FC<{
  member: Member;
  tilt: number;
  active: boolean;
  interactive: boolean;
  onOpen: (el: HTMLElement, viaKeyboard: boolean) => void;
}> = ({ member, tilt, active, interactive, onOpen }) => (
  <li className="shrink-0 px-2.5 py-6 md:px-4 md:py-8" aria-hidden={!interactive || undefined}>
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : -1}
      aria-label={interactive ? `${member.name}, ${member.role}` : undefined}
      aria-haspopup={interactive ? 'dialog' : undefined}
      data-active={active}
      data-polaroid-id={member.id}
      onClick={(e) => onOpen(e.currentTarget, false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(e.currentTarget, true);
        }
      }}
      style={{ ['--tilt' as string]: `${tilt}deg` }}
      className="group/frame relative w-[150px] cursor-pointer bg-[#ecebe6] p-1.5 pb-0 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.85)] outline-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transform:rotate(var(--tilt))] hover:[transform:rotate(0deg)_translateY(-8px)_scale(1.06)] focus-visible:[transform:rotate(0deg)_translateY(-8px)_scale(1.06)] focus-visible:ring-2 focus-visible:ring-white/80 data-[active=true]:[transform:rotate(0deg)_translateY(-8px)_scale(1.06)] motion-reduce:transition-none sm:w-[190px] sm:p-2 sm:pb-0 md:w-[230px] md:p-2.5 md:pb-0"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-300">
        <div className="absolute inset-0 grayscale transition-[filter] duration-500 group-hover/frame:grayscale-0 group-focus-visible/frame:grayscale-0 group-data-[active=true]/frame:grayscale-0">
          {member.image ? (
            <Image src={member.image} alt="" fill sizes="(min-width: 768px) 230px, (min-width: 640px) 190px, 150px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,oklch(0.7_0.2_25),oklch(0.35_0.15_20)_55%,oklch(0.15_0.03_20))]">
              <span className="font-instrument-serif text-5xl italic text-white/90 md:text-6xl">
                {initials(member.name)}
              </span>
            </div>
          )}
        </div>

        <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity duration-300 group-hover/frame:opacity-100 group-has-[:focus-visible]/frame:opacity-100 group-data-[active=true]/frame:opacity-100">
          <Social href={member.linkedinUrl} label={`${member.name} on LinkedIn`} focusable={interactive}>
            <FaLinkedinIn size={13} aria-hidden />
          </Social>
          <Social href={member.githubUrl} label={`${member.name} on GitHub`} focusable={interactive}>
            <FaGithub size={13} aria-hidden />
          </Social>
        </div>
      </div>

      {/* Thick polaroid bottom edge; details write themselves in on hover/tap */}
      <div className="flex h-12 flex-col justify-center px-0.5 sm:h-14 md:h-16 md:px-1">
        <div className="translate-y-1 opacity-0 transition-[opacity,transform] duration-300 group-hover/frame:translate-y-0 group-hover/frame:opacity-100 group-focus-visible/frame:translate-y-0 group-focus-visible/frame:opacity-100 group-data-[active=true]/frame:translate-y-0 group-data-[active=true]/frame:opacity-100">
          <p className="truncate font-instrument-serif text-base italic leading-tight text-neutral-900 sm:text-lg md:text-xl">
            {member.name}
          </p>
          <p className="truncate font-inter text-[9px] font-medium uppercase tracking-[0.14em] text-neutral-500 sm:text-[10px] md:text-[11px]">
            {member.role}
          </p>
        </div>
      </div>
    </div>
  </li>
);

function PolaroidMarqueeComponent() {
  const { data: availableYears = [] } = useTeamYears();
  const latestYear = availableYears.length > 0 ? availableYears[0] : '';
  
  const { gb: dbGbRaw } = useTeam(latestYear);
  const members = useMemo(() => {
    if (!dbGbRaw) return [];
    return fromDb(dbGbRaw as unknown as DbMember[]);
  }, [dbGbRaw]);

  const [open, setOpen] = useState<{ id: string; el: HTMLElement; viaKeyboard: boolean } | null>(null);

  const rows = useMemo(
    () => ROWS.map((_, r) => members.filter((_, i) => i % ROWS.length === r)),
    [members]
  );

  const closeLightbox = useCallback(() => setOpen(null), []);

  return (
    <div className="flex w-full flex-col overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      {rows.map((list, r) => {
        if (list.length === 0) return null;
        const reps = Math.max(1, Math.ceil(MIN_PER_COPY / list.length));
        const copy = Array.from({ length: reps }, () => list).flat();
        // Keep the row still while the popup is open so the polaroid can fly back to its spot
        const paused = open !== null;
        const { reverse } = ROWS[r];
        const duration = `${copy.length * SECONDS_PER_PRINT}s`;
        return (
          <div key={r} className="group/row">
            <div
              className={`flex w-max animate-[polaroid-roll_var(--roll-duration)_linear_infinite] group-hover/row:[animation-play-state:paused] group-has-[:focus-visible]/row:[animation-play-state:paused] motion-reduce:animate-none ${
                reverse ? '[animation-direction:reverse]' : ''
              } ${paused ? '[animation-play-state:paused]' : ''}`}
              style={{ ['--roll-duration' as string]: duration }}
            >
              {[0, 1].map((c) => (
                <ul key={c} className="flex" aria-hidden={c === 1 || undefined}>
                  {copy.map((m, i) => {
                    // Only the first appearance of each member is reachable by keyboard / screen reader
                    const interactive = c === 0 && i < list.length;
                    return (
                      <Polaroid
                        key={`${c}-${i}-${m.id}`}
                        member={m}
                        tilt={tiltFor(r * 11 + (i % list.length))}
                        active={open?.id === m.id}
                        interactive={interactive}
                        onOpen={(el, viaKeyboard) => setOpen({ id: m.id, el, viaKeyboard })}
                      />
                    );
                  })}
                </ul>
              ))}
            </div>
          </div>
        );
      })}
      {open && <MemberLightbox members={members} openId={open.id} originEl={open.el} restoreFocus={open.viaKeyboard} onClose={closeLightbox} />}
    </div>
  );
}

const PolaroidMarquee = React.memo(PolaroidMarqueeComponent);
PolaroidMarquee.displayName = 'PolaroidMarquee';

export { PolaroidMarquee };
