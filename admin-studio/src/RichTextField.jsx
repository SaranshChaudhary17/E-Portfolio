import { useEffect, useRef, useState } from 'react';

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const inlineToHtml = (s) =>
  esc(s)
    .replace(
      /\[size=(\d{1,2}px)\]([\s\S]*?)\[\/size\]/g,
      '<span data-size="$1" style="font-size:$1">$2</span>'
    )
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>');

export function mdToHtml(md = '') {
  if (!md || !md.trim()) return '';
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      out.push('</ul>');
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      closeList();
      continue;
    }
    if (/^###\s+/.test(line)) {
      closeList();
      out.push(`<h3>${inlineToHtml(line.replace(/^###\s+/, ''))}</h3>`);
    } else if (/^#{1,2}\s+/.test(line)) {
      closeList();
      out.push(`<h2>${inlineToHtml(line.replace(/^#{1,2}\s+/, ''))}</h2>`);
    } else if (/^[-*]\s+/.test(line.trimStart())) {
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(`<li>${inlineToHtml(line.trimStart().replace(/^[-*]\s+/, ''))}</li>`);
    } else {
      closeList();
      out.push(`<p>${inlineToHtml(line)}</p>`);
    }
  }
  closeList();
  return out.join('');
}

function serializeNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue.replace(/\u00A0/g, ' ');
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return '';

  const tag = node.tagName;
  if (tag === 'BR') return '\n';

  const inner = Array.from(node.childNodes).map(serializeNode).join('');

  if (tag === 'STRONG' || tag === 'B') {
    const t = inner.trim();
    if (!t) return inner;
    const lead = inner.match(/^\s*/)[0];
    const trail = inner.match(/\s*$/)[0];
    return `${lead}**${t}**${trail}`;
  }
  if (tag === 'EM' || tag === 'I') {
    const t = inner.trim();
    if (!t) return inner;
    const lead = inner.match(/^\s*/)[0];
    const trail = inner.match(/\s*$/)[0];
    return `${lead}*${t}*${trail}`;
  }
  if (tag === 'H1' || tag === 'H2') {
    const t = inner.replace(/\n+/g, ' ').trim();
    return t ? `\n\n## ${t}\n\n` : '';
  }
  if (tag === 'H3' || tag === 'H4') {
    const t = inner.replace(/\n+/g, ' ').trim();
    return t ? `\n\n### ${t}\n\n` : '';
  }
  if (tag === 'UL' || tag === 'OL') {
    const items = Array.from(node.children)
      .filter((c) => c.tagName === 'LI')
      .map((li) => `- ${Array.from(li.childNodes).map(serializeNode).join('').replace(/\n+/g, ' ').trim()}`)
      .filter((l) => l !== '-');
    return items.length ? `\n\n${items.join('\n')}\n\n` : '';
  }
  if (tag === 'LI') {
    const t = inner.replace(/\n+/g, ' ').trim();
    return t ? `- ${t}\n` : '';
  }
  if (tag === 'SPAN' || tag === 'FONT') {
    const sz = node.getAttribute?.('data-size') || node.style?.fontSize;
    if (sz && /^\d{1,2}px$/.test(sz) && inner.trim()) {
      return `[size=${sz}]${inner}[/size]`;
    }
    return inner;
  }
  if (tag === 'P' || tag === 'DIV') {
    const t = inner.replace(/^\n+|\n+$/g, '');
    return t ? `\n\n${t}\n\n` : '\n';
  }
  return inner;
}

