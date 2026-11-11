import { useEffect, useRef, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './fb';
import { useMedia } from './useMedia';
import { uploadFile } from './uploader';

// Tag Input supporting Enter, Comma, Backspace and Paste
function TagInput({ value = [], onChange, placeholder = 'Type and press Enter or comma…' }) {
  const [input, setInput] = useState('');
  const tags = Array.isArray(value) ? value : [];

  const addTag = (text) => {
    const trimmed = text.trim().replace(/^,+|,+$/g, '');
    if (!trimmed) return;
    const splitTags = trimmed
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const newTags = Array.from(new Set([...tags, ...splitTags]));
    onChange(newTags);
    setInput('');
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, i) => i !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted.includes(',')) {
      e.preventDefault();
      addTag(pasted);
    }
  };

  return (
    <div className="border border-line rounded-xl p-2 bg-white flex flex-wrap gap-2 items-center focus-within:border-accent transition">
      {tags.map((t, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-soft rounded-lg text-xs font-medium text-ink"
        >
          <span>{t}</span>
          <button
            type="button"
            onClick={() => removeTag(idx)}
            className="size-3.5 rounded-full hover:bg-line text-mute hover:text-ink inline-grid place-items-center cursor-pointer text-[10px] leading-none"
          >
            ✕
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length === 0 ? placeholder : 'Add more…'}
        className="flex-1 min-w-[120px] outline-none text-sm px-1 py-1 bg-transparent"
      />
    </div>
  );
}

// Media Upload & Select Field
function SingleMediaField({ type, value, onChange, media = [] }) {
  const isVideo = type === 'mvid';
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const selectedMedia = media.find((m) => m.id === value);
  const relevantMedia = media.filter((m) => m.resourceType === (isVideo ? 'video' : 'image'));

  const handleFileChosen = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    setProgress(0);
    try {
      const uploaded = await uploadFile(file, (pct) => setProgress(pct));
      onChange(uploaded.id);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Upload failed');
      setUploading(false);
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept={isVideo ? '.mp4,.mov,.webm,.m4v' : '.jpg,.jpeg,.png,.webp,.gif'}
        onChange={handleFileChosen}
      />

      {uploading && (
        <div className="border border-line rounded-xl p-3 bg-white space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span>Uploading {isVideo ? 'video' : 'image'}…</span>
            <span className="text-accent">{progress}%</span>
          </div>
          <div className="w-full bg-soft h-2 rounded-full overflow-hidden">
            <div
              className="bg-accent h-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && <p className="text-red-600 text-xs">{error}</p>}

      {selectedMedia ? (
        <div className="border border-line rounded-xl p-3 bg-white flex items-center gap-3">
          <div className="size-14 rounded-lg bg-soft overflow-hidden shrink-0 flex items-center justify-center">
            <img
              src={selectedMedia.thumbnailUrl || selectedMedia.secureUrl}
              alt={selectedMedia.fileName}
              className="size-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-xs truncate">{selectedMedia.fileName}</p>
            <p className="text-[11px] text-mute">
              {selectedMedia.resourceType}
              {selectedMedia.width ? ` · ${selectedMedia.width}×${selectedMedia.height}` : ''}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              className="btn text-xs py-1 px-2.5 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </button>
            <button
              type="button"
              className="btn btn-d text-xs py-1 px-2 cursor-pointer"
              onClick={() => onChange('')}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            className="btn btn-p text-xs py-2 px-3.5 cursor-pointer flex items-center justify-center gap-1.5"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <span>+</span> Upload {isVideo ? 'Video' : 'Image'}
          </button>
          <div className="relative flex-1">
            <select
              className="inp text-xs py-2"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={uploading}
            >
              <option value="">Or select from library ({relevantMedia.length} available)</option>
              {relevantMedia.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fileName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// Multi Media Field for additionalMediaIds
function MultiMediaField({ value = [], onChange, media = [] }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const selectedIds = Array.isArray(value) ? value : [];

  const handleFilesChosen = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setError('');
    setUploading(true);
    setProgress(0);
    try {
      const newIds = [];
      for (let i = 0; i < files.length; i++) {
        const uploaded = await uploadFile(files[i], (pct) => {
          const overall = Math.round(((i + pct / 100) / files.length) * 100);
          setProgress(overall);
        });
        newIds.push(uploaded.id);
      }
      onChange([...selectedIds, ...newIds]);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Upload failed');
      setUploading(false);
    } finally {
      e.target.value = '';
    }
  };

  const removeId = (idToRemove) => {
    onChange(selectedIds.filter((id) => id !== idToRemove));
  };

  const selectedItems = selectedIds.map((id) => media.find((m) => m.id === id)).filter(Boolean);

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.webm"
        onChange={handleFilesChosen}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-p text-xs py-1.5 px-3 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <span>+</span> Upload Files
        </button>
        <select
          className="inp !w-auto text-xs py-1.5"
          value=""
          onChange={(e) => {
            if (e.target.value && !selectedIds.includes(e.target.value)) {
              onChange([...selectedIds, e.target.value]);
            }
          }}
          disabled={uploading}
        >
          <option value="">Add from library…</option>
          {media
            .filter((m) => !selectedIds.includes(m.id))
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.fileName} ({m.resourceType})
              </option>
            ))}
        </select>
      </div>

      {uploading && (
        <div className="border border-line rounded-xl p-3 bg-white space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span>Uploading files…</span>
            <span className="text-accent">{progress}%</span>
          </div>
          <div className="w-full bg-soft h-2 rounded-full overflow-hidden">
            <div
              className="bg-accent h-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && <p className="text-red-600 text-xs">{error}</p>}

      {selectedItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {selectedItems.map((m) => (
            <div
              key={m.id}
              className="border border-line rounded-lg p-2 bg-white flex items-center gap-2 relative group"
            >
              <img
                src={m.thumbnailUrl || m.secureUrl}
                alt={m.fileName}
                className="size-9 object-cover rounded bg-soft shrink-0"
              />
              <span className="text-xs truncate flex-1 font-medium">{m.fileName}</span>
              <button
                type="button"
                className="text-mute hover:text-red-600 text-xs cursor-pointer p-1"
                onClick={() => removeId(m.id)}
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ f, v, set, media, refs }) {
  const c = 'inp';
  const o = f.type;

  if (o === 'area')
    return <textarea rows="4" className={c} value={v || ''} onChange={(e) => set(e.target.value)} />;
  if (o === 'num')
    return <input type="number" className={c} value={v ?? 0} onChange={(e) => set(+e.target.value)} />;
  if (o === 'bool')
    return (
      <input
        type="checkbox"
        checked={!!v}
        onChange={(e) => set(e.target.checked)}
        className="size-4 accent-accent cursor-pointer mt-1"
      />
    );
  if (o === 'csv')
    return (
      <TagInput
        value={v || []}
        onChange={set}
        placeholder={f.k === 'softwareUsed' ? 'e.g. Premiere Pro, After Effects…' : 'Type tag and press Enter or comma…'}
      />
    );
  if (o === 'select')
    return (
      <select className={c} value={v || ''} onChange={(e) => set(e.target.value)}>
        {f.options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    );
  if (o === 'ref')
    return (
      <select className={c} value={v || ''} onChange={(e) => set(e.target.value)}>
        <option value="">— Select {f.label} —</option>
        {(refs[f.coll] || []).map((r) => (
          <option key={r.id} value={r.id}>
            {r.name || r.title || r.id}
          </option>
        ))}
      </select>
    );
  if (o === 'mimg' || o === 'mvid')
    return <SingleMediaField type={o} value={v} onChange={set} media={media} />;
  if (o === 'mmulti')
    return <MultiMediaField value={v || []} onChange={set} media={media} />;

  return <input className={c} value={v || ''} onChange={(e) => set(e.target.value)} />;
}

function Form({ fields, init, onSave, onCancel, title, err }) {
  const [d, setD] = useState(init);
  const media = useMedia();
  const [refs, setRefs] = useState({});

  useEffect(() => {
    const u = fields
      .filter((f) => f.type === 'ref')
      .map((f) =>
        onSnapshot(collection(db, f.coll), (s) =>
          setRefs((r) => ({ ...r, [f.coll]: s.docs.map((x) => ({ id: x.id, ...x.data() })) }))
        )
      );
    return () => u.forEach((x) => x());
  }, []);

  return (
    <div className="max-w-2xl bg-white p-6 border border-line rounded-2xl shadow-sm">
      <h2 className="font-bold text-xl mb-6">{title}</h2>
      <div className="space-y-5">
        {fields.map((f) => (
          <label key={f.k} className="block text-sm">
            <span className="text-mute text-xs font-medium block mb-1.5">{f.label}</span>
            <Field
              f={f}
              v={d[f.k]}
              set={(v) => setD((x) => ({ ...x, [f.k]: v }))}
              media={media}
              refs={refs}
            />
          </label>
        ))}
      </div>
      {err && <p className="text-red-600 text-sm mt-4 font-medium">{err}</p>}
      <div className="mt-8 pt-4 border-t border-line flex gap-3">
        <button className="btn btn-p cursor-pointer" onClick={() => onSave(d)}>
          Save
        </button>
        <button className="btn cursor-pointer" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

const clean = (d) => {
  const { id, createdAt, updatedAt, publishedAt, ...r } = d;
  return r;
};

export default function Crud({ coll, title, fields, defaults = {}, noAdd, noDelete, before, dup }) {
  const [rows, setRows] = useState([]);
  const [edit, setEdit] = useState(null);
  const [err, setErr] = useState('');
  const [s, setS] = useState('');

  useEffect(
    () =>
      onSnapshot(collection(db, coll), (x) =>
        setRows(
          x.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        )
      ),
    [coll]
  );

  const save = async (d) => {
    try {
      setErr('');
      let x = clean(d);
      if (before) x = await before(x, edit.id);
      x.updatedAt = serverTimestamp();
      if (edit.id) await updateDoc(doc(db, coll, edit.id), x);
      else await addDoc(collection(db, coll), { ...x, createdAt: serverTimestamp() });
      setEdit(null);
    } catch (e) {
      setErr(e.message);
    }
  };

  const del = async (r) => {
    if (confirm(`Delete "${r[fields[0].k] || r.id}"? This cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, coll, r.id));
      } catch (e) {
        alert(e.message);
      }
    }
  };

  if (edit)
    return (
      <Form
        fields={fields}
        init={edit.d}
        onSave={save}
        onCancel={() => setEdit(null)}
        title={edit.id ? 'Edit ' + (edit.d[fields[0].k] || '') : 'New ' + (title || 'Item')}
        err={err}
      />
    );

  const shown = rows.filter((r) => JSON.stringify(r).toLowerCase().includes(s.toLowerCase()));

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input
          className="inp !w-64"
          placeholder="Search…"
          value={s}
          onChange={(e) => setS(e.target.value)}
        />
        {!noAdd && (
          <button
            className="btn btn-p ml-auto cursor-pointer"
            onClick={() => setEdit({ d: { ...defaults } })}
          >
            + New
          </button>
        )}
      </div>
      {shown.length ? (
        <div className="border border-line rounded-xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-b-0 hover:bg-soft transition">
                  <td className="py-3 px-4 font-medium">{r[fields[0].k] || r.id}</td>
                  <td className="py-3 px-4 text-mute text-xs">
                    {r.status ||
                      (r.visible === false || r.active === false
                        ? 'Hidden'
                        : r.categoryName || r.email || '')}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      className="btn text-xs py-1 px-2.5 cursor-pointer"
                      onClick={() => setEdit({ id: r.id, d: r })}
                    >
                      Edit
                    </button>
                    {dup && (
                      <button
                        className="btn text-xs py-1 px-2.5 cursor-pointer"
                        onClick={() =>
                          setEdit({
                            d: {
                              ...clean(r),
                              [fields[0].k]: r[fields[0].k] + ' (copy)',
                              slug: '',
                              status: 'Draft',
                            },
                          })
                        }
                      >
                        Duplicate
                      </button>
                    )}
                    {!noDelete && (
                      <button
                        className="btn btn-d text-xs py-1 px-2.5 cursor-pointer"
                        onClick={() => del(r)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-mute text-sm py-4">
          Nothing here yet.{!noAdd && ' Click “+ New” to add.'}
        </p>
      )}
    </div>
  );
}

export function Single({ coll, docId = 'main', fields }) {
  const [d, setD] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getDoc(doc(db, coll, docId)).then((s) => setD(s.exists() ? s.data() : {}));
  }, [coll]);

  if (!d) return <p className="text-mute py-8">Loading…</p>;

  return (
    <Form
      fields={fields}
      init={d}
      onSave={async (x) => {
        setD(x);
        const { createdAt, updatedAt, ...y } = x;
        try {
          await setDoc(doc(db, coll, docId), { ...y, updatedAt: serverTimestamp() }, { merge: true });
          setMsg('Saved successfully.');
          setTimeout(() => setMsg(''), 3000);
        } catch (e) {
          setMsg(e.message);
        }
      }}
      onCancel={() => {}}
      title=""
      err={msg}
    />
  );
}
