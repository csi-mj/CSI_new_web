"use client";

import React from "react";
import CardDemo from "@/components/cards-demo-1";

type CardItem = {
  image?: string;
  name?: string;
  profession?: string;
  hoverGif?: string;
  gradient?: string;
  borderColor?: string;
  url?: string;
  githubUrl?: string;
  linkedinUrl?: string;
};

type GBProps = {
  items?: CardItem[];
  className?: string;
};

const demoItems: CardItem[] = Array.from({ length: 18 }).map((_, i) => ({
  name: `Member ${i + 1}`,
  profession: i % 2 ? "ASSOCIATE" : "TECH HEAD",
  image:
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop",
  hoverGif:
    "https://media1.tenor.com/m/7HYOnFr3-aIAAAAd/sad-sad-monkey.gif",
  gradient: "linear-gradient(135deg, rgba(20,20,20,0.9), rgba(30,30,30,0.9))",
  borderColor: "transparent",
  githubUrl: "https://github.com/",
  linkedinUrl: "https://www.linkedin.com/",
}));

const GB: React.FC<GBProps> = ({ items = demoItems, className }) => {
  const computeRows = (arr: CardItem[]) => {
    const n = arr.length;
    if (n === 0) return [] as CardItem[][];
    if (n === 4) return [arr.slice(0, 2), arr.slice(2, 4)];

    const rows: CardItem[][] = [];
    const rem = n % 3;

    if (rem === 1 && n >= 4) {
      // Use 3s then a final 2+2 for a balanced last two rows
      let idx = 0;
      const threes = Math.floor((n - 4) / 3);
      for (let k = 0; k < threes; k++) {
        rows.push(arr.slice(idx, idx + 3));
        idx += 3;
      }
      rows.push(arr.slice(idx, idx + 2));
      idx += 2;
      rows.push(arr.slice(idx, idx + 2));
      return rows;
    }

    // Default: fill with 3s, and if last is 2, keep it as 2
    let i = 0;
    while (i < n) {
      const remaining = n - i;
      const take = remaining === 2 ? 2 : Math.min(3, remaining);
      rows.push(arr.slice(i, i + take));
      i += take;
    }
    return rows;
  };

  const rows = computeRows(items);

  return (
    <div className={"container mx-auto px-4 sm:px-6 lg:px-4 xl:px-28 py-6 " + (className || "") }>
      <div className="flex flex-col gap-6 md:gap-16">
        {rows.map((row, rIdx) => {
          const len = row.length;
          const colsClass = len === 3
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : len === 2
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
              : "grid-cols-1";
          return (
            <div
              key={`row-${rIdx}`}
              className={`grid ${colsClass} gap-6 md:gap-y-8 place-items-center justify-center`}
            >
              {row.map((item, idx) => (
                <CardDemo key={`${item.name ?? "card"}-${rIdx}-${idx}`} {...item} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GB;