export function htmlToMd(root) {
  if (!root) return '';
  const raw = Array.from(root.childNodes).map(serializeNode).join('');
  return raw
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function RichTextField({ value = '', onChange, placeholder = 'Write here… Supports headings, bold, bullet points' }) {
  const editorRef = useRef(null);
  const lastMdRef = useRef(value || '');
  const [rawMode, setRawMode] = useState(false);

  // Sync external value changes (e.g. opening another item or toggling rawMode)
  useEffect(() => {
    if (rawMode) return;
    const el = editorRef.current;
    if (!el) return;
    const next = value || '';
    if (next !== lastMdRef.current || el.innerHTML === '') {
      el.innerHTML = mdToHtml(next);
      lastMdRef.current = next;
    }
  }, [value, rawMode]);

  const emitChange = () => {
    const el = editorRef.current;
    if (!el) return;
    const md = htmlToMd(el);
    lastMdRef.current = md;
    onChange(md);
  };

  const exec = (cmd, arg = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    emitChange();
  };

  const toggleBlock = (tag) => {
    editorRef.current?.focus();
    const current = document.queryCommandValue('formatBlock').toLowerCase();
    document.execCommand('formatBlock', false, current === tag ? '<p>' : `<${tag}>`);
    emitChange();
  };

  const applyFontSize = (size) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand('fontSize', false, '7');
    el.querySelectorAll('font[size="7"]').forEach((fontEl) => {
      if (!size) {
        const frag = document.createDocumentFragment();
        while (fontEl.firstChild) frag.appendChild(fontEl.firstChild);
        fontEl.replaceWith(frag);
      } else {
        const span = document.createElement('span');
        span.setAttribute('data-size', size);
        span.style.fontSize = size;
        while (fontEl.firstChild) span.appendChild(fontEl.firstChild);
        fontEl.replaceWith(span);
      }
    });
    emitChange();
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      const sel = window.getSelection();
      if (sel && sel.rangeCount && sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const node = range.startContainer;
        if (node.nodeType === Node.TEXT_NODE) {
          const before = node.nodeValue.slice(0, range.startOffset);
          if (before === '##' || before === '###' || before === '-' || before === '*') {
            e.preventDefault();
            const r = document.createRange();
            r.setStart(node, 0);
            r.setEnd(node, range.startOffset);
            r.deleteContents();
            if (before === '##') document.execCommand('formatBlock', false, '<h2>');
            else if (before === '###') document.execCommand('formatBlock', false, '<h3>');
            else document.execCommand('insertUnorderedList', false);
            emitChange();
            return;
          }
        }
      }
    }
  };

  const handleInput = () => {
    // Live **bold** auto-conversion while typing
    const sel = window.getSelection();
    if (sel && sel.rangeCount && sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const node = range.startContainer;
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;
        const offset = range.startOffset;
        const before = text.slice(0, offset);
        const match = before.match(/\*\*([^*\n]+)\*\*$/);
        if (match) {
          const matchStart = offset - match[0].length;
          const boldText = match[1];
          const after = text.slice(offset);
          const prefix = text.slice(0, matchStart);

          const strong = document.createElement('strong');
          strong.textContent = boldText;

          const parent = node.parentNode;
          const afterNode = document.createTextNode(after || '\u00A0');
          if (prefix) {
            node.nodeValue = prefix;
            parent.insertBefore(strong, node.nextSibling);
            parent.insertBefore(afterNode, strong.nextSibling);
          } else {
            parent.replaceChild(strong, node);
            parent.insertBefore(afterNode, strong.nextSibling);
          }

          const newRange = document.createRange();
          newRange.setStart(afterNode, after ? 0 : 1);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
        }
      }
    }
    emitChange();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData?.getData('text/plain');
    if (!text) return;
    const looksLikeMd = /(^#{1,3}\s|\*\*|^[-*]\s)/m.test(text);
    if (looksLikeMd) {
      e.preventDefault();
      const html = mdToHtml(text);
      document.execCommand('insertHTML', false, html);
      emitChange();
    }
  };

  const tbBtn =
    'px-2 py-1 text-xs font-semibold rounded-md border border-transparent hover:border-line hover:bg-white text-ink cursor-pointer transition';

  return (
    <div className="border border-line rounded-xl bg-white overflow-hidden focus-within:border-accent transition">
      <div className="flex flex-wrap items-center gap-1 px-2.5 py-1.5 bg-soft/70 border-b border-line">
        {!rawMode && (
          <>
            <button
              type="button"
              className={tbBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                toggleBlock('h2');
              }}
              title="Heading (or type ## + Space)"
            >
              H2
            </button>
            <button
              type="button"
              className={tbBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                toggleBlock('h3');
              }}
              title="Subheading (or type ### + Space)"
            >
              H3
            </button>
            <span className="w-px h-4 bg-line mx-0.5" />
            <button
              type="button"
              className={`${tbBtn} font-bold`}
              onMouseDown={(e) => {
                e.preventDefault();
                exec('bold');
              }}
              title="Bold (Ctrl+B or **text**)"
            >
              B
            </button>
            <button
              type="button"
              className={`${tbBtn} italic`}
              onMouseDown={(e) => {
                e.preventDefault();
                exec('italic');
              }}
              title="Italic (Ctrl+I)"
            >
              I
            </button>
            <span className="w-px h-4 bg-line mx-0.5" />
            <button
              type="button"
              className={tbBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                exec('insertUnorderedList');
              }}
              title="Bullet List (or type - + Space)"
            >
              • List
            </button>
            <span className="w-px h-4 bg-line mx-0.5" />
            <select
              className="text-xs font-medium bg-white border border-line rounded-md px-1.5 py-1 text-ink cursor-pointer outline-none"
              defaultValue=""
              onChange={(e) => {
                const val = e.target.value;
                applyFontSize(val === 'normal' ? '' : val);
                e.target.value = '';
              }}
              title="Change font size of selected text"
            >
              <option value="" disabled>
                Font size
              </option>
              <option value="12px">Small (12px)</option>
              <option value="normal">Normal</option>
              <option value="16px">Medium (16px)</option>
              <option value="20px">Large (20px)</option>
              <option value="24px">XL (24px)</option>
              <option value="30px">2XL (30px)</option>
            </select>
          </>
        )}
        <button
          type="button"
          className={`${tbBtn} ml-auto text-[11px] text-mute`}
          onClick={() => setRawMode((v) => !v)}
          title="Switch between Live Visual & Raw Markdown"
        >
          {rawMode ? 'Visual Editor' : 'Markdown'}
        </button>
      </div>

      {rawMode ? (
        <textarea
          rows="7"
          className="w-full p-3 text-sm outline-none resize-y font-mono bg-white"
          value={value || ''}
          onChange={(e) => {
            lastMdRef.current = e.target.value;
            onChange(e.target.value);
          }}
          placeholder={placeholder}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className="rich-editor"
        />
      )}
    </div>
  );
}

