"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";       
import Recruitments from "./recruitform";
import RecruitmentHero from "./recruitmentHero";
import RecruitmentPositions from "./recruitmentPositions";
import PortfolioCarousel from "./portfolioCarousel";
import GlowBackground from "@/components/shared/GlowBackground";

export default function RecruitmentsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-screen bg-black">
      {/* Background: faint blurred glows in opposite corners */}
      <GlowBackground />
      <RecruitmentHero />
      <RecruitmentPositions />
      <PortfolioCarousel />
      <Recruitments />
    </main>
  );
}