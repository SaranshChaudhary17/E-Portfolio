import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getAggregateFromServer,
  count,
  sum,
} from 'firebase/firestore';
import { db } from './fb';

const safeCount = async (coll, ...w) => {
  try {
    const q = w.length ? query(collection(db, coll), ...w) : collection(db, coll);
    const snap = await getAggregateFromServer(q, { n: count() });
    return snap.data().n ?? 0;
  } catch {
    try {
      const q = w.length ? query(collection(db, coll), ...w) : collection(db, coll);
      const snap = await getDocs(q);
      return snap.size;
    } catch {
      return 0;
    }
  }
};

const safeMediaStats = async () => {
  try {
    const snap = await getAggregateFromServer(collection(db, 'media'), {
      n: count(),
      size: sum('fileSize'),
    });
    return {
      total: snap.data().n ?? 0,
      size: snap.data().size ?? 0,
    };
  } catch {
    try {
      const snap = await getDocs(collection(db, 'media'));
      let size = 0;
      snap.forEach((d) => {
        size += d.data().fileSize || 0;
      });
      return { total: snap.size, size };
    } catch {
      return { total: 0, size: 0 };
    }
  }
};

const safeRecentMedia = async () => {
  try {
    const snap = await getDocs(
      query(collection(db, 'media'), orderBy('createdAt', 'desc'), limit(5))
    );
    return snap.docs.map((x) => ({ id: x.id, ...x.data() }));
  } catch {
    try {
      const snap = await getDocs(collection(db, 'media'));
      return snap.docs
        .map((x) => ({ id: x.id, ...x.data() }))
        .sort((a, b) => {
          const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds || 0);
          const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds || 0);
          return tB - tA;
        })
        .slice(0, 5);
    } catch {
      return [];
    }
  }
};

export default function Dashboard() {
  const [d, setD] = useState(null);
  const [recent, setR] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [
          totalProjects,
          publishedProjects,
          draftProjects,
          archivedProjects,
          videos,
          images,
          mediaStats,
          enquiries,
          recentMedia,
        ] = await Promise.all([
          safeCount('projects'),
          safeCount('projects', where('status', '==', 'Published')),
          safeCount('projects', where('status', '==', 'Draft')),
          safeCount('projects', where('status', '==', 'Archived')),
          safeCount('media', where('resourceType', '==', 'video')),
          safeCount('media', where('resourceType', '==', 'image')),
          safeMediaStats(),
          safeCount('contactMessages', where('status', '==', 'New')),
          safeRecentMedia(),
        ]);

        if (active) {
          setD({
            'Total Projects': totalProjects,
            Published: publishedProjects,
            Drafts: draftProjects,
            Archived: archivedProjects,
            Videos: videos,
            Images: images,
            'Media Size': ((mediaStats.size || 0) / 1048576).toFixed(1) + ' MB',
            'New Enquiries': enquiries,
          });
          setR(recentMedia);
          setLoading(false);
        }
      } catch (e) {
        console.error('Dashboard load error:', e);
        if (active) {
          setD({
            'Total Projects': 0,
            Published: 0,
            Drafts: 0,
            Archived: 0,
            Videos: 0,
            Images: 0,
            'Media Size': '0.0 MB',
            'New Enquiries': 0,
          });
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (loading || !d) {
    return (
      <div className="py-12 flex items-center gap-3 text-mute">
        <div className="size-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span>Loading dashboard metrics…</span>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(d).map(([k, v]) => (
          <div key={k} className="border border-line rounded-xl p-5 bg-white">
            <p className="text-xs text-mute font-medium">{k}</p>
            <p className="text-3xl font-black mt-2 text-ink">{v}</p>
          </div>
        ))}
      </div>
      <h2 className="font-bold text-lg mt-10 mb-3">Recent Uploads</h2>
      {recent.length ? (
        <div className="border border-line rounded-xl overflow-hidden bg-white">
          {recent.map((r) => (
            <div
              key={r.id || r.publicId}
              className="p-3 text-sm border-b border-line last:border-b-0 flex items-center justify-between"
            >
              <span className="font-medium truncate">{r.fileName || 'Untitled file'}</span>
              <span className="text-mute text-xs ml-4 uppercase tracking-wider">
                {r.resourceType || 'media'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-mute text-sm py-4">No uploads yet.</p>
      )}
    </div>
  );
}
