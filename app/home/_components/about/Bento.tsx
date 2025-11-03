'use client';
import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

import { BentoGrid, BentoGridItem } from '../../../../components/ui/bento-grid';

export function Bento() {
  useGSAP(() => {
    gsap.to('.bent', {
      scale: 0.9,
      y: 90,
      scrollTrigger: {
        trigger: '.bent',
        start: 'top 119%',
        end: 'top 50%',
        scrub: 3
      }
    });
  }, []);

  return (
    <div className="flex h-max w-screen items-center justify-center bg-black pb-10">
      <BentoGrid className="relative bent mx-auto mb-7 max-w-4xl will-change-transform">
        {items.map((item, idx) => (
          <BentoGridItem
            key={idx}
            title={item.title}
            description={item.description}
            header={item.header}
            imageSrc={item.imageSrc}
            href={item.href}
            className={`${idx === 2 || idx === 5 || idx === 1 ? 'md:col-span-2' : ''} `}
          />
        ))}
      </BentoGrid>
    </div>
  );
}
const Skeleton = () => (
  <div className="flex size-full min-h-24 flex-1 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"></div>
);
const items = [
  {
    title: 'Our Faculty Coordinator',
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.lorem ipsum dolor sit ame ',
    header: <Skeleton />,
    imageSrc:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face',
    href: ''
  },
  {
    title: 'Innovate, Inspire, Impact: Explore Our Event',
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magn ',
    header: <Skeleton />,
    imageSrc:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face',
    href: '/events'
  },
  {
    title: 'The Team',
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore m ',
    header: <Skeleton />,
    imageSrc:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face',
    href: '/team'
  },
  {
    title: 'Hackathons: Compete, Excel',
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.lorem ipsum dolor sit amet, ',
    header: <Skeleton />,
    imageSrc:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face',
    href: 'https://hackrevolution.in'
  },
  {
    title: 'Blogs: Voices of Innovation',
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.lorem ipsum dolor sit amet,df',
    header: <Skeleton />,
    imageSrc:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face',
    href: '/blogs'
  },
  {
    title: 'Membership: Empower Your Entrepreneurial Journey',
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
    header: <Skeleton />,
    imageSrc:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face',
    href: '/membership'
  }
];
