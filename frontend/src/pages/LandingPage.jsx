import { MotionConfig } from "motion/react";
import LandingHeader from "../features/landing/components/LandingHeader";
import LandingHero from "../features/landing/components/LandingHero";
import LandingFeatures from "../features/landing/components/LandingFeatures";
import LandingWorkflow from "../features/landing/components/LandingWorkflow";
import LandingCTA from "../features/landing/components/LandingCTA";
import LandingFooter from "../features/landing/components/LandingFooter";
import LandingTrust from "../features/landing/components/LandingTrust";
import LandingDemo from "../features/landing/components/LandingDemo";
import LandingBookingDemo from "../features/landing/components/LandingBookingDemo";
import LandingFAQ from "../features/landing/components/LandingFAQ";
export default function LandingPage() {
  return (
    <MotionConfig reducedMotion="user"><div className="landing-page min-h-screen bg-white">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingTrust />
        <LandingFeatures />
        <LandingWorkflow />
        <LandingDemo />
        <LandingBookingDemo />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div></MotionConfig>
  );
}
