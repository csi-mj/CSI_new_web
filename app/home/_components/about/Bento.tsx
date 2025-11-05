'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { BentoGrid, BentoGridItem } from '../../../../components/ui/bento-grid';

export function Bento() {
  return (
    <motion.section
      initial={{ opacity: 1, y: -40, scale: 1 }}
      whileInView={{ opacity: 1, y: 50, scale: .9 }}
      viewport={{ amount: 0.2 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="bent-wrapper flex h-max w-screen items-center justify-center bg-black mt-16"
      style={{ contain: 'layout paint' }}
    >
      <BentoGrid className="relative mx-auto mb-7 max-w-4xl will-change-transform transform-gpu">
        {items.map((item, idx) => (
          <BentoGridItem
            key={idx}
            title={item.title}
            description={item.description}
            header={item.header}
            imageSrc={item.imageSrc}
            className={` ${idx === 2 || idx === 5 || idx === 1 ? 'md:col-span-2' : ''}`}
          />
        ))}
      </BentoGrid>
    </motion.section>
  );
}

const Skeleton = () => (
  <div className="flex size-full min-h-28 flex-1 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"></div>
);

const items = [
  {
    title: "Explore Our Events",
    description:
      "At CSI, our events bring together thinkers, creators, and problem-solvers to explore technology, exchange ideas, and build meaningful connections. Dive into hands-on learning, competitive experiences, and opportunities that shape your tech journey. Together, we create platforms that turn potential into purpose and passion into progress.",
    header: <Skeleton />,
    imageSrc:
      "/about/events.jpg",
  },
  {
    title: "Team Hack Revolution 2024-25",
    description:
      "The driving force behind MJCET’s flagship hackathon — Hack Revolution, organized in collaboration with E-Cell MJCET. A celebration of innovation, technology, and collaboration, the team brings together creative minds to build impactful solutions. With passion and precision, they continue to make Hack Revolution a benchmark for student-led innovation and excellence.",
    header: <Skeleton />,
    imageSrc:
      "/about/hackrev.jpg",
  },
  {
    title: "Meet the Team",
    description:
      "A team driven by purpose. A community built on passion. The strength of CSI lies in the dedication of its Core Team and ExCom, who work tirelessly behind the scenes to plan, coordinate, and execute initiatives with purpose and precision. United by a mission to empower students, they foster innovation, create opportunities, and build a culture where leadership and creativity thrive — turning vision into impact and ambition into achievement.",
    header: <Skeleton />,
    imageSrc:
      "/about/team.jpg",
  },
  {
    title: "Our Faculty Coordinator",
    description:
      "Mr. Zainuddin Naveed, founder of the CSI MJCET Student Chapter, has been a driving force behind its growth since 2014. As an Assistant Professor in the CSE Department, he brings deep expertise and passion for technology education. With his guidance and mentorship, CSI MJCET continues to thrive as a platform for innovation, collaboration, and skill development.",
    header: <Skeleton />,
    imageSrc:
      "/about/zainsir.jpg",
  },
    {
    title: "Our Chief Coordinators",
    description:
      "Muhammed Affan Asif, Touseef Banu, and Abdullah Shareef embody leadership, teamwork, and innovation within CSI MJCET.",
    header: <Skeleton />,
    imageSrc:
      "/about/cc.jpg",
  },
  {
    title: "Our Governing Body",
    description:
      "Steering CSI like a future tech powerhouse. Our Governing Body leads with vision, empowers with trust, and champions innovation at every step. From guiding initiatives to nurturing student leadership, they ensure CSI remains dynamic, impactful, and full of growth opportunities. Their dedication shapes a culture of learning, collaboration, and ambition — they lead, inspire, and elevate CSI.",
    header: <Skeleton />,
    imageSrc:
      "/about/gbs.png",
  },

];
