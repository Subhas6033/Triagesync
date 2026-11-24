import LandingHeader from "../features/landing/components/LandingHeader";
import LandingHero from "../features/landing/components/LandingHero";
import LandingFeatures from "../features/landing/components/LandingFeatures";
import LandingWorkflow from "../features/landing/components/LandingWorkflow";
import LandingCTA from "../features/landing/components/LandingCTA";
import LandingFooter from "../features/landing/components/LandingFooter";
export default function LandingPage() {
  return (
    <div className="landing-page min-h-screen bg-white">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingWorkflow />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
