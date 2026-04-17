export function SectionTitle({ eyebrow, title, copy }) {
  return (
    <header className="section-title">
      <span className="section-title__eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </header>
  );
}
