import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './fb';

export const useMedia = () => {
  const [m, setM] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'media'), (s) => {
      const items = s.docs.map((d) => ({ id: d.id, ...d.data() }));
      items.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setM(items);
    });
    return () => unsub();
  }, []);
  return m;
};

