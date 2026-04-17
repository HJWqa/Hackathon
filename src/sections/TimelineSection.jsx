import { SectionTitle } from "../components/SectionTitle";
import { useSectionReveal } from "../hooks/useSectionReveal";

const timeline = [
  {
    title: "报名开放",
    date: "05.08",
    text: "组队、提交基础信息与方向描述。"
  },
  {
    title: "线上说明会",
    date: "05.26",
    text: "讲清赛制、资源包和评审维度。"
  },
  {
    title: "入选公布",
    date: "06.14",
    text: "确认现场席位与导师对接。"
  },
  {
    title: "正式活动",
    date: "05.01 — 05.15",
    text: "持续推进、review、迭代与最终展示。"
  }
];

export function TimelineSection({ forceVisible = false }) {
  const { ref, visible } = useSectionReveal();
  const isVisible = forceVisible || visible;

  return (
    <section ref={ref} className={`section shell reveal-block ${isVisible ? "is-visible" : ""}`} id="schedule">
      <SectionTitle
        eyebrow="Schedule"
        title="节奏要快，但每一步都清楚。"
      />
      <div className="timeline">
        {timeline.map(({ title, date, text }, i) => (
          <article key={title} className="timeline__item" style={{ "--delay": `${i * 80}ms` }}>
            <div className="timeline__step">
              <div className="timeline__step-dot" />
              {i < timeline.length - 1 && <div className="timeline__step-line" />}
            </div>
            <div className="timeline__date-col">
              <span className="timeline__date">{date}</span>
            </div>
            <div className="timeline__body">
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
