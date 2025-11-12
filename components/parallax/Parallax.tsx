import s from './Parallax.module.css';

export default function Parallax() {
  return (
    <section id="parallax" className={s.parallax} aria-label="Family Support Parallax">
      <div className={`container ${s.wrap}`}>
        <div className={s.panel}>
          <div className={s.eyebrow}>Support</div>
          <h2 className={s.h2}>We build a stable life while you drive</h2>
          <p>
            Accommodation, meals, and safe vehicles — all in one plan. Our driver-first programs help you focus on earning while we support your family’s comfort.
          </p>
          <a className={`${s.btn} mt-5`} href="#apply">
            Contact us <i className="fa-solid fa-arrow-right " />
          </a>
        </div>
        <div aria-hidden="true" />
      </div>
    </section>
  );
}
