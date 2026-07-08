'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Carousel, TeamMember } from './_components/Carousel';
import GB from './_components/TeamCard';
import NavTabs from './_components/NavTabs';
import Shuffle from '@/components/Shuffle';
import gbData from './_data/gb.json';
import execData from './_data/exec.json';
import coreData from './_data/core.json';

gsap.registerPlugin(ScrollTrigger);

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
  'Formal Picture'?: string;
  'Governing Body Position': string;
};

type CardItem = {
  name?: string;
  profession?: string;
  image?: string;
  githubUrl?: string;
  linkedinUrl?: string;
};

// Shape returned by /api/team/* (Supabase csi_team rows)
type DbMember = {
  id: string;
  sno: number | null;
  name: string;
  position: string | null;
  role: 'gb' | 'core' | 'execom';
  image_url: string | null;
  linkedin: string | null;
  github: string | null;
  mail: string | null;
  portfolio: string | null;
  gb_position: string | null;
};

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

const buildGbByPosition = (rawGbData: RawGbMember[]) =>
  rawGbData.reduce((acc, m) => {
    const original = m['Governing Body Position'].trim();
    const key = mapGbGroup(original);
    const item: CardItem = {
      name: m.Name,
      profession: original,
      image: m['Formal Picture'] || undefined,
      githubUrl: toGithubUrl(m['Github Id'] || undefined),
      linkedinUrl: toUrl(m['Linkedin Id'] || undefined),
    };
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, CardItem[]>);

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
  // Start with bundled JSON, then replace with live DB data when it loads
  const [gbRaw, setGbRaw] = useState<RawGbMember[]>(gbData as RawGbMember[]);
  const [execRaw, setExecRaw] = useState<ExecRaw[]>(execData as ExecRaw[]);
  const [coreRaw, setCoreRaw] = useState<ExecRaw[]>(coreData as ExecRaw[]);

  useEffect(() => {
    const grab = async (url: string): Promise<DbMember[] | null> => {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const json = await res.json();
        return Array.isArray(json) && json.length > 0 ? json : null;
      } catch {
        return null;
      }
    };
    (async () => {
      const [gb, core, exec] = await Promise.all([
        grab('/api/team/gb'),
        grab('/api/team/core'),
        grab('/api/team/execom'),
      ]);
      if (gb) setGbRaw(dbToGbRaw(gb));
      if (core) setCoreRaw(dbToExecRaw(core));
      if (exec) setExecRaw(dbToExecRaw(exec));
    })();
  }, []);

  const teams = useMemo(() => buildExecTeams(execRaw), [execRaw]);
  const groupedCoreCards = useMemo(() => buildCoreCards(coreRaw), [coreRaw]);
  const gbByPosition = useMemo(() => buildGbByPosition(gbRaw), [gbRaw]);

  const [activeIdx, setActiveIdx] = useState(0);
  const teamTabs = useMemo(() => teams.map((t) => t.name), [teams]);
  const activeTeam = useMemo(
    () => teams[Math.min(activeIdx, Math.max(teams.length - 1, 0))],
    [teams, activeIdx]
  );

  const [activeGbIdx, setActiveGbIdx] = useState(0);
  const gbTabs = useMemo(() => Object.keys(gbByPosition), [gbByPosition]);
  const gbItems = useMemo(
    () => (gbTabs.length ? gbByPosition[gbTabs[Math.min(activeGbIdx, gbTabs.length - 1)]] : []),
    [gbByPosition, gbTabs, activeGbIdx]
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
  }, []);

  // Ensure ScrollTrigger recalculates once content mounts/lazy-mounts
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [execVisible, coreVisible]);

  return (
    <div className="w-screen mt-20">
      <section
        ref={gbRef}
        className="gb-section will-change-transform transform-gpu"
        style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' as const, contain: 'paint' as const }}
      >
        <div className='w-full flex justify-center relative z-10'>
          <Shuffle 
              text="GOVERNING BODY" 
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
         <div className="relative w-full md:px-6">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <NavTabs tabs={gbTabs} activeIdx={activeGbIdx} onChange={setActiveGbIdx} />
        </div>
      </div>
      <GB items={gbItems} />
      </section>
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
    </div>
  );
}
