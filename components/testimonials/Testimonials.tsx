import { testimonials } from '@/lib/data/testimonials';
import Card from './TestimonialCard';
import Carousel from './Carousel';
import s from './Testimonials.module.css';

export default function Testimonials(){
  return (
    <section id="testimonials" className={`light ${s.section}`} aria-label="What our Drivers say">
      <div className="container">
        <h3 className={s.title}>What our Drivers say</h3>
        <Carousel>
          {testimonials.concat(testimonials).map(t => <Card key={`${t.id}-${Math.random()}`} t={t} />)}
        </Carousel>
      </div>
    </section>
  );
}
