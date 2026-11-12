import { Fragment, useEffect, useRef, useState } from 'react';
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
  writeBatch,
} from 'firebase/firestore';
import { db } from './fb';
import { useMedia } from './useMedia';
import { uploadFile } from './uploader';
import RichTextField from './RichTextField';

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
    return <RichTextField value={v || ''} onChange={set} />;
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
          <div key={f.k} className="block text-sm">
            <span className="text-mute text-xs font-medium block mb-1.5">{f.label}</span>
            <Field
              f={f}
              v={d[f.k]}
              set={(v) => setD((x) => ({ ...x, [f.k]: v }))}
              media={media}
              refs={refs}
            />
          </div>
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

export default function Crud({ coll, title, fields, defaults = {}, noAdd, noDelete, before }) {
  const [rows, setRows] = useState([]);
  const [edit, setEdit] = useState(null);
  const [err, setErr] = useState('');
  const [s, setS] = useState('');
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [toast, setToast] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const media = useMedia();
  const mediaMap = Object.fromEntries(media.map((m) => [m.id, m]));

  const isProjects = coll === 'projects';
  const isCategories = coll === 'categories';
  const isEnquiries = coll === 'contactMessages';
  const hasSortOrder = isProjects || isCategories || fields.some((f) => f.k === 'sortOrder');

  const resolveThumb = (id) => {
    if (!id) return { src: '', fallback: '' };
    if (typeof id === 'string' && (id.startsWith('http://') || id.startsWith('https://'))) {
      return { src: id, fallback: '' };
    }
    const item = mediaMap[id];
    if (!item) return { src: '', fallback: '' };
    const primary = item.thumbnailUrl || item.secureUrl || item.url || '';
    const fallback = item.secureUrl || item.url || '';
    return { src: primary, fallback: fallback !== primary ? fallback : '' };
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  useEffect(
    () =>
      onSnapshot(collection(db, coll), (x) =>
        setRows(
          x.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a, b) =>
              coll === 'contactMessages'
                ? (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
                : (a.sortOrder || 0) - (b.sortOrder || 0)
            )
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

  const autoSaveField = async (row, field, value) => {
    // Optimistically update local state
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, [field]: value } : r)));
    try {
      await updateDoc(doc(db, coll, row.id), {
        [field]: value,
        updatedAt: serverTimestamp(),
      });
      showToast('Saved');
    } catch (e) {
      alert('Failed to update: ' + e.message);
    }
  };

  const handleDrop = async (dropIdx) => {
    if (dragIdx === null || dragIdx === dropIdx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }

    const list = [...rows];
    const [moved] = list.splice(dragIdx, 1);
    list.splice(dropIdx, 0, moved);

    setDragIdx(null);
    setOverIdx(null);

    const updated = list.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    setRows(updated);

    try {
      const batch = writeBatch(db);
      updated.forEach((item, idx) => {
        batch.update(doc(db, coll, item.id), {
          sortOrder: idx + 1,
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      showToast('Order saved');
    } catch (e) {
      alert('Failed to save order: ' + e.message);
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
  const canDrag = hasSortOrder && !s.trim();

  const statusBadge = (st) => {
    if (st === 'Published' || st === 'Visible')
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (st === 'Draft' || st === 'Hidden')
      return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const renderActions = (r) => (
    <td
      className="py-2.5 px-4 text-right whitespace-nowrap space-x-2"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        className="btn text-xs py-1 px-2.5 cursor-pointer"
        onClick={() => setEdit({ id: r.id, d: r })}
      >
        Edit
      </button>
      {!noDelete && (
        <button
          className="btn btn-d text-xs py-1 px-2.5 cursor-pointer"
          onClick={() => del(r)}
        >
          Delete
        </button>
      )}
    </td>
  );

  return (
    <div>
      <div className="flex gap-3 mb-4 items-center">
        <input
          className="inp !w-64"
          placeholder="Search…"
          value={s}
          onChange={(e) => setS(e.target.value)}
        />
        {canDrag && shown.length > 1 && (
          <span className="text-xs text-mute hidden sm:inline">
            Drag rows up/down to change Display Order
          </span>
        )}
        {toast && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            ✓ {toast}
          </span>
        )}
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
        <div className="border border-line rounded-xl overflow-x-auto bg-white shadow-sm">
          <table className="w-full text-sm">
            {isEnquiries && (
              <thead>
                <tr className="border-b border-line bg-soft/60 text-left text-[11px] uppercase tracking-wider text-mute">
                  <th className="py-2.5 px-4">Name / Email</th>
                  <th className="py-2.5 px-4">Project Type</th>
                  <th className="py-2.5 px-4">Budget Range</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
            )}
            {(isProjects || isCategories) && (
              <thead>
                <tr className="border-b border-line bg-soft/60 text-left text-[11px] uppercase tracking-wider text-mute">
                  <th className="py-2.5 pl-3 pr-1 w-8"></th>
                  <th className="py-2.5 px-3">{isProjects ? 'Project' : 'Category'}</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-center">Display Order</th>
                  <th className="py-2.5 px-3">{isProjects ? 'Video' : 'Slug'}</th>
                  {isProjects ? (
                    <>
                      <th className="py-2.5 px-3 text-center">Featured</th>
                      <th className="py-2.5 px-3 text-center">Homepage</th>
                    </>
                  ) : (
                    <th className="py-2.5 px-3 text-center">Visible</th>
                  )}
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
            )}
            <tbody>
              {shown.map((r, idx) => {
                const primaryThumb = isProjects ? resolveThumb(r.thumbnailMediaId) : { src: '', fallback: '' };
                const posterThumb = isProjects ? resolveThumb(r.posterMediaId) : { src: '', fallback: '' };
                const videoThumb = isProjects ? resolveThumb(r.primaryVideoId) : { src: '', fallback: '' };
                const thumb = primaryThumb.src ? primaryThumb : posterThumb.src ? posterThumb : videoThumb;
                const videoDoc = isProjects ? mediaMap[r.primaryVideoId] : null;
                const isDragging = dragIdx === idx;
                const isOver = overIdx === idx && dragIdx !== idx;
                const catStatus = r.visible === false ? 'Hidden' : 'Visible';
                const isExpanded = isEnquiries && expandedId === r.id;

                if (isEnquiries) {
                  const mailHref = r.email
                    ? `mailto:${encodeURIComponent(r.email)}?subject=${encodeURIComponent(
                        `Re: ${r.projectType || 'Project Enquiry'} — SARANSH.VE`
                      )}&body=${encodeURIComponent(
                        `Hi ${r.name || ''},\n\nThanks for reaching out regarding ${
                          r.projectType || 'your project'
                        }.\n\n`
                      )}`
                    : '';
                  return (
                    <Fragment key={r.id}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : r.id)}
                        className={`border-b border-line last:border-b-0 cursor-pointer transition ${
                          isExpanded ? 'bg-soft/50' : 'hover:bg-soft/40'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-ink">{r.name || r.id}</div>
                          <div className="text-xs text-mute mt-0.5">{r.email || '—'}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-ink whitespace-nowrap">
                          {r.projectType || '—'}
                        </td>
                        <td className="py-3 px-4 text-sm text-mute whitespace-nowrap">
                          {r.budget || '—'}
                        </td>
                        <td
                          className="py-3 px-4 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="btn btn-d text-xs py-1 px-2.5 cursor-pointer"
                            onClick={() => del(r)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="border-b border-line bg-soft/30">
                          <td colSpan={4} className="px-5 py-4">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="space-y-1.5 flex-1">
                                <p className="text-[11px] uppercase tracking-wider font-semibold text-mute">
                                  Project Description
                                </p>
                                <p className="text-sm text-ink whitespace-pre-line leading-relaxed">
                                  {r.message || 'No description provided.'}
                                </p>
                              </div>
                              {mailHref && (
                                <a
                                  href={mailHref}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (r.status !== 'Replied') autoSaveField(r, 'status', 'Replied');
                                  }}
                                  className="btn btn-p text-xs py-2 px-4 shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
                                >
                                  Reply
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                }

                return (
                  <tr
                    key={r.id}
                    draggable={canDrag}
                    onDragStart={(e) => {
                      setDragIdx(idx);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragOver={(e) => {
                      if (!canDrag) return;
                      e.preventDefault();
                      if (overIdx !== idx) setOverIdx(idx);
                    }}
                    onDrop={() => canDrag && handleDrop(idx)}
                    onDragEnd={() => {
                      setDragIdx(null);
                      setOverIdx(null);
                    }}
                    className={`border-b border-line last:border-b-0 transition ${
                      isDragging
                        ? 'opacity-40 bg-soft'
                        : isOver
                        ? 'border-t-2 border-t-accent bg-soft/50'
                        : 'hover:bg-soft/40'
                    }`}
                  >
                    {isProjects ? (
                      <>
                        {/* Drag Handle */}
                        <td
                          className="py-3 pl-3 pr-1 text-mute select-none cursor-grab active:cursor-grabbing text-base leading-none"
                          title={canDrag ? 'Drag to reorder' : 'Clear search to reorder'}
                        >
                          ⋮⋮
                        </td>

                        {/* Thumbnail + Name */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <div className="w-14 h-9 rounded-md bg-soft border border-line overflow-hidden shrink-0 grid place-items-center text-[10px] text-mute">
                              {thumb.src ? (
                                <img
                                  src={thumb.src}
                                  alt={r.title}
                                  className="size-full object-cover"
                                  draggable={false}
                                  onError={(e) => {
                                    if (thumb.fallback && e.currentTarget.src !== thumb.fallback) {
                                      e.currentTarget.src = thumb.fallback;
                                    } else if (videoThumb.src && e.currentTarget.src !== videoThumb.src) {
                                      e.currentTarget.src = videoThumb.src;
                                    }
                                  }}
                                />
                              ) : (
                                'No img'
                              )}
                            </div>
                            <span className="font-medium text-ink line-clamp-1">
                              {r.title || r.id}
                            </span>
                          </div>
                        </td>

                        {/* Status (shifted left) */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge(
                              r.status
                            )}`}
                          >
                            {r.status || 'Draft'}
                          </span>
                        </td>

                        {/* Display Order */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-md bg-soft text-xs font-semibold text-ink">
                            #{r.sortOrder || idx + 1}
                          </span>
                        </td>

                        {/* Video */}
                        <td className="py-2.5 px-3 whitespace-nowrap max-w-[180px]">
                          {videoDoc ? (
                            <span
                              className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full max-w-full"
                              title={videoDoc.fileName}
                            >
                              <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span className="truncate">{videoDoc.fileName}</span>
                            </span>
                          ) : (
                            <span className="text-xs text-mute">No video</span>
                          )}
                        </td>

                        {/* Featured Auto-save Checkbox */}
                        <td
                          className="py-2.5 px-3 text-center"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={!!r.featured}
                            onChange={(e) => autoSaveField(r, 'featured', e.target.checked)}
                            className="size-4 accent-accent cursor-pointer"
                            title="Toggle Featured (auto-saves)"
                          />
                        </td>

                        {/* Homepage Auto-save Checkbox */}
                        <td
                          className="py-2.5 px-3 text-center"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={r.homepageVisible !== false}
                            onChange={(e) => autoSaveField(r, 'homepageVisible', e.target.checked)}
                            className="size-4 accent-accent cursor-pointer"
                            title="Toggle Homepage visibility (auto-saves)"
                          />
                        </td>

                        {renderActions(r)}
                      </>
                    ) : isCategories ? (
                      <>
                        {/* Drag Handle */}
                        <td
                          className="py-3 pl-3 pr-1 text-mute select-none cursor-grab active:cursor-grabbing text-base leading-none"
                          title={canDrag ? 'Drag to reorder' : 'Clear search to reorder'}
                        >
                          ⋮⋮
                        </td>

                        {/* Category Name */}
                        <td className="py-2.5 px-3">
                          <div className="min-w-[160px]">
                            <span className="font-medium text-ink block">{r.name || r.id}</span>
                            {r.description && (
                              <span className="text-xs text-mute line-clamp-1">{r.description}</span>
                            )}
                          </div>
                        </td>

                        {/* Status (shifted left) */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge(
                              catStatus
                            )}`}
                          >
                            {catStatus}
                          </span>
                        </td>

                        {/* Display Order */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-md bg-soft text-xs font-semibold text-ink">
                            #{r.sortOrder || idx + 1}
                          </span>
                        </td>

                        {/* Slug */}
                        <td className="py-2.5 px-3 text-xs text-mute whitespace-nowrap">
                          {r.slug || '—'}
                        </td>

                        {/* Visible Auto-save Checkbox */}
                        <td
                          className="py-2.5 px-3 text-center"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={r.visible !== false}
                            onChange={(e) => autoSaveField(r, 'visible', e.target.checked)}
                            className="size-4 accent-accent cursor-pointer"
                            title="Toggle Visible on website (auto-saves)"
                          />
                        </td>

                        {renderActions(r)}
                      </>
                    ) : (
                      <>
                        {hasSortOrder && (
                          <td
                            className="py-3 pl-3 pr-1 w-8 text-mute select-none cursor-grab active:cursor-grabbing"
                            title="Drag to reorder"
                          >
                            ⋮⋮
                          </td>
                        )}
                        <td className="py-3 px-4 font-medium">{r[fields[0].k] || r.id}</td>
                        <td className="py-3 px-4 text-mute text-xs">
                          {r.status ||
                            (r.visible === false || r.active === false
                              ? 'Hidden'
                              : r.categoryName || r.email || '')}
                        </td>
                        {renderActions(r)}
                      </>
                    )}
                  </tr>
                );
              })}
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
