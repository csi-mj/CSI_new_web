import Recruitments from "./recruitform";
import RecruitmentHero from "./recruitmentHero";
import RecruitmentPositions from "./recruitmentPositions";
import PortfolioCarousel from "./portfolioCarousel";

export default function RecruitmentsPage() {
  return (
    <main className="min-h-screen bg-black">
      <RecruitmentHero />
      <RecruitmentPositions/>
      <PortfolioCarousel />
      <Recruitments />
    </main>
  );
}