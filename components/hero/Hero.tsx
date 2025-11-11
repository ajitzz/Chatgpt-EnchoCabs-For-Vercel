import s from './Hero.module.css';

export default function Hero(){
  return (
    <section id="hero" className={s.hero} aria-label="ENCHO Hero">
      <div className="container">
        <div className={s.eyebrow}>Taxi Rental • Accommodation • Food • Vehicles</div>
        <h1 className={s.h1}>THE FUTURE OF <span className={s.accent}>DRIVING</span> IS HERE</h1>
        <p className={s.lead}>Discover a safer, higher-earning taxi rental experience with ENCHO.</p>
      </div>
    </section>
  );
}
