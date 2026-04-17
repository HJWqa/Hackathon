import { SectionTitle } from "../components/SectionTitle";
import { useSectionReveal } from "../hooks/useSectionReveal";

const principles = [
  {
    id: "01",
    title: "Prototype First",
    text: "先做一个能被体验的核心瞬间，而不是先列满一页待办。",
    icon: "◈"
  },
  {
    id: "02",
    title: "Collaborate Fast",
    text: "设计、前端、AI、硬件都可以同队，节奏要像排练而不是排队。",
    icon: "⬡"
  },
  {
    id: "03",
    title: "Show The Story",
    text: "最终不是只交代码仓库，还要让人看懂为什么这个东西值得存在。",
    icon: "◎"
  }
];

export function ManifestSection({ forceVisible = false }) {
  const { ref, visible } = useSectionReveal();
  const isVisible = forceVisible || visible;

  return (
    <section ref={ref} className={`section shell reveal-block ${isVisible ? "is-visible" : ""}`} id="manifest">
      <SectionTitle
        eyebrow="Manifest"
        title="不是拼功能堆砌，而是做一个会发光的想法。"
        copy="我们希望作品既能跑，也能被记住。技术只是其中一层，叙事、交互、现场表达同样重要。"
      />
      <div className="manifest-grid">
        {principles.map((p) => (
          <article className="manifest-card" key={p.id}>
            <div className="manifest-card__top">
              <span className="manifest-card__icon">{p.icon}</span>
              <span className="manifest-card__num">{p.id}</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
