import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  Hero,
  ProblemSolution,
  WhoItsFor,
  HowItWorks,
  WhyAudexa,
  SecuritySection,
  PilotPricing,
  DemoSection,
  WaitlistSection,
} from '@/components/landing';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ProblemSolution />
      <WhoItsFor />
      <HowItWorks />
      <WhyAudexa />
      <SecuritySection />
      <PilotPricing />
      <DemoSection />
      <WaitlistSection />
      <Footer />
    </main>
  );
}

