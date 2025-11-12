import s from './Hero.module.css';
import ExplorePremiumSection from './ExplorePremiumSection';
export default function Hero(){
  return (
    <section id="hero" className={s.hero} aria-label="ENCHO Hero">
      <div className=" h-full releative  container">
      <div className='absolute bottom-1/2 left-0 right-0'>
 <div className={s.eyebrow}>Taxi Rental • Accommodation • Food • Vehicles</div>
        <h1 className={s.h1}>THE FUTURE OF <span className={s.accent}>DRIVING</span> IS HERE</h1>
        <p className={s.lead}>Discover a safer, higher-earning taxi rental experience with ENCHO.</p>
       
       
 
      </div>

        
         <div className='absolute bottom-0 left-0 right-0 mb-10'>
          <ExplorePremiumSection label="Our Drivers Earnings" href="/performance" showSecondary={false} />
        </div>
       


      </div>
    </section>
  );
}
