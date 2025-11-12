import s from './Rental.module.css';
import Collapsible from '@/components/Collapsible/Collapsible';
import PremiumWhatYouGetCard from '@/components/PremiumWhatYouGetCard/PremiumWhatYouGetCard';
export default function Rental() {
  return (
    <section id="rental" className={`${s.section} grid grid-cols-1  gap-8`} aria-label="Rental Plan">
      <div className={`container ${s.grid}`}>
        <div className={s.text}>
         
          
            <div className="grid grid-cols-1 gap-8  md:items-start">
        {/* Left column: collapsible copy shows 7-sentence preview; action at bottom */}
        <div className="md:col-span-7">
          <h2 className={s.h2}>RENTAL PLAN</h2>
          <Collapsible/>
        </div>


      
      </div>
        </div>

        <div className={s.frame}>
          <iframe
            src="https://www.youtube.com/embed/jdiy6sz1-fk?rel=0&modestbranding=1"
            title="Rental Plan Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
        <div className={`container ${s.grid} `}>
         <PremiumWhatYouGetCard  />

        </div>
    </section>
  );
}
