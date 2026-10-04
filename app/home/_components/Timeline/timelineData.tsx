import React from 'react';
import Image from 'next/image';
import { TimelineEntry } from './timeline';
import { Calendar, MapPin } from 'lucide-react';

export const timelineData: TimelineEntry[] = [
  {
    title: "Sep 19, 2025",
    content: (
      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
              SIH Decoded – Hear it from the Winners!
            </h4>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
              Seminar
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
            Guidance for Smart India Hackathon
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1 font-mono text-neutral-300">
              <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Sep 19, 2025
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> CIC Lab, Block 2
            </span>
          </div>
        </div>

        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
          In 2024, two CSI teams from MJCET won Smart India Hackathon. In this guidance seminar, the winners shared essential advice on problem statement selection, winning presentation strategies, and navigating the competition journey from problem statement selection to the national finale.
        </p>

        {/* <div className="flex flex-wrap gap-1.5 pt-1">
          {["SIH", "Hackathon", "Guidance", "Success Story"].map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/SIH Decoded 25 (1).png"
              alt="SIH Decoded Guidance Seminar"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/SIH Decoded 25 (2).png"
              alt="SIH Decoded Winners Sharing Experience"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Oct 18, 2025",
    content: (
      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
              WEBVERSE
            </h4>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
              Workshop
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
            The Official Pre-Hackathon Workshop Series Of Hackrevolution
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1 font-mono text-neutral-300">
              <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Nov 16, 2024
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> Lab 301, MJCET
            </span>
          </div>
        </div>

        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
          CSI and E-Cell MJCET organized WEBVERSE – The Web Development Workshop, the first pre-hackathon session of Hack Revolution. Students explored modern web technologies and learned how to transform their concepts into dynamic, creative, and functional web applications.
        </p>

        {/* <div className="flex flex-wrap gap-1.5 pt-1">
          {["Web Development", "React", "Workshop"].map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/web verse 2.png"
              alt="WEBVERSE Development Workshop"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/web verse 3.png"
              alt="WEBVERSE Hands-on Session"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Oct 25, 2025",
    content: (
      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
              VisionVerse
            </h4>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
              Workshop
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
            The Official Pre-Hackathon Workshop Series of Hack Revolution
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1 font-mono text-neutral-300">
              <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Oct 25, 2025
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> CIC Lab, Block 2
            </span>
          </div>
        </div>

        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
          VisionVerse was an immersive pre-hackathon workshop introducing students to Computer Vision, where machines learn to see and understand visual data like humans. Participants learned fundamental image processing, object detection, and explored modules with OpenCV and Python.
        </p>

        {/* <div className="flex flex-wrap gap-1.5 pt-1">
          {["Computer Vision", "AI", "OpenCV", "Python"].map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/vision verse 1.png"
              alt="VisionVerse Workshop Session"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/vision verse 2.png"
              alt="VisionVerse Practical Demo"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Oct 29, 2025",
    content: (
      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
              Data Analytics using Terraview
            </h4>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
              Workshop
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
            Turning Data into Stories
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1 font-mono text-neutral-300">
              <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Oct 29, 2025
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> CIC Lab Block 2
            </span>
          </div>
        </div>

        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
          A hands-on workshop tailored for first-year students exploring the world of data analytics with Terraview. Participants gained practical experience transforming raw datasets into impactful dashboards and data stories, equipping them with essential visualization skills ahead of Terraview 2025.
        </p>

        {/* <div className="flex flex-wrap gap-1.5 pt-1">
          {["Data Analytics", "Terraview", "Visualization"].map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/Data Analytics using Terraview 1.png"
              alt="Data Analytics using Terraview Workshop"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/Data Analytics using Terraview 2.jpg"
              alt="Data Analytics using Terraview Hands-on"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Nov 8, 2025",
    content: (
      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
              Terraview 2025: Turning Data into Stories
            </h4>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
              Competition
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
            The Ultimate First Year Showdown | Powered by ACES
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1 font-mono text-neutral-300">
              <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Nov 8, 2025
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> Seminar Hall, Block 4
            </span>
          </div>
        </div>

        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
          Exclusively for first-year students, Terraview 2025 gave participants the stage to step into data visualization and turn raw numbers into compelling visual insights in a solo showdown competing for a ₹30,000 cash prize pool.
        </p>

        {/* <div className="flex flex-wrap gap-1.5 pt-1">
          {["Data Visualization", "Competition", "Terraview", "First Years"].map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/Terraview 2025.JPG"
              alt="Terraview 2025 Competition"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/Terraview 2025.png"
              alt="Terraview 2025 Presentation"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Nov 8, 2025",
    content: (
      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
              Hack Revolution 2025
            </h4>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
              Hackathon
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
            Biggest Flagship Event | Powered by Aces
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1 font-mono text-neutral-300">
              <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Nov 8, 2025
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> Ghulam Ahmed Hall MJCET
            </span>
          </div>
        </div>

        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
          The ultimate tech face-off where innovation met impact, presented by CSI x E-Cell MJCET. A 15-hour coding marathon designed to challenge creativity, logic, and problem-solving, featuring competitive tracks in Smart Education, Urban Tech, Agriculture, and Open Hardware, with a ₹3,00,000 prize pool and direct entry to Smart India Hackathon 2026 for winners.
        </p>

        {/* <div className="flex flex-wrap gap-1.5 pt-1">
          {["Hackathon", "Innovation", "Coding", "Smart India Hackathon"].map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/Hack Revolution 1.png"
              alt="Hack Revolution 2025 Flagship Hackathon"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/Hack Revolution 2.jpg"
              alt="Hack Revolution 2025 Coding Marathon"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Nov 21, 2025",
    content: (
      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
              Prompt Arena
            </h4>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
              Competition
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
            Outsmart. Outcreate. Outprompt.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1 font-mono text-neutral-300">
              <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Nov 21, 2025
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> Seminar Hall, Block 4
            </span>
          </div>
        </div>

        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
          Prompt Arena was a high-energy competition where creativity met logic and AI technology. Participants challenged themselves across three electrifying rounds—from a mind-bending Quiz to an intense Prompt Battle and a thrilling Mystery Round—to prove their prompt engineering capabilities.
        </p>

        {/* <div className="flex flex-wrap gap-1.5 pt-1">
          {["AI", "Prompt Engineering", "Competition", "Creativity"].map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/prompt arena 1.jpg"
              alt="Prompt Arena Competition"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/prompt arena 2.png"
              alt="Prompt Arena Challenge"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Nov 28, 2025",
    content: (
      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
              CSI Community Connect
            </h4>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
              Community
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
            The Ultimate CSI Community Meetup
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1 font-mono text-neutral-300">
              <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Nov 28, 2025
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> Student Activity Center, Block 1
            </span>
          </div>
        </div>

        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
          The ultimate CSI Community Connect meetup brought the entire CSI family together with engaging activities, team bonding, high-energy group challenges, and lively moments to kick off the chapter&apos;s community initiatives with enthusiasm.
        </p>

        {/* <div className="flex flex-wrap gap-1.5 pt-1">
          {["Community", "Fun", "Networking"].map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/Community Connect 1.jpg"
              alt="CSI Community Connect Meetup"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/Community Connect 2.png"
              alt="CSI Community Connect Gathering"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Dec 5, 2025",
    content: (
      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
              Antigravity Unlocked
            </h4>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
              Workshop
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
            Powered by Gemini
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1 font-mono text-neutral-300">
              <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Dec 5, 2025
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> Student Activity Centre
            </span>
          </div>
        </div>

        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
          With AI rapidly evolving, &apos;Antigravity Unlocked Powered by Gemini&apos; provided participants with a hands-on journey into the world of Agentic AI and Google’s revolutionary Antigravity framework, delving into next-generation intelligent developer workflows and autonomous tooling.
        </p>

        {/* <div className="flex flex-wrap gap-1.5 pt-1">
          {["AI", "Google", "Agentic AI", "Workshop"].map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/Antigravity 1.png"
              alt="Antigravity Unlocked Workshop"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/Antigravity 2.png"
              alt="Antigravity Unlocked Session"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Dec 6, 2025",
    content: (
      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
              Dev Showdown
            </h4>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
              Showcase
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
            Execom Project Showcase
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1 font-mono text-neutral-300">
              <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Dec 6, 2025
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> Lab 4
            </span>
          </div>
        </div>

        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
          &apos;Dev Showdown&apos; was a project showcase presented by our Execom members, where teams presented the exciting projects they had been building. Attendees discovered creative and practical tech solutions, drew inspiration for future projects, and connected with the CSI technical community.
        </p>

        {/* <div className="flex flex-wrap gap-1.5 pt-1">
          {["Project Showcase", "Innovation", "Tech"].map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/Dev Showdown 1.png"
              alt="Dev Showdown Presentation"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/Dev Showdown 2.png"
              alt="Dev Showdown Showcase"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Dec 12, 2025",
    content: (
      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
              Volunteer Appreciation Ceremony
            </h4>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
              Ceremony
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
            Celebrating Our Heroes
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <span className="flex items-center gap-1 font-mono text-neutral-300">
              <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Dec 12, 2025
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> Seminar Hall
            </span>
          </div>
        </div>

        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
          CSI and E-Cell successfully organized Hack Revolution 2025 this November, made possible by the incredible effort and dedication of our volunteers. The chapter hosted a ceremony filled with appreciation, gratitude, and good vibes to celebrate their vital contributions.
        </p>

        {/* <div className="flex flex-wrap gap-1.5 pt-1">
          {["Volunteer", "Appreciation", "CSI"].map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/Volunteer 1.jpg"
              alt="Volunteer Appreciation Ceremony"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
            <Image
              src="/timeline images/Volunteer 2.jpg"
              alt="Volunteer Appreciation Team"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 380px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          </div>
        </div>
      </div>
      
    ),
  },
  
{
  title: "Apr 9–10, 2026",
  content: (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
            ADSOPHOS 2026
          </h4>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
            Technical Fest
          </span>
        </div>

        <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
          Revival of MJCET&apos;s Flagship Technical Fest
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1 font-mono text-neutral-300">
            <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Apr 9–10, 2026
          </span>
          <span className="flex items-center gap-1 text-neutral-400">
            <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> MJCET Campus
          </span>
        </div>
      </div>

      <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
        The Computer Science and Engineering Department at MJCET proudly contributed to ADSOPHOS 2026, held on April 9–10, marking the revival of the college&apos;s flagship technical fest. Alongside CSI, GDG, and MSS, the department organized 12 technical and fun-based events, including Project Expo, PaperX, Canvas Clash, Brain &amp; Buzzers, Byetopia, Mission Impossible, Auction Mania, The Gaming Lab, and Conquest. The fest featured innovative student projects, engaging competitions, and interactive experiences, showcasing the department&apos;s technical expertise and collaborative spirit.
      </p>

      {/* <div className="flex flex-wrap gap-1.5 pt-1">
        {[
          "Technical Fest",
          "Project Expo",
          "Innovation",
          "Competitions",
          "MJCET",
        ].map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
          >
            #{tag}
          </span>
        ))}
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/Adsophos 1.jpg"
            alt="ADSOPHOS 2026 Technical Fest"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/Adsophos 4.jpg"
            alt="ADSOPHOS 2026 Technical Fest"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/Adsophos 2.jpg"
            alt="ADSOPHOS 2026 Events and Activities"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/Adsophos 3.jpg"
            alt="ADSOPHOS 2026 Technical Fest"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>
      </div>
    </div>
  ),
},

{
  title: "Jun 12, 2026",
  content: (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
            Tech Nova 2026
          </h4>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
            Project Expo
          </span>
        </div>

        <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
          CSI MJCET Annual Project Expo
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1 font-mono text-neutral-300">
            <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Jun 12, 2026
          </span>
          <span className="flex items-center gap-1 text-neutral-400">
            <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> CSE Labs, MJCET
          </span>
        </div>
      </div>

      <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
        On June 12, 2026, CSI MJCET organized Tech Nova 2026, its annual project expo, providing a platform for students to showcase their technical innovations. The event brought together 97 participants across 38 teams, presenting projects in AI/ML, Web Development, App Development, FinTech, Cybersecurity, and more. Industry experts Mr. Taufeeq Nomaan, Mr. Habeeb Saleh, and Mr. Khaja Mohammad Owais Junedi evaluated the projects and shared valuable feedback, encouraging innovation, practical problem-solving, and learning beyond academics.
      </p>

      {/* <div className="flex flex-wrap gap-1.5 pt-1">
        {[
          "Project Expo",
          "Innovation",
          "AI/ML",
          "Web Development",
          "Cybersecurity",
        ].map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
          >
            #{tag}
          </span>
        ))}
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/tech nova (1).jpg"
            alt="Tech Nova 2026 Project Expo"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/tech nova (2).png"
            alt="Students presenting projects at Tech Nova 2026"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>
      </div>
    </div>
  ),
},

{
  title: "Jun 27, 2026",
  content: (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
            Innovatia Panoply 2026
          </h4>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
            Project Exhibition
          </span>
        </div>

        <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
          Annual Project Exhibition — Department of CSE, MJCET
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1 font-mono text-neutral-300">
            <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Jun 27, 2026
          </span>
          <span className="flex items-center gap-1 text-neutral-400">
            <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> Ghulam Ahmed Hall, MJCET
          </span>
        </div>
      </div>

      <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
        On June 27, 2026, the Department of CSE, MJCET, in collaboration with CSI-MJCET, organized Innovatia Panoply 2026, its annual project exhibition. The event featured 69 teams of third-year students presenting innovative projects across diverse technical domains, demonstrating creativity, practical implementation, and problem-solving skills. Industry professionals evaluated the projects based on innovation, technical execution, presentation, and practicality, offering valuable feedback and industry insights. Guided by faculty mentors, the exhibition celebrated technical excellence, teamwork, and real-world engineering solutions.
      </p>

      {/* <div className="flex flex-wrap gap-1.5 pt-1">
        {[
          "Project Exhibition",
          "Innovation",
          "Engineering",
          "Teamwork",
          "Problem Solving",
        ].map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
          >
            #{tag}
          </span>
        ))}
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/Innovatia Pannoply 1.jpg"
            alt="Innovatia Panoply 2026 Project Exhibition"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/Innovatia Pannoply 2.jpg"
            alt="Students showcasing projects at Innovatia Panoply 2026"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>
      </div>
    </div>
  ),
},

{
  title: "Jul 11, 2026",
  content: (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
            CSI Annual Excellence Awards 2025–26
          </h4>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
            Recognition
          </span>
        </div>

        <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
          Celebrating Excellence in Technical Education and Student Leadership
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1 font-mono text-neutral-300">
            <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Jul 11, 2026
          </span>
          <span className="flex items-center gap-1 text-neutral-400">
            <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> Narsimha Reddy Engineering College, Secunderabad
          </span>
        </div>
      </div>

      <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
        On July 11, 2026, the CSI Hyderabad Chapter organized the CSI Annual Excellence Awards 2025–26 at Narsimha Reddy Engineering College, Secunderabad, celebrating excellence in technical education and student leadership. The event was graced by Prof. A. Goverdhan, Vice-Chancellor of JNTU Basara, as Chief Guest. CSI MJCET received two prestigious recognitions: Best Emerging Principal, conferred upon Prof. S. Srinivasa Rao, and Best Society Outreach, awarded to Mr. Mohammed Abdullah Shareef, Chief Coordinator, CSI MJCET. These honours celebrated the chapter's leadership, outreach, and contributions to the student community.
      </p>

      {/* <div className="flex flex-wrap gap-1.5 pt-1">
        {[
          "Awards",
          "Recognition",
          "Student Leadership",
          "CSI MJCET",
          "Community Outreach",
        ].map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
          >
            #{tag}
          </span>
        ))}
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/CSI Awards 1.jpg"
            alt="CSI Annual Excellence Awards 2025–26"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/CSI Awards 2.jpg"
            alt="CSI MJCET receiving awards at the annual excellence awards"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>
      </div>
    </div>
  ),
},

{
  title: "Aug 22, 2026",
  content: (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
            School Visit
          </h4>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
            Outreach
          </span>
        </div>

        <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
          Educational Outreach Programme by CSI MJCET
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1 font-mono text-neutral-300">
            <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Aug 22, 2026
          </span>
          <span className="flex items-center gap-1 text-neutral-400">
            <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> Safdariya School, Mehdipatnam
          </span>
        </div>
      </div>

      <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
        On August 22, 2026, CSI MJCET organized an educational outreach programme at Safdariya School, Mehdipatnam, engaging around 60 students through interactive sessions on career guidance, skill development, health awareness, financial independence, and informed decision-making. Conducted by CSI student leaders, the sessions encouraged confidence, perseverance, and the importance of education among young girls. Educational supplies were distributed to support their academic needs. The initiative promoted girls&apos; empowerment, community engagement, and education as a pathway to independent futures.
      </p>

      {/* <div className="flex flex-wrap gap-1.5 pt-1">
        {[
          "Community Outreach",
          "Girls' Empowerment",
          "Education",
          "Skill Development",
          "Social Impact",
        ].map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
          >
            #{tag}
          </span>
        ))}
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/School Visit 1.JPG"
            alt="CSI MJCET School Visit at Safdariya School"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/School Visit 2.jpg"
            alt="CSI MJCET student leaders interacting with school students"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>
      </div>
    </div>
  ),
},

{
  title: "Aug 23, 2026",
  content: (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
            Exposure Visit To T-Hub 
          </h4>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
            Industry Visit
          </span>
        </div>

        <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
          Startup and Entrepreneurship Exposure Programme
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1 font-mono text-neutral-300">
            <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Aug 23, 2026
          </span>
          <span className="flex items-center gap-1 text-neutral-400">
            <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> T-Hub, Hyderabad
          </span>
        </div>
      </div>

      <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
        On August 23, 2026, CSI-MJCET, in association with the Department of CSE, organized an exposure visit to T-Hub, Hyderabad, for its Governing Body. Students gained insights into startups, entrepreneurship, innovation, and industry practices while interacting with startup mentors and industry professionals. Discussions covered mentorship opportunities, international collaborations, and career prospects, alongside an interaction with the Phino startup team that highlighted practical industry exposure and training opportunities. The visit encouraged students to connect academic learning with real-world experiences and develop an entrepreneurial mindset.
      </p>

      {/* <div className="flex flex-wrap gap-1.5 pt-1">
        {[
          "Industry Visit",
          "Entrepreneurship",
          "Innovation",
          "Startups",
          "Networking",
        ].map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
          >
            #{tag}
          </span>
        ))}
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/THUB 1.jpg"
            alt="CSI-MJCET Governing Body visit to T-Hub Hyderabad"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/THUB 2.jpg"
            alt="Students interacting with startup professionals at T-Hub"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>
      </div>
    </div>
  ),
},

{
  title: "Sep 23, 2026",
  content: (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-orbitron tracking-tight">
            Annual Day 2025–26
          </h4>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2.5 py-0.5 rounded-full bg-primary/10">
            Celebration
          </span>
        </div>

        <p className="text-xs sm:text-sm text-neutral-400 font-inter italic mb-2">
          Celebrating a Year of Innovation, Collaboration, and Growth
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1 font-mono text-neutral-300">
            <Calendar className="text-primary h-3.5 w-3.5 -mt-0.5" /> Sep 23, 2026
          </span>
          <span className="flex items-center gap-1 text-neutral-400">
            <MapPin className="text-primary h-3.5 w-3.5 -mt-0.5" /> MJCET
          </span>
        </div>
      </div>

      <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
        On September 23, 2026, CSI-MJCET celebrated the conclusion of its 2025–26 tenure, reflecting on a year of innovation, collaboration, and growth. The event featured an insightful address by Google Engineer and MJCET alumnus Mr. Mohammed Imran Khan, alongside the unveiling of the Annual Report. The outgoing Governing Body, Executive Committee, and Core Team were felicitated for their contributions, and the incoming Governing Body for 2026–27 was announced. With an encouraging address by Faculty Coordinator Mr. Zainuddin Naveed, the ceremony marked the transition to a new tenure and the continuation of CSI-MJCET&apos;s legacy.
      </p>

      {/* <div className="flex flex-wrap gap-1.5 pt-1">
        {[
          "Tenure Closing",
          "Leadership",
          "Annual Report",
          "Recognition",
          "CSI-MJCET",
        ].map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
          >
            #{tag}
          </span>
        ))}
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/Annual Day 1.jpg"
            alt="CSI-MJCET Annual Day 2025–26"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-lg group hover:border-white/20 transition-all duration-300">
          <Image
            src="/timeline images/Annual Day 2.jpg"
            alt="CSI-MJCET outgoing and incoming Governing Body"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 380px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>
      </div>
    </div>
  ),
},

];
