"use client";

import { motion } from "framer-motion";

type Tab = "upcoming" | "ongoing" | "past";

interface EventsTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string }[] = [
  { id: "past", label: "Past" },
  { id: "ongoing", label: "Ongoing" },
  { id: "upcoming", label: "Upcoming" }
  ,
];

export default function EventsTabs({ activeTab, onTabChange }: EventsTabsProps) {
  return (
    <div className="flex justify-center">
      <div className="relative inline-flex items-center gap-2 p-1.5 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer cursor-target ${
                isActive
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-300"
              }`}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-red-500 rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

