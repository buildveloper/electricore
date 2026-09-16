import { Hero } from '@/components/sections/Hero';
import { TrustBar } from '@/components/sections/TrustBar';
import { Services } from '@/components/sections/Services';
import { Work } from '@/components/sections/Work';
import { WhyUs } from '@/components/sections/WhyUs';
import { Process } from '@/components/sections/Process';
import { QuoteForm } from '@/components/sections/QuoteForm';
import { Testimonials } from '@/components/sections/Testimonials';
import { structuredData } from '@/lib/structured-data';

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />
      <Hero />
      <TrustBar />
      <Services />
      <Work />
      <WhyUs />
      <Process />
      <QuoteForm />
      <Testimonials />
    </>
  );
}
