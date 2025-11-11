import { numbers } from '@/lib/data/numbers';
import Image from 'next/image';
import s from './Numbers.module.css';

export default function Numbers() {
  return (
    <section id="numbers" className={s.section} aria-label="Autono in Numbers">
      <div className={`container ${s.grid}`}>
        <figure className={s.fig}>
          <Image
            src={numbers.image}
            alt="Mechanical arm render"
            width={720}
            height={480}
            // allow the browser to decide when to load this image
            priority={false}
          />
        </figure>

        <div className={s.copy}>
          <h3 className={s.title}>Autono In Numbers</h3>

          <div className={s.metrics}>
            <div className={s.metric}>
              <div className={s.value}>{numbers.drivers}</div>
              <div className={s.rule}></div>
              <div className={s.label}>Drivers</div>
            </div>

            <div className={s.metric}>
              <div className={s.value}>{numbers.coreTeams}</div>
              <div className={s.rule}></div>
              <div className={s.label}>Core Teams</div>
            </div>

            <div className={s.metric}>
              <div className={s.value}>{numbers.earnings}</div>
              <div className={s.rule}></div>
              <div className={s.label}>Drivers Earnings</div>
            </div>

            <div className={`${s.metric} ${s.textBlock}`}>
              <div className={s.value}>
                {numbers.locations.join(', ').replace(/, /g, ',\n')}
              </div>
              <div className={s.rule}></div>
              <div className={s.label}>{numbers.locationsTitle}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
