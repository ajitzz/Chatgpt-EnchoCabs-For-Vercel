import s from './Salary.module.css';

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
          <h2 className={s.h2}>SALARY PLAN</h2>
          <div className={s.scroll}>
            <p>
              I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. I’m a great place for you to tell a story and let your users know a little more about you.
            </p>
          </div>
          <a className={`${s.btn} ${s.btnLight}`} href="#apply">
            Read More <i className="fa-solid fa-arrow-right" />
          </a>
        </div>
      </div>
    </section>
  );
}
