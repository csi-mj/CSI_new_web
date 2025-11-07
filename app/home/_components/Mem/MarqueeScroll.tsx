'use client'
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Marquee } from "@/components/ui/marquee"
import CardsDemo from "@/components/cards-demo-1"
import gbData from "@/app/team/_data/gb.json";

type GbItem = {
  id: number;
  Name: string;
  Position: string;
  Portfolio: string;
  "Linkedin Id"?: string;
  "Email Id"?: string;
  "Github Id"?: string;
  "Formal Picture"?: string;
  "Governing Body Position": string;
};

type MappedMember = {
  name: string;
  profession: string;
  image?: string;
  githubUrl?: string;
  linkedinUrl?: string;
};

function MarqueeScrollComponent() {
  const members = gbData as GbItem[];
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
  const topRow: MappedMember[] = useMemo(() =>
    members
      .filter((m) => m.id >= 1 && m.id <= 9)
      .map((m) => ({
        name: m.Name,
        profession: m["Governing Body Position"] || m.Position,
        image: m["Formal Picture"] || undefined,
        githubUrl: toGithubUrl(m["Github Id"] || undefined),
        linkedinUrl: toUrl(m["Linkedin Id"] || undefined),
      })),
    [members]
  );

  const bottomRow: MappedMember[] = useMemo(() =>
    members
      .filter((m) => m.id > 9)
      .map((m) => ({
        name: m.Name,
        profession: m["Governing Body Position"] || m.Position,
        image: m["Formal Picture"] || undefined,
        githubUrl: toGithubUrl(m["Github Id"] || undefined),
        linkedinUrl: toUrl(m["Linkedin Id"] || undefined),
      })),
    [members]
  );

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-20">
      <motion.div
        initial={{ opacity: 1, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
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
      </motion.div>
      <motion.div
        initial={{ opacity: 1, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.12 }}
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
      </motion.div>
    </div>
  );
}

const MarqueeScroll = React.memo(MarqueeScrollComponent);

MarqueeScroll.displayName = 'MarqueeScroll';

export { MarqueeScroll };
