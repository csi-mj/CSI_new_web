'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Carousel, TeamMember } from './_components/Carousel';
import GB from './_components/TeamCard';
import NavTabs from './_components/NavTabs';
import Shuffle from '@/components/Shuffle';
import gbData from './_data/gb.json';
import execData from './_data/exec.json';
import coreData from './_data/core.json';

gsap.registerPlugin(ScrollTrigger);

type ExecRaw = {
  id: number;
  name: string;
  position: string;
  portfolio: string;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  email?: string | null;
  imageUrl?: string | null;
};

const execRawData: ExecRaw[] = execData as ExecRaw[];


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

const groupedExec: Record<string, TeamMember[]> = execRawData.reduce((acc, m) => {
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

const teams = Object.keys(groupedExec).map((name) => ({
  name,
  teamMembers: groupedExec[name],
}));

// Core team uses the same shape as ExecRaw; adapt to GB CardItem for grid display
const coreRawData: ExecRaw[] = coreData as ExecRaw[];
const groupedCoreCards: Record<string, CardItem[]> = coreRawData.reduce((acc, m) => {
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

type RawGbMember = {
  id: number;
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

const rawGbData: RawGbMember[] = gbData as RawGbMember[];

const mapGbGroup = (pos: string): string => {
  const p = pos.trim();
  if (p === 'Chief Coordinator' || p === 'Associate CC') return 'Chief Coordinator';
  if (p === 'Deputy GS' || p === 'General Secretary') return 'General Secretary';
  return p;
};

const gbByPosition: Record<string, CardItem[]> = rawGbData.reduce((acc, m) => {
  const original = m['Governing Body Position'].trim();
  const key = mapGbGroup(original);
  const item: CardItem = {
    name: m.Name,
    profession: original,
    image: m["Formal Picture"] || undefined,
    githubUrl: toGithubUrl(m['Github Id'] || undefined),
    linkedinUrl: toUrl(m['Linkedin Id'] || undefined),
  };
  if (!acc[key]) acc[key] = [];
  acc[key].push(item);
  return acc;
}, {} as Record<string, CardItem[]>);

export default function TeamPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const teamTabs = useMemo(() => teams.map((t) => t.name), []);
  const activeTeam = useMemo(() => teams[activeIdx], [activeIdx]);

  const [activeGbIdx, setActiveGbIdx] = useState(0);
  const gbTabs = useMemo(() => Object.keys(gbByPosition), []);
  const gbItems = useMemo(() => (gbTabs.length ? gbByPosition[gbTabs[activeGbIdx]] : []), [gbTabs, activeGbIdx]);

  const [activeCoreIdx, setActiveCoreIdx] = useState(0);
  const coreTeamTabs = useMemo(() => Object.keys(groupedCoreCards), []);
  const coreItems = useMemo(() => (coreTeamTabs.length ? groupedCoreCards[coreTeamTabs[activeCoreIdx]] : []), [coreTeamTabs, activeCoreIdx]);

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

  useGSAP(
    () => {
      if (gbRef.current) {
        gsap.fromTo(
          gbRef.current,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gbRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      if (execRef.current) {
        gsap.to(execRef.current, {
          scale: 0.95,
          y: 90,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: execRef.current,
            start: 'top 30%',
            end: 'top 70%',
            scrub: 2.5,
            invalidateOnRefresh: true,
          }
        });
      }

      if (coreRef.current) {
        gsap.to(coreRef.current, {
          scale: 0.95,
          y: 60,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: coreRef.current,
            start: 'top 50%',
            end: 'top 70%',
            scrub: 2.5,
            invalidateOnRefresh: true,
          }
        });
      }
    },
    { dependencies: [], revertOnUpdate: false }
  );

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
         <div className="relative w-full px-2">
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

      {execVisible && (
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