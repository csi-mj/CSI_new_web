'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Carousel, TeamMember } from './_components/Carousel';
import GB from './_components/TeamCard';
import NavTabs from './_components/NavTabs';
import GbCollage, { GbMember } from './_components/GbCollage';
import Shuffle from '@/components/Shuffle';
import { useTeam, useTeamYears } from './_hooks/useTeam';
import { DataBoundary } from '@/components/ui/data-boundary';

type ExecRaw = {
  id: number | string;
  name: string;
  position: string;
  portfolio: string;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  email?: string | null;
  imageUrl?: string | null;
};

type RawGbMember = {
  id: number | string;
  Name: string;
  Position: string;
  Portfolio: string;
  'Linkedin Id'?: string;
  'Email Id'?: string;
  'Github Id'?: string;
  'Formal Picture'?: string | null;
  'Governing Body Position': string;
};

type CardItem = {
  name?: string;
  profession?: string;
  image?: string;
  githubUrl?: string;
  linkedinUrl?: string;
};
import { DbMember } from './_hooks/useTeam';

gsap.registerPlugin(ScrollTrigger);

// URL normalizers used by GB and Core cards
const toUrl = (val?: string): string | undefined => {
  if (!val) return undefined;
  const v = val.trim();
  if (!v || v === 'N/A' || v === 'NA' || v === '-' || v === '#') return undefined;
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  return `https://www.linkedin.com/in/${v}`;
};

const toGithubUrl = (val?: string): string | undefined => {
  if (!val) return undefined;
  const v = val.trim();
  if (!v || v === 'N/A' || v === 'NA' || v === '-' || v === '#') return undefined;
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  return `https://github.com/${v}`;
};

const mapGbGroup = (pos: string): string => {
  const p = pos.trim();
  if (p === 'Chief Coordinator' || p === 'Associate CC') return 'Chief Coordinator';
  if (p === 'Deputy GS' || p === 'General Secretary') return 'General Secretary';
  if (p === 'Treasurer' || p === 'Deputy Treasurer') return 'Treasurer';
  return p;
};

// ---------- builders (work for both JSON fallback and DB rows) ----------

