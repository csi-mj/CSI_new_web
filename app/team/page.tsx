'use client';

import React, { useRef, useState } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Carousel, TeamMember } from './_components/Carousel';
import GB from './_components/GB';
import NavTabs from './_components/NavTabs';
import Shuffle from '@/components/Shuffle';

gsap.registerPlugin(ScrollTrigger);

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Carolyn Solverson',
    title: 'MD',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=face',
    specialties: ['OB/GYN', 'PREVENTIVE CARE']
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    title: 'MD',
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face',
    specialties: ['CARDIOLOGY', 'INTERNAL MEDICINE']
  },
  {
    id: '3',
    name: 'Dr. Michael Chen',
    title: 'MD',
    image:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=500&fit=crop&crop=face',
    specialties: ['PEDIATRICS', 'FAMILY MEDICINE']
  },
  {
    id: '4',
    name: 'Dr. Emily Rodriguez',
    title: 'MD',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=face',
    specialties: ['DERMATOLOGY', 'COSMETIC SURGERY']
  },
  {
    id: '5',
    name: 'Dr. James Wilson',
    title: 'MD',
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face',
    specialties: ['ORTHOPEDICS', 'SPORTS MEDICINE']
  },
  {
    id: '6',
    name: 'Dr. Lisa Thompson',
    title: 'MD',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=face',
    specialties: ['NEUROLOGY', 'SLEEP MEDICINE']
  },
  {
    id: '7',
    name: 'Dr. Robert Davis',
    title: 'MD',
    image:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=500&fit=crop&crop=face',
    specialties: ['EMERGENCY MEDICINE', 'TRAUMA CARE']
  },
  {
    id: '8',
    name: 'Dr. Maria Garcia',
    title: 'MD',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=face',
    specialties: ['PSYCHIATRY', 'MENTAL HEALTH']
  }
];

const teams = [
  {
    name: 'TECH',
    teamMembers: teamMembers
  },
  {
    name: 'WEB',
    teamMembers: teamMembers
  },
  {
    name: 'HR',
    teamMembers: teamMembers
  },
  {
    name: 'EVENT',
    teamMembers: teamMembers
  },
  {
    name: 'DESIGN',
    teamMembers: teamMembers
  },
  {
    name: 'EDITORIAL',
    teamMembers: teamMembers
  },
  {
    name: 'MEDIA',
    teamMembers: teamMembers
  },
  {
    name: 'MARKETING',
    teamMembers: teamMembers
  },
  {
    name: 'OPERATIONS',
    teamMembers: teamMembers
  },
];

export default function TeamPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeTeam = teams[activeIdx];
  const teamTabs = teams.map((t) => t.name);

  // Secondary NavTabs for GB section
  const [activeGbIdx, setActiveGbIdx] = useState(0);
  const gbTabs = ['GB ONE', 'GB TWO', 'GB THREE'];
  const gbItems = Array.from({ length: 5 }).map((_, i) => ({
    name: `Member ${i + 1}`,
    profession: i % 2 ? 'ASSOCIATE' : 'TECH HEAD',
    image:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop',
    hoverGif: 'https://media1.tenor.com/m/7HYOnFr3-aIAAAAd/sad-sad-monkey.gif',
    gradient: 'linear-gradient(135deg, rgba(20,20,20,0.9), rgba(30,30,30,0.9))',
    borderColor: 'transparent',
    githubUrl: 'https://github.com/',
    linkedinUrl: 'https://www.linkedin.com/'
  }));

  // Refs for section scoping (prevents global DOM scans)
  const gbRef = useRef<HTMLElement | null>(null);
  const execRef = useRef<HTMLElement | null>(null);
  const coreRef = useRef<HTMLElement | null>(null);

  // Scroll-triggered animations for sections (scoped for performance)
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
          scale: 0.93,
          y: 90,
          ease: 'none',
          scrollTrigger: {
            trigger: execRef.current,
            start: 'top 60%',
            end: 'top 30%',
            scrub: 1.5
          }
        });
      }

      if (coreRef.current) {
        gsap.to(coreRef.current, {
          scale: 0.93,
          y: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: coreRef.current,
            start: 'top 60%',
            end: 'top 30%',
            scrub: 2.5
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
              className="font-silkscreen !text-5xl mt-16 mb-8 md:!text-6xl !text-primary !normal-case !font-bold"
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
         <div className="relative w-full px-4">
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
              className="font-silkscreen !text-3xl mt-16 mb-8 md:!text-6xl !text-primary !normal-case !font-bold"
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
      <div className="relative w-full px-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <NavTabs tabs={teamTabs} activeIdx={activeIdx} onChange={setActiveIdx} />
        </div>
      </div>

      <div className="w-full">
        <Carousel teamMembers={activeTeam.teamMembers} teamName={activeTeam.name} />
      </div>
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
              className="font-silkscreen !text-5xl mt-16 mb-8 md:!text-6xl !text-primary !normal-case !font-bold"
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
         <div className="relative w-full px-4">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <NavTabs tabs={teamTabs} activeIdx={activeIdx} onChange={setActiveIdx} />
        </div>
      </div>
      <GB items={gbItems} />
      </section>
    </div>
  );
}