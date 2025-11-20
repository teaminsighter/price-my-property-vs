"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import LegislationSection from "@/components/LegislationSection";
import SalesValueSection from "@/components/SalesValueSection";
import RefinancingSection from "@/components/RefinancingSection";
import SellForMoreSection from "@/components/SellForMoreSection";
import InterviewAgentSection from "@/components/InterviewAgentSection";
import ArticlesSection from "@/components/ArticlesSection";
import AboutSection from "@/components/AboutSection";
import ScrollingText from "@/components/ScrollingText";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <HowItWorks />
      <LegislationSection />
      <SalesValueSection />
      <RefinancingSection />
      <SellForMoreSection />
      <InterviewAgentSection />
      <ArticlesSection />
      <AboutSection />
      <ScrollingText />
      <Footer />
    </main>
  );
}
