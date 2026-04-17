import { useSectionReveal } from "../hooks/useSectionReveal";
import { ApplyForm } from "../components/ApplyForm";

export function ApplySection({ onBackToTop, forceVisible = false }) {
  const { ref, visible } = useSectionReveal();
  const isVisible = forceVisible || visible;

  return (
    <section ref={ref} className={`section shell reveal-block ${isVisible ? "is-visible" : ""}`} id="apply">
      <div className="apply-wrap">
        <div className="apply-glow" aria-hidden="true" />

        <div className="apply-panel">
          <div className="apply-panel__left">
            <span className="section-title__eyebrow">Apply</span>
            <h2>带着想法来，<br />或者带着问题来。</h2>
            <p>
              如果你会写代码、做交互、做视觉、做硬件，或者只是对一个方向有强烈判断，
              都可以报名。我们更看重你想做什么，以及你准备怎样把它做出来。
            </p>
            <ul className="apply-checklist">
              <li><span>✓</span> 独立参赛或 2–4 人组队</li>
              <li><span>✓</span> 作品须在活动期间完成</li>
              <li><span>✓</span> 开源优先，但不强制</li>
            </ul>
          </div>
          <div className="apply-panel__right">
            <div className="apply-cta-card">
              <p className="apply-cta-card__label">截止报名</p>
              <p className="apply-cta-card__date">04.25</p>
              <p className="apply-cta-card__seats">仅剩 <strong>20+</strong> 席位</p>
              <ApplyForm />
              <div style={{ marginTop: '16px' }}>
                <a
                  className="button button--ghost"
                  href="#top"
                  onClick={(event) => {
                    event.preventDefault();
                    onBackToTop();
                  }}
                >
                  ← 回到顶部
                </a>
              </div>
            </div>
          </div>
        </div>

        <footer className="site-footer">
          <span>© 2026 Nodus Laboratory · WBU AI Hackathon</span>
          <span>武汉 · 05.01 — 05.15</span>
        </footer>
      </div>
    </section>
  );
}
