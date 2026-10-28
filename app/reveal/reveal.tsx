
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import MemberCard from './components/MemberCard';
import { members } from './data/memberdata';

const portfolios = [
  'Marketing',
  'Design',
  'Events',
  'Web',
  'Tech & Innovation',
  'HR',
  'Media & Press',
  'Logistics',
  'Editorial',
  'Research & Development',
];

const teams = ['Execom', 'Core Team'] as const;

type Team = (typeof teams)[number];

const easing = [0.22, 1, 0.36, 1] as const;

export default function RevealPage() {
  const [team, setTeam] = useState<Team>('Execom');

  const [portfolio, setPortfolio] = useState('Marketing');

  const filteredMembers = members.filter(
    (member) =>
      member.team === team &&
      member.portfolio === portfolio
  );

  return (
    <main className="min-h-screen overflow-hidden bg-black px-5 pb-24 pt-28 text-white sm:px-8 lg:px-12">

      {/* Header */}
      <section className="mx-auto max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: easing,
          }}
          className="text-center"
        >

          {/* Eyebrow */}
          <div className="mb-5 flex items-center justify-center gap-4">

            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#E11D48]" />

            <span className="font-[var(--font-geist-mono)] text-xs uppercase tracking-[0.4em] text-[#E11D48]">
              Our Team
            </span>

            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#E11D48]" />

          </div>

          {/* Main Heading */}
          <h1 className="font-[var(--font-inter)] text-4xl font-extrabold uppercase tracking-tight sm:text-6xl lg:text-7xl">

            <span className="text-white">
              Meet
            </span>{' '}

            <span className="text-[#E11D48]">
              The Team
            </span>

          </h1>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl font-[var(--font-inter)] text-sm leading-7 text-neutral-400 sm:text-base">

            The people behind the events, ideas and experiences.

            <br />

            Our Execom and Core Team for this year.

          </p>

        </motion.div>

        {/* Team Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.2,
            ease: easing,
          }}
          className="mx-auto mt-12 flex w-full max-w-md rounded-xl border border-neutral-800 bg-[#080808] p-1"
        >

          {teams.map((item) => {

            const active = team === item;

            return (

              <button
                key={item}
                onClick={() => setTeam(item)}
                className={`relative flex-1 rounded-lg px-5 py-3 font-[var(--font-inter)] text-sm font-medium transition-colors duration-300 ${
                  active
                    ? 'text-white'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >

                {active && (

                  <motion.div
                    layoutId="team-active"
                    className="absolute inset-0 rounded-lg bg-[#E11D48]"
                    transition={{
                      duration: 0.5,
                      ease: easing,
                    }}
                  />

                )}

                <span className="relative z-10">
                  {item}
                </span>

              </button>

            );

          })}

        </motion.div>

        {/* Portfolio Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.3,
            ease: easing,
          }}
          className="mt-8"
        >

          <div className="flex flex-wrap justify-center gap-2">

            {portfolios.map((item) => {

              const active = portfolio === item;

              return (

                <button
                  key={item}
                  onClick={() => setPortfolio(item)}
                  className={`relative overflow-hidden rounded-lg border px-4 py-3 font-[var(--font-inter)] text-xs font-medium transition-all duration-300 sm:text-sm ${
                    active
                      ? 'border-[#E11D48] text-white'
                      : 'border-neutral-800 bg-[#080808] text-neutral-400 hover:border-neutral-600 hover:text-white'
                  }`}
                >

                  {active && (

                    <motion.div
                      layoutId="portfolio-active"
                      className="absolute inset-0 bg-[#E11D48]"
                      transition={{
                        duration: 0.45,
                        ease: easing,
                      }}
                    />

                  )}

                  <span className="relative z-10">
                    {item}
                  </span>

                </button>

              );

            })}

          </div>

        </motion.div>

      </section>

      {/* Members Section */}
      <section className="mx-auto mt-16 max-w-7xl">

        {/* Portfolio Heading */}
        <AnimatePresence mode="wait">

          <motion.div
            key={`${team}-${portfolio}-heading`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: 0.6,
              ease: easing,
            }}
            className="mb-8 flex flex-col items-center text-center"
          >

            <p className="font-[var(--font-geist-mono)] text-xs uppercase tracking-[0.3em] text-[#E11D48]">
              {team}
            </p>

            <h2 className="mt-3 font-[var(--font-inter)] text-2xl font-semibold text-white sm:text-3xl">
              {portfolio}
            </h2>

            <p className="mt-2 font-[var(--font-inter)] text-xs text-neutral-500">
              {filteredMembers.length}{' '}
              {filteredMembers.length === 1
                ? 'Member'
                : 'Members'}
            </p>

          </motion.div>

        </AnimatePresence>

        {/* Member Cards */}
        <AnimatePresence mode="wait">

          <motion.div
            key={`${team}-${portfolio}`}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.7,
              ease: easing,
            }}
            className="w-full"
          >

            {filteredMembers.length > 0 ? (

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {filteredMembers.map((member, index) => (

                  <MemberCard
                    key={`${member.name}-${member.team}`}
                    member={member}
                    index={index}
                  />

                ))}

              </div>

            ) : (

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: easing,
                }}
                className="flex min-h-[250px] flex-col items-center justify-center text-center"
              >

                <p className="font-[var(--font-geist-mono)] text-xs uppercase tracking-[0.3em] text-neutral-600">
                  {portfolio}
                </p>

                <h3 className="mt-5 font-[var(--font-inter)] text-xl font-semibold text-white">
                  No Members Found
                </h3>

                <p className="mt-3 max-w-md font-[var(--font-inter)] text-sm leading-6 text-neutral-500">
                  No members are currently listed under this portfolio
                  for the selected team.
                </p>

              </motion.div>

            )}

          </motion.div>

        </AnimatePresence>

      </section>

    </main>
  );
}
