"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";       
import Recruitments from "./recruitform";
import RecruitmentHero from "./recruitmentHero";
import RecruitmentPositions from "./recruitmentPositions";
import PortfolioCarousel from "./portfolioCarousel";

export default function RecruitmentsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <RecruitmentHero />
      <RecruitmentPositions />
      <PortfolioCarousel />
      <Recruitments />
    </main>
  );
}