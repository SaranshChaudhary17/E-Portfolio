import { useRef, useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db, fn } from './fb';
import { useMedia } from './useMedia';
import { uploadFile, getResourceType } from './uploader';

const mb = (b) => (b ? (b / 1048576).toFixed(1) + ' MB' : '0 MB');

export default function Media({ pick }) {
  const media = useMedia();
  const [q, setQ] = useState([]);
  const [filter, setF] = useState('All');
  const [s, setS] = useState('');
  const inp = useRef();

  const patch = (id, p) => setQ((x) => x.map((i) => (i.id === id ? { ...i, ...p } : i)));

  const run = async (it) => {
    const set = (p) => patch(it.id, p);
    try {
      set({ status: 'Uploading', error: '', progress: 0 });
      await uploadFile(it.file, (pct) => set({ progress: pct }));
      set({ status: 'Completed', progress: 100 });
    } catch (e) {
      set({ status: 'Failed', error: e.message });
    }
  };

  const add = (files) => {
    const items = [...files].map((f) => {
      const rt = getResourceType(f.name);
      const max = rt === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
      let error = !rt
        ? 'Unsupported format'
        : f.size > max
        ? `Exceeds ${rt === 'image' ? '10 MB' : '100 MB'} Cloudinary limit (${mb(f.size)})`
        : '';
      return {
        id: crypto.randomUUID(),
        file: f,
        rt,
        status: error ? 'Failed' : 'Queued',
        progress: 0,
        error,
      };
    });
    setQ((x) => [...items, ...x]);
    items.filter((i) => !i.error).forEach(run);
  };

  const del = async (m) => {
    if (!confirm(`Delete "${m.fileName}"? This will remove it from the library.`)) return;
    try {
      await deleteDoc(doc(db, 'media', m.id));
      try {
        await fn('deleteMedia')({ id: m.id });
      } catch {}
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  const shown = media.filter((m) => {
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Videos' && m.resourceType === 'video') ||
      (filter === 'Images' && m.resourceType === 'image') ||
      (filter === 'Portrait' && m.aspectRatio < 1) ||
      (filter === 'Landscape' && m.aspectRatio >= 1);
    const matchesSearch = ((m.fileName || '') + (m.tags || []).join()).toLowerCase().includes(s.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const overall = q.length ? Math.round(q.reduce((a, i) => a + i.progress, 0) / q.length) : 0;

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          add(e.dataTransfer.files);
        }}
        onClick={() => inp.current.click()}
        className="border-2 border-dashed border-line rounded-2xl p-10 text-center cursor-pointer hover:border-accent transition bg-white"
      >
        <p className="font-semibold text-base">Drag & drop or click to browse</p>
        <p className="text-xs text-mute mt-1">Images up to 10 MB · Videos up to 100 MB (Cloudinary Free plan limit)</p>
        <input
          ref={inp}
          type="file"
          multiple
          hidden
          accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.webm"
          onChange={(e) => {
            add(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {q.length > 0 && (
        <div className="mt-4 border border-line rounded-xl p-4 text-sm bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-xs text-mute uppercase tracking-wider">Upload Queue</span>
            <span className="text-xs text-mute">Overall {overall}%</span>
          </div>
          <div className="space-y-2">
            {q.map((i) => (
              <div key={i.id} className="flex items-center gap-3 py-1.5 border-b border-line last:border-b-0">
                <span className="flex-1 truncate">
                  {i.file.name} <span className="text-mute text-xs">({mb(i.file.size)})</span>
                </span>
                <span className="w-24 text-xs font-medium">
                  {i.status === 'Uploading' ? `${i.progress}%` : i.status}
                </span>
                {i.error && (
                  <span className="text-red-600 text-xs max-w-xs truncate" title={i.error}>
                    {i.error}
                  </span>
                )}
                {i.status === 'Failed' && (
                  <button className="btn text-xs py-1 px-2.5 cursor-pointer" onClick={() => run(i)}>
                    Retry
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-8 flex-wrap items-center">
        {['All', 'Videos', 'Images', 'Portrait', 'Landscape'].map((x) => (
          <button
            key={x}
            onClick={() => setF(x)}
            className={`btn cursor-pointer ${filter === x ? 'btn-p' : ''}`}
          >
            {x}
          </button>
        ))}
        <input
          className="inp !w-60 ml-auto"
          placeholder="Search name or tag…"
          value={s}
          onChange={(e) => setS(e.target.value)}
        />
      </div>

      {shown.length ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {shown.map((m) => (
            <div key={m.id} className="border border-line rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
              <div className="aspect-video bg-soft relative flex items-center justify-center overflow-hidden">
                <img
                  src={m.thumbnailUrl || m.secureUrl}
                  alt={m.fileName}
                  className="size-full object-cover"
                  loading="lazy"
                />
                {m.resourceType === 'video' && (
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                    VIDEO
                  </span>
                )}
              </div>
              <div className="p-3 text-xs flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-semibold truncate" title={m.fileName}>
                    {m.fileName}
                  </p>
                  <p className="text-mute text-[11px] mt-0.5">
                    {m.resourceType} · {mb(m.fileSize)}
                    {m.width ? ` · ${m.width}×${m.height}` : ''}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-line flex gap-2 justify-end">
                  {pick && (
                    <button className="btn btn-p text-xs py-1 px-2.5 cursor-pointer" onClick={() => pick(m)}>
                      Use
                    </button>
                  )}
                  <button className="btn btn-d text-xs py-1 px-2.5 cursor-pointer" onClick={() => del(m)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-mute text-sm mt-8">No media found. Upload your first file above.</p>
      )}
    </div>
  );
}
