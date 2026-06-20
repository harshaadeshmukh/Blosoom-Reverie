import Hero from '../components/Hero';
import MarqueeStrip from '../components/MarqueeStrip';
import About from '../components/About';
import Collections from '../components/Collections';
import Process from '../components/Process';
import Occasions from '../components/Occasions';
import Testimonials from '../components/Testimonials';
import CtaBand from '../components/CtaBand';

export default function Home() {
  return (
    <main>
      <Hero />
      <MarqueeStrip />
      <About />
      <Collections />
      <Process />
      <Occasions />
      <Testimonials />
      <CtaBand />
    </main>
  );
}