const buildExecTeams = (execRawData: ExecRaw[]) => {
  const groupedExec = execRawData.reduce((acc, m) => {
    const key = (m.portfolio || 'Misc').toUpperCase();
    const member: TeamMember = {
      id: String(m.id),
      name: m.name,
      title: m.position,
      image: m.imageUrl || '',
      specialties: [],
      social: {
        github: m.githubUrl ? toGithubUrl(m.githubUrl || undefined) : undefined,
        linkedin: m.linkedinUrl ? toUrl(m.linkedinUrl || undefined) : undefined,
      },
    };
    if (!acc[key]) acc[key] = [];
    acc[key].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  return Object.keys(groupedExec).map((name) => ({
    name,
    teamMembers: groupedExec[name],
  }));
};

const buildCoreCards = (coreRawData: ExecRaw[]) =>
  coreRawData.reduce((acc, m) => {
    const key = (m.portfolio || 'Misc').toUpperCase();
    const item: CardItem = {
      name: m.name,
      profession: m.position,
      image: m.imageUrl || undefined,
      githubUrl: toGithubUrl(m.githubUrl || undefined),
      linkedinUrl: toUrl(m.linkedinUrl || undefined),
    };
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, CardItem[]>);

const buildGbMembers = (rawGbData: RawGbMember[]): GbMember[] =>
  rawGbData.map((m) => {
    const role = m['Governing Body Position'].trim();
    return {
      id: String(m.id),
      name: m.Name,
      role,
      group: mapGbGroup(role),
      image: m['Formal Picture'] || undefined,
      githubUrl: toGithubUrl(m['Github Id'] || undefined),
      linkedinUrl: toUrl(m['Linkedin Id'] || undefined),
      email: m['Email Id'] && m['Email Id'].includes('@') ? m['Email Id'].trim() : undefined,
    };
  });

// DB row -> raw shapes used by the builders
const dbToExecRaw = (rows: DbMember[]): ExecRaw[] =>
  rows.map((r) => ({
    id: r.id,
    name: r.name,
    position: r.position || '',
    portfolio: r.portfolio || 'Misc',
    linkedinUrl: r.linkedin,
    githubUrl: r.github,
    email: r.mail,
    imageUrl: r.image_url,
  }));

const dbToGbRaw = (rows: DbMember[]): RawGbMember[] =>
  rows.map((r) => ({
    id: r.id,
    Name: r.name,
    Position: r.position || '',
    Portfolio: r.portfolio || 'N/A',
    'Linkedin Id': r.linkedin || undefined,
    'Email Id': r.mail || undefined,
    'Github Id': r.github || undefined,
    'Formal Picture': r.image_url || undefined,
    'Governing Body Position': r.gb_position || r.position || 'Member',
  }));

export default function TeamPage() {
  const { data: availableYears = [], isLoading: isYearsLoading } = useTeamYears();
  const [activeYear, setActiveYear] = useState('');

  // Auto-select the first (most recent) year when years are fetched
  useEffect(() => {
    if (availableYears.length > 0 && !activeYear) {
      setActiveYear(availableYears[0]);
    }
  }, [availableYears, activeYear]);
  
  const { gb: dbGbRaw, core: dbCoreRaw, exec: dbExecRaw, isLoading: isTeamLoading, isError } = useTeam(activeYear);
  const isLoading = isYearsLoading || isTeamLoading || !activeYear;

  const gbRaw = dbToGbRaw(dbGbRaw);
  const execRaw = dbToExecRaw(dbExecRaw);
  const coreRaw = dbToExecRaw(dbCoreRaw);

  const teams = useMemo(() => buildExecTeams(execRaw), [execRaw]);
  const groupedCoreCards = useMemo(() => buildCoreCards(coreRaw), [coreRaw]);
  const gbMembers = useMemo(() => buildGbMembers(gbRaw), [gbRaw]);

  const [activeIdx, setActiveIdx] = useState(0);
  const teamTabs = useMemo(() => teams.map((t) => t.name), [teams]);
  const activeTeam = useMemo(
    () => teams[Math.min(activeIdx, Math.max(teams.length - 1, 0))],
    [teams, activeIdx]
  );

  const [activeCoreIdx, setActiveCoreIdx] = useState(0);
  const coreTeamTabs = useMemo(() => Object.keys(groupedCoreCards), [groupedCoreCards]);
  const coreItems = useMemo(
    () =>
      coreTeamTabs.length
        ? groupedCoreCards[coreTeamTabs[Math.min(activeCoreIdx, coreTeamTabs.length - 1)]]
        : [],
    [groupedCoreCards, coreTeamTabs, activeCoreIdx]
  );

  const gbRef = useRef<HTMLElement | null>(null);
  const execRef = useRef<HTMLElement | null>(null);
  const coreRef = useRef<HTMLElement | null>(null);

  const [execVisible, setExecVisible] = useState(false);
  const [coreVisible, setCoreVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === execRef.current) setExecVisible(true);
            if (entry.target === coreRef.current) setCoreVisible(true);
          }
        });
      },
      { rootMargin: '200px 0px' }
    );
    if (execRef.current) observer.observe(execRef.current);
    if (coreRef.current) observer.observe(coreRef.current);
    return () => observer.disconnect();
  }, [isLoading]);

  // Ensure ScrollTrigger recalculates once content mounts/lazy-mounts
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [execVisible, coreVisible]);

  return (
    <div className="w-screen mt-32 relative min-h-screen">
      {availableYears.length > 0 && (
        <div className="w-full flex justify-center gap-4 relative z-20">
           <NavTabs 
             tabs={availableYears} 
             activeIdx={availableYears.indexOf(activeYear)} 
             onChange={(idx) => setActiveYear(availableYears[idx])} 
           />
        </div>
      )}

      <DataBoundary
        isLoading={isLoading}
        isError={isError}
        isEmpty={gbMembers.length === 0 && teamTabs.length === 0 && coreTeamTabs.length === 0}
        loadingTitle="Loading Team Data"
        loadingDescription="Fetching the brightest minds..."
      >
        {gbMembers.length > 0 && (
          <section
            ref={gbRef}
            className="gb-section will-change-transform transform-gpu"
            style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' as const, contain: 'paint' as const }}
          >
            <GbCollage members={gbMembers} term={activeYear} />
          </section>
        )}
        {teamTabs.length > 0 && (
          <section
            ref={execRef}
            className="exec-section will-change-transform transform-gpu"
            style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' as const, contain: 'paint' as const }}
          >
            <div className='w-full flex justify-center relative z-10'>
              <Shuffle 
                  text="EXECUTIVE COMMITTEE" 
                  tag="h1"
                  className="font-orbitron !text-3xl mt-16 mb-8 md:!text-6xl !text-primary !normal-case !font-bold"
                  immediate={true}
                  loop={true}
                  loopDelay={2}
                  duration={0.4}
                  stagger={0.04}
                  shuffleTimes={2}
                  animationMode="evenodd"
                  triggerOnce={false}
                  triggerOnHover={true}
                />
            </div>
            <div className="relative w-full px-2">
              <div className="flex flex-wrap gap-2 justify-center">
                <NavTabs tabs={teamTabs} activeIdx={activeIdx} onChange={setActiveIdx} />
              </div>
            </div>

            {execVisible && activeTeam && (
              <div className="w-full">
                <Carousel teamMembers={activeTeam.teamMembers} teamName={activeTeam.name} />
              </div>
            )}
          </section>
        )}
        {coreTeamTabs.length > 0 && (
          <section
            ref={coreRef}
            className="core-section will-change-transform transform-gpu"
            style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' as const, contain: 'paint' as const }}
          >
            <div className='w-full flex justify-center relative z-10'>
              <Shuffle 
                  text="CORE TEAM" 
                  tag="h1"
                  className="font-orbitron !text-5xl mt-16 mb-8 md:!text-6xl !text-primary !normal-case !font-bold"
                  immediate={true}
                  loop={true}
                  loopDelay={2}
                  duration={0.4}
                  stagger={0.04}
                  shuffleTimes={4}
                  animationMode="evenodd"
                  triggerOnce={false}
                  triggerOnHover={true}
                />
            </div>
            <div className="relative w-full px-2">
              {coreVisible && (
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  <NavTabs tabs={coreTeamTabs} activeIdx={activeCoreIdx} onChange={setActiveCoreIdx} />
                </div>
              )}
            </div>
            {coreVisible && <GB items={coreItems} />}
          </section>
        )}
      </DataBoundary>
    </div>
  );
}
