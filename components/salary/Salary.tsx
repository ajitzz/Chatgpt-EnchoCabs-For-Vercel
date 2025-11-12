import s from './Salary.module.css';
import Collapsible from '@/components/Collapsible/Collapsible';
export default function Salary() {
  return (
    <section id="salary" className={s.section} aria-label="Salary Plan">
      <div className={`container ${s.grid}`}>
        <div className={s.frame}>
          <iframe
            src="https://www.youtube.com/embed/4Bsc2uI_LsM?rel=0&modestbranding=1"
            title="Salary Plan Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <div className={s.text}>
          <h2 className={s.h2}>OUR SUPPORT</h2>
         <Collapsible/>
        </div>
      </div>
    </section>
  );
}
