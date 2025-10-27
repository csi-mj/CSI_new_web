'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Carousel, TeamMember } from './_components/Carousel';
import { motion } from 'framer-motion';

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
    name: 'ASSOCIATE TECH',
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
    name: 'ASSOCIATE HR',
    teamMembers: teamMembers
  },
  {
    name: 'EVENT',
    teamMembers: teamMembers
  },
  {
    name: 'DESIGN',
    teamMembers: teamMembers
  }
];

const CarouselSection = ({
  teamMembers,
  teamName,
  index
}: {
  teamMembers: TeamMember[];
  teamName: string;
  index: number;
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      className="h-screen w-screen"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {inView && <Carousel teamMembers={teamMembers} teamName={teamName} />}
    </motion.div>
  );
};

export default function TeamPage() {
  return (
    <div className="w-screen">
      {teams.map((team, index) => (
        <CarouselSection
          key={team.name}
          teamMembers={team.teamMembers}
          teamName={team.name}
          index={index}
        />
      ))}
    </div>
  );
}
