type SiteHeaderProps = {
  topic?: string;
};

export default function SiteHeader({ topic }: SiteHeaderProps) {
  return (
    <header className="top-bar">
      <a className="top-bar__brand" href="/">
        <img className="top-bar__logo" src="/design/linezero-logo.svg" alt="LineZero Studio" />
        <span className="top-bar__label">Thinking Hats</span>
      </a>

      {topic && (
        <div className="top-bar__topic">
          <strong>Deciding:</strong> {topic}
        </div>
      )}
    </header>
  );
}
