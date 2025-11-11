import s from './Vision.module.css';
import Image from 'next/image';
export default function Vision(){
  return (
    <section id="vision" className={s.vision} aria-label="Vision">
      <div className={`container ${s.wrap}`}>
        <div className={s.text}>
          <div className={s.eyebrow}>Vision</div>
          <h2 className={s.h2}>We’re Changing the Way the World Thinks About <span className={s.accent}>DRIVING</span></h2>
          <div className={s.scroll}>
            <p>I&apos;m a paragraph. Click here to add your own text and edit me. It&apos;s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font.</p>
            <p>Use this space to describe your driver-first approach: accommodation, healthy meals, safety training, reliable vehicles, and transparent settlements so drivers can earn more with less stress.</p>
          </div>
        </div>
        <div className={s.img}>

          <Image
          className={s.figure}
                    src="https://i.ibb.co/Hp7SG7T2/Chat-GPT-Image-Sep-15-2025-at-03-33-11-AM.png"
                    alt="Car render"
                    width={720}
                    height={480}
                    // allow the browser to decide when to load this image
                    priority={false}
                  />
        </div>
      </div>
    </section>
  );
}
