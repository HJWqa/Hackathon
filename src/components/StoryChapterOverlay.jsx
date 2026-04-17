import { ApplyForm } from "./ApplyForm";

const manifestItems = [
  ["01", "Prototype First", "让人看到一个像样的瞬间。"],
  ["02", "Collaborate Fast", "设计、前端、AI、硬件，自然地接在一起。"],
  ["03", "Show The Story", "交出来的不只是代码，还要有让人记住的「理由」。"]
];

const trackItems = [
  ["01", "Agent In The Room", "让 Agent 真正进入老师、学生和现场。"],
  ["02", "Space That Responds", "门、屏幕、装置、空间，都是「感觉」的延伸。"],
  ["03", "AI × Music / Media", "做出能被听见、看见、感受到的东西。"],
  ["04", "Open Proposal", "如果你有更锋利的想法，直接带题来。"]
];

const timelineItems = [
  ["05.08", "报名开放"],
  ["05.26", "线上说明会"],
  ["06.14", "入选公布"],
  ["05.01 — 05.15", "正式活动"]
];

function ManifestChapter() {
  return (
    <>
      <p className="chapter-overlay__copy">
        技术只是其中一层。叙事、交互、现场表达。
      </p>
      <div className="chapter-stack">
        {manifestItems.map(([id, title, text]) => (
          <article className="chapter-strip" key={id}>
            <span className="chapter-strip__index">{id}</span>
            <div className="chapter-strip__body">
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function TracksChapter() {
  return (
    <>
      <p className="chapter-overlay__copy">
        你可以从这里出发，也可以带着自己的方向来。
      </p>
      <div className="chapter-dual-lane">
        {trackItems.map(([id, title, text]) => (
          <article className="chapter-track" key={id}>
            <span className="chapter-track__id">{id}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </>
  );
}

function ScheduleChapter() {
  return (
    <>
      <div className="chapter-timeline">
        {timelineItems.map(([date, title]) => (
          <article className="chapter-timeline__item" key={date}>
            <span>{date}</span>
            <h3>{title}</h3>
          </article>
        ))}
      </div>
    </>
  );
}

function ApplyChapter({ onGoToChapter }) {
  return (
    <>
      <p className="chapter-overlay__copy">
        代码、交互、视觉、硬件，我们需要的是同样一群不安分的灵魂。
      </p>
      <ApplyForm />
      <div className="chapter-actionband">
        <button className="button button--ghost" type="button" onClick={() => onGoToChapter(0)}>返回起点</button>
      </div>
      <div className="chapter-kicker">
        <span>截止 04.25</span>
        <span>武汉商学院 · 05.01 — 05.15</span>
      </div>
    </>
  );
}

function getModifier(index) {
  if (index === 1) return "is-left";
  if (index === 2) return "is-center";
  return "is-right";
}

function getChapterStyle(index, progress) {
  const distance = index - progress;
  const abs = Math.abs(distance);
  const opacity = Math.max(0, 1 - abs * 1.2);
  const x = distance * 132;
  const z = -abs * 80;
  const scale = 1 - abs * 0.06;
  const blur = abs * 10;
  const pointerEvents = abs < 0.58 ? "auto" : "none";
  const light = Math.max(0, 1 - abs * 1.55);

  return {
    "--chapter-light": light.toFixed(4),
    opacity,
    transform: `translate3d(${x}px, 0, ${z}px) scale(${scale})`,
    filter: `blur(${blur}px)`,
    pointerEvents
  };
}

export function StoryChapterOverlay({ progress, onGoToChapter, isApplyFocused }) {
  if (progress < 0.18) return null;

  const chapters = [
    { index: 1, modifier: getModifier(1), content: <ManifestChapter /> },
    { index: 2, modifier: getModifier(2), content: <TracksChapter /> },
    { index: 3, modifier: getModifier(3), content: <ScheduleChapter /> },
    { index: 4, modifier: getModifier(4), content: <ApplyChapter onGoToChapter={onGoToChapter} /> }
  ];

  return (
    <div className="chapter-overlay-stack">
      {chapters.map((chapter) => (
        <div
          key={chapter.index}
          className={`chapter-overlay ${chapter.modifier} ${Math.abs(chapter.index - progress) < 0.58 ? "is-live" : ""} ${isApplyFocused && chapter.index === 4 ? "is-apply-focus" : ""}`}
          style={getChapterStyle(chapter.index, progress)}
        >
          <div className="chapter-overlay__rail" aria-hidden="true" />
          <div className="chapter-overlay__panel">
            <div className="chapter-overlay__panel-glow" aria-hidden="true" />
            <div className="chapter-overlay__panel-line" aria-hidden="true" />
            <div className="chapter-overlay__content">
              {chapter.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
