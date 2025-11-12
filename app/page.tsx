
import Hero from '@/components/hero/Hero';
import Vision from '@/components/vision/Vision';
import Services from '@/components/services/Services';
import Rental from '@/components/rental/Rental';
import Salary from '@/components/salary/Salary';
import Parallax from '@/components/parallax/Parallax';
import Numbers from '@/components/numbers/Numbers';
import Testimonials from '@/components/testimonials/Testimonials';
import Footer from '@/components/footer/Footer';

export default function HomePage() {
  return (
    <>
  
      <Hero />
      <Vision />
      <Services />
      <Rental />
       {/* <Collapsible /> */}
      <Salary />
      <Parallax />
      <Numbers />
      <Testimonials />
      <Footer />
    </>
  );
}
