
'use client';

import { motion } from 'framer-motion';
import type { Member } from '../data/memberdata';

type MemberCardProps = {
  member: Member;
  index: number;
};

export default function MemberCard({
  member,
  index,
}: MemberCardProps) {
  // Generate initials from member name
  const initials = member.name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.8,
        delay: Math.min(index * 0.08, 0.5),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -4,
        transition: {
          duration: 0.3,
        },
      }}
      className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-[#080808] p-5 transition-colors duration-300 hover:border-[#E11D48]/60 sm:p-6"
    >
      {/* Subtle top accent */}
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#E11D48]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Member initials */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 font-[var(--font-inter)] text-xl font-semibold text-[#E11D48] transition-colors duration-300 group-hover:border-[#E11D48]/50">
        {initials || '?'}
      </div>

      {/* Member name */}
      <h3 className="mt-5 break-words font-[var(--font-inter)] text-lg font-semibold leading-snug text-white">
        {member.name}
      </h3>

      {/* Designation */}
      <p className="mt-2 font-[var(--font-geist-mono)] text-xs uppercase tracking-wider text-[#E11D48]">
        {member.role}
      </p>

      {/* Portfolio */}
      <div className="mt-5 flex items-center justify-between border-t border-neutral-800 pt-4">
        <span className="font-[var(--font-inter)] text-xs text-neutral-500">
          Portfolio
        </span>

        <span className="max-w-[65%] text-right font-[var(--font-inter)] text-xs text-neutral-300">
          {member.portfolio}
        </span>
      </div>
    </motion.div>
  );
}
