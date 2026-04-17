import { SectionTitle } from "../components/SectionTitle";
import { useSectionReveal } from "../hooks/useSectionReveal";

const tracks = [
  {
    id: "01",
    title: "Agent In The Room",
    badge: "AI · Workflow",
    text: "把 Agent 从浏览器里拉出来，真正进入老师、学生和现场工作流。"
  },
  {
    id: "02",
    title: "Space That Responds",
    badge: "IoT · Hardware",
    text: "让门、屏幕、装置和空间感知人，并做出有意义的反馈。"
  },
  {
    id: "03",
    title: "AI × Music / Media",
    badge: "Creative · Generative",
    text: "围绕声音、音乐、影像和实时生成做出能被感受到的作品。"
  },
  {
    id: "04",
    title: "Open Proposal",
    badge: "Free Track",
    text: "如果你有更锋利的想法，可以直接带题来，只要它足够清晰。"
  }
];

export function TracksSection({ forceVisible = false }) {
  const { ref, visible } = useSectionReveal();
  const isVisible = forceVisible || visible;

  return (
    <section ref={ref} className={`section shell reveal-block ${isVisible ? "is-visible" : ""}`} id="tracks">
      <SectionTitle
        eyebrow="Tracks"
        title="四个起点，不是四个边界。"
        copy="你可以从这里出发，也可以带着自己的方向来。重点不是跟题，而是把一个判断做成可以被体验的东西。"
      />
      <div className="tracks-grid">
        {tracks.map((track) => (
          <article className="track-card" key={track.id}>
            <div className="track-card__header">
              <span className="track-card__num">{track.id}</span>
              <span className="track-card__badge">{track.badge}</span>
            </div>
            <h3>{track.title}</h3>
            <p>{track.text}</p>
            <div className="track-card__arrow">→</div>
          </article>
        ))}
      </div>
    </section>
  );
}
