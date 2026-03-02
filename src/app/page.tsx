import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import DimensionShowcase from '@/components/landing/DimensionShowcase';
import ArchetypeTeaser from '@/components/landing/ArchetypeTeaser';
import Testimonials from '@/components/landing/Testimonials';
import PricingCards from '@/components/landing/PricingCards';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <HowItWorks />
      <DimensionShowcase />
      <ArchetypeTeaser />
      <Testimonials />
      <PricingCards />
      <FAQ />
      <Footer />
    </main>
  );
}
