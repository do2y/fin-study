function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function HighlightedText({ content, terms, onTermClick }) {
  if (!terms || terms.length === 0) {
    return <div className="whitespace-pre-line">{content}</div>;
  }

  const pattern = new RegExp(`(${terms.map(escapeRegex).join("|")})`, "g");
  const parts = content.split(pattern);

  return (
    <div className="whitespace-pre-line leading-8">
      {parts.map((part, i) =>
        terms.includes(part) ? (
          <span
            key={i}
            className="term-highlight"
            onClick={() => onTermClick(part)}
            title={`'${part}' 뜻 보기`}
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </div>
  );
}
