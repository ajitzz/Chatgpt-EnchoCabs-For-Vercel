import s from './Rental.module.css';

export default function Rental() {
  return (
    <section id="rental" className={s.section} aria-label="Rental Plan">
      <div className={`container ${s.grid}`}>
        <div className={s.text}>
          <h2 className={s.h2}>RENTAL PLAN</h2>
          <div className={s.scroll}>
            <p>
              Welcome to Our Vehicle Rental Service! We Provide Reliable Vehicles for Drivers on a Daily Basis, Allowing You to Maximize your Earnings with Platforms like Uber and Ola. Plus, enjoy the added Benefit of a Free Furnished Room to Make your Experience Even Better.
            </p>
          </div>
          <a className={`${s.btn} ${s.btnLight}`} href="#apply">
            Read More <i className="fa-solid fa-arrow-right" />
          </a>
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
    </section>
  );
}
