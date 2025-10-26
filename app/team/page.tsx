import React from 'react';
import { Carousel, TeamMember } from './_components/Carousel';

// Dummy team member data
const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Carolyn Solverson',
    title: 'MD',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=face',
    specialties: ['OB/GYN', 'PREVENTIVE CARE']
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    title: 'MD',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face',
    specialties: ['CARDIOLOGY', 'INTERNAL MEDICINE']
  },
  {
    id: '3',
    name: 'Dr. Michael Chen',
    title: 'MD',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=500&fit=crop&crop=face',
    specialties: ['PEDIATRICS', 'FAMILY MEDICINE']
  },
  {
    id: '4',
    name: 'Dr. Emily Rodriguez',
    title: 'MD',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=face',
    specialties: ['DERMATOLOGY', 'COSMETIC SURGERY']
  },
  {
    id: '5',
    name: 'Dr. James Wilson',
    title: 'MD',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face',
    specialties: ['ORTHOPEDICS', 'SPORTS MEDICINE']
  },
  {
    id: '6',
    name: 'Dr. Lisa Thompson',
    title: 'MD',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=face',
    specialties: ['NEUROLOGY', 'SLEEP MEDICINE']
  },
  {
    id: '7',
    name: 'Dr. Robert Davis',
    title: 'MD',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=500&fit=crop&crop=face',
    specialties: ['EMERGENCY MEDICINE', 'TRAUMA CARE']
  },
  {
    id: '8',
    name: 'Dr. Maria Garcia',
    title: 'MD',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=face',
    specialties: ['PSYCHIATRY', 'MENTAL HEALTH']
  }
];

export default function TeamPage() {
  return <>
  <Carousel teamMembers={teamMembers} />
  <Carousel teamMembers={teamMembers} />

  </>;
}
