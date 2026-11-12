import { Fragment } from 'react';

function renderInline(text) {
  if (!text) return null;
  const parts = text.split(/(\[size=\d{1,2}px\][\s\S]*?\[\/size\]|\*\*[^*\n]+?\*\*|\*[^*\n]+?\*)/g);
  return parts.map((part, idx) => {
    const sizeMatch = part.match(/^\[size=(\d{1,2}px)\]([\s\S]*)\[\/size\]$/);
    if (sizeMatch) {
      return (
        <span key={idx} style={{ fontSize: sizeMatch[1] }} className="leading-snug">
          {renderInline(sizeMatch[2])}
        </span>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-ink">
          {renderInline(part.slice(2, -2))}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} className="italic">
          {renderInline(part.slice(1, -1))}
        </em>
      );
    }
    return <Fragment key={idx}>{part}</Fragment>;
  });
}

export default function RichText({ text, className = '' }) {
  if (!text || typeof text !== 'string') return null;

  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let listItems = [];
  let paraLines = [];

  const flushPara = () => {
    if (paraLines.length) {
      blocks.push({ type: 'p', lines: paraLines });
      paraLines = [];
    }
  };

  const flushList = () => {
    if (listItems.length) {
      blocks.push({ type: 'ul', items: listItems });
      listItems = [];
    }
  };

  let emptyRun = 0;

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      flushList();
      emptyRun++;
      if (emptyRun > 1) blocks.push({ type: 'spacer' });
      continue;
    }
    emptyRun = 0;
    if (/^###\s+/.test(line)) {
      flushPara();
      flushList();
      blocks.push({ type: 'h3', text: line.replace(/^###\s+/, '') });
    } else if (/^#{1,2}\s+/.test(line)) {
      flushPara();
      flushList();
      blocks.push({ type: 'h2', text: line.replace(/^#{1,2}\s+/, '') });
    } else if (/^[-*]\s+/.test(line.trimStart())) {
      flushPara();
      listItems.push(line.trimStart().replace(/^[-*]\s+/, ''));
    } else {
      flushList();
      paraLines.push(line);
    }
  }
  flushPara();
  flushList();

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((b, i) => {
        if (b.type === 'spacer') {
          return <div key={i} className="h-2" aria-hidden="true" />;
        }
        if (b.type === 'h2') {
          return (
            <h2 key={i} className="text-xl font-bold text-ink tracking-tight pt-2 first:pt-0">
              {renderInline(b.text)}
            </h2>
          );
        }
        if (b.type === 'h3') {
          return (
            <h3 key={i} className="text-base font-bold text-ink pt-2 first:pt-0">
              {renderInline(b.text)}
            </h3>
          );
        }
        if (b.type === 'ul') {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1.5 leading-relaxed">
              {b.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="leading-relaxed">
            {b.lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {renderInline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
