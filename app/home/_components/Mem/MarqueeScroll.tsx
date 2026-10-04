'use client'
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Marquee } from "@/components/ui/marquee"
import CardsDemo from "@/components/cards-demo-1"
import { useTeam } from "@/app/team/_hooks/useTeam";

type MappedMember = {
  name: string;
  profession: string;
  image?: string;
  githubUrl?: string;
  linkedinUrl?: string;
};

function MarqueeScrollComponent() {
  const { gb } = useTeam('2026-27');
  const members = gb || [];
  
  const toUrl = (val?: string) => {
    if (!val) return undefined;
    const v = val.trim();
    if (!v || v === 'N/A' || v === 'NA' || v === '-' || v === '#') return undefined;
    if (v.startsWith('http://') || v.startsWith('https://')) return v;
    return `https://www.linkedin.com/in/${v}`;
  };
  const toGithubUrl = (val?: string) => {
    if (!val) return undefined;
    const v = val.trim();
    if (!v || v === 'N/A' || v === 'NA' || v === '-' || v === '#') return undefined;
    if (v.startsWith('http://') || v.startsWith('https://')) return v;
    return `https://github.com/${v}`;
  };
  
  const mappedMembers: MappedMember[] = useMemo(() => 
    members.map((m) => ({
      name: m.name,
      profession: m.gb_position || m.position || '',
      image: m.image_url || undefined,
      githubUrl: toGithubUrl(m.github || undefined),
      linkedinUrl: toUrl(m.linkedin || undefined),
    })),
    [members]
  );

  const topRow = useMemo(() => mappedMembers.slice(0, Math.ceil(mappedMembers.length / 2)), [mappedMembers]);
  const bottomRow = useMemo(() => mappedMembers.slice(Math.ceil(mappedMembers.length / 2)), [mappedMembers]);

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-20">
      {topRow.length > 0 && (
        <div
        >
          <Marquee className="[--duration:40s]">
            {topRow.map((member, i) => (
              <CardsDemo
                key={`row1-${member.name}-${i}`}
                name={member.name}
                profession={member.profession}
                image={member.image}
                githubUrl={member.githubUrl}
                linkedinUrl={member.linkedinUrl}
              />
            ))}
          </Marquee>
        </div>
      )}
      
      {bottomRow.length > 0 && (
        <div
          
        >
          <Marquee reverse className="[--duration:40s]">
            {bottomRow.map((member, i) => (
              <CardsDemo
                key={`row2-${member.name}-${i}`}
                name={member.name}
                profession={member.profession}
                image={member.image}
                githubUrl={member.githubUrl}
                linkedinUrl={member.linkedinUrl}
              />
            ))}
          </Marquee>
        </div>
      )}
    </div>
  );
}

const MarqueeScroll = React.memo(MarqueeScrollComponent);

MarqueeScroll.displayName = 'MarqueeScroll';

export { MarqueeScroll };
