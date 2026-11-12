import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Ctx = createContext(null);
export const useContent = () => useContext(Ctx);

const empty = {
  projects: [],
  categories: ['All'],
  services: [],
  site: {
    url: 'https://saransh.vercel.app',
    name: 'Saransh Chaudhary',
    title: 'Video Editor & Motion Graphics Artist',
    email: '',
    instagram: '',
    linkedin: '',
    behance: '',
    youtube: '',
    whatsapp: '',
    profilePhoto: '',
    bio: '',
    intro: '',
    philosophy: '',
    tools: [],
    available: false,
    showreel: { url: '', poster: '', title: '', description: '' },
  },
};

const byOrder = (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0);

export function ContentProvider({ children }) {
  const [data, setData] = useState({
    projects: [],
    media: [],
    categories: [],
    services: [],
    skills: [],
    showreels: [],
    profile: {},
    socialLinks: {},
    siteSettings: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubs = [];

    const handleSnapshot = (key, transform = (docs) => docs) => (snapshot) => {
      setData((prev) => ({
        ...prev,
        [key]: transform(
          snapshot.docs
            ? snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
            : snapshot.exists()
            ? snapshot.data()
            : {}
        ),
      }));
      setLoading(false);
    };

    const handleError = (key) => (err) => {
      console.error(`Error loading ${key}:`, err);
      setError(true);
      setLoading(false);
    };

    try {
      unsubs.push(
        onSnapshot(
          collection(db, 'projects'),
          (s) => {
            const list = s.docs
              .map((d) => ({ id: d.id, ...d.data() }))
              .filter((p) => p.status === 'Published');
            setData((prev) => ({ ...prev, projects: list }));
            setLoading(false);
          },
          handleError('projects')
        )
      );

      unsubs.push(
        onSnapshot(collection(db, 'media'), handleSnapshot('media'), handleError('media'))
      );

      unsubs.push(
        onSnapshot(
          collection(db, 'categories'),
          (s) => {
            const list = s.docs
              .map((d) => ({ id: d.id, ...d.data() }))
              .filter((c) => c.visible !== false);
            setData((prev) => ({ ...prev, categories: list }));
          },
          handleError('categories')
        )
      );

      unsubs.push(
        onSnapshot(
          collection(db, 'services'),
          (s) => {
            const list = s.docs
              .map((d) => ({ id: d.id, ...d.data() }))
              .filter((c) => c.visible !== false);
            setData((prev) => ({ ...prev, services: list }));
          },
          handleError('services')
        )
      );

      unsubs.push(
        onSnapshot(
          collection(db, 'skills'),
          (s) => {
            const list = s.docs
              .map((d) => ({ id: d.id, ...d.data() }))
              .filter((c) => c.visible !== false);
            setData((prev) => ({ ...prev, skills: list }));
          },
          handleError('skills')
        )
      );

      unsubs.push(
        onSnapshot(
          collection(db, 'showreels'),
          (s) => {
            const list = s.docs
              .map((d) => ({ id: d.id, ...d.data() }))
              .filter((c) => c.active === true);
            setData((prev) => ({ ...prev, showreels: list }));
          },
          handleError('showreels')
        )
      );

      unsubs.push(
        onSnapshot(doc(db, 'profile', 'main'), handleSnapshot('profile'), handleError('profile'))
      );

      unsubs.push(
        onSnapshot(
          doc(db, 'socialLinks', 'main'),
          handleSnapshot('socialLinks'),
          handleError('socialLinks')
        )
      );

      unsubs.push(
        onSnapshot(
          doc(db, 'siteSettings', 'main'),
          handleSnapshot('siteSettings'),
          handleError('siteSettings')
        )
      );
    } catch (err) {
      console.error('Failed to attach listeners:', err);
      setError(true);
      setLoading(false);
    }

    return () => unsubs.forEach((u) => u && u());
  }, []);

  const m = Object.fromEntries((data.media || []).map((x) => [x.id, x]));

  const getMediaUrl = (id) => {
    if (!id) return '';
    if (typeof id === 'string' && (id.startsWith('http://') || id.startsWith('https://'))) {
      return id;
    }
    return m[id]?.secureUrl || '';
  };

  const getThumbnailUrl = (id) => {
    if (!id) return '';
    if (typeof id === 'string' && (id.startsWith('http://') || id.startsWith('https://'))) {
      return id;
    }
    return m[id]?.thumbnailUrl || m[id]?.secureUrl || '';
  };

  const projects = (data.projects || []).sort(byOrder).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.categoryName || '',
    year: p.projectYear,
    description: p.shortDescription || '',
    thumbnail: getThumbnailUrl(p.thumbnailMediaId),
    poster: getThumbnailUrl(p.posterMediaId) || getThumbnailUrl(p.thumbnailMediaId),
    videoUrl: getMediaUrl(p.primaryVideoId),
    featured: !!p.featured && p.homepageVisible !== false,
    tags: p.tags || [],
    client: p.clientName || '',
    role: p.role || '',
    software: p.softwareUsed || [],
    overview: p.overview || p.description || '',
    creativeDirection: p.creativeDirection || '',
    additionalMedia: (p.additionalMediaIds || [])
      .map((i) => ({
        videoUrl: getMediaUrl(i),
        poster: getThumbnailUrl(i),
        title: m[i]?.fileName || '',
        resourceType: m[i]?.resourceType || 'video',
      }))
      .filter((item) => item.videoUrl),
    orientation:
      m[p.primaryVideoId]?.aspectRatio && m[p.primaryVideoId].aspectRatio < 1
        ? 'portrait'
        : 'landscape',
  }));

  const prof = data.profile || {};
  const soc = data.socialLinks || {};
  const set = data.siteSettings || {};
  const r = (data.showreels || [])[0] || {};

  const site = {
    ...empty.site,
    name: prof.name || 'Saransh Chaudhary',
    title: prof.title || 'Video Editor & Motion Graphics Artist',
    email: soc.email || set.contactEmail || '',
    instagram: soc.instagram || '',
    linkedin: soc.linkedin || '',
    behance: soc.behance || '',
    youtube: soc.youtube || '',
    whatsapp: soc.whatsapp || '',
    profilePhoto: getMediaUrl(prof.profileImageMediaId),
    bio: prof.shortBio || '',
    intro: prof.introduction || '',
    philosophy: prof.philosophy || '',
    tools: (data.skills || []).sort(byOrder).map((x) => ({
      id: x.id,
      name: x.name,
      icon: getThumbnailUrl(x.iconMediaId) || getMediaUrl(x.iconMediaId),
    })),
    available: !!set.availability,
    showreel: {
      url: getMediaUrl(r.videoMediaId),
      poster: getThumbnailUrl(r.posterMediaId) || getThumbnailUrl(r.videoMediaId),
      title: r.title || '',
      description: r.description || '',
    },
  };

  const categories = ['All', ...(data.categories || []).sort(byOrder).map((c) => c.name)];
  const services = (data.services || []).sort(byOrder);

  return (
    <Ctx.Provider
      value={{
        loading,
        error,
        projects,
        categories,
        services,
        site,
        reload: () => {},
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
