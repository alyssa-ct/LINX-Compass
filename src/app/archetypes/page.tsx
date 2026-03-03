import type { Metadata } from 'next';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import ArchetypeHero from '@/components/archetypes/ArchetypeHero';
import ArchetypeGrid from '@/components/archetypes/ArchetypeGrid';
import ArchetypeCTA from '@/components/archetypes/ArchetypeCTA';

export const metadata: Metadata = {
  title: 'Behavioral Archetypes — LINX Compass',
  description:
    'Explore 10 behavioral archetypes that capture how people think, act, and lead. Discover your archetype with the LINX Compass assessment.',
};

export default function ArchetypesPage() {
  return (
    <main>
      <Header />
      <ArchetypeHero />
      <ArchetypeGrid />
      <ArchetypeCTA />
      <Footer />
    </main>
  );
}
