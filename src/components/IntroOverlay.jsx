export function IntroOverlay({ done, reducedMotion }) {
  return (
    <div
      className={`intro-overlay ${done ? "is-done" : "is-active"} ${reducedMotion ? "is-reduced" : ""}`}
      aria-hidden="true"
    >
      <div className="intro-overlay__beam" />
      <div className="intro-overlay__line" />
      <div className="intro-overlay__label">WBU AI HACKATHON</div>
    </div>
  );
}
