import s from './Services.module.css';

export default function Services() {
  return (
    <section id="services" className={s.section} aria-label="Services">
      <div className="container">
        <div className={s.head}>
          <div className={s.eyebrow}>Services</div>
          <h3 className={s.title}>
            Environment where Driving feel valued and supported
          </h3>
        </div>
      </div>
    </section>
  );
}
