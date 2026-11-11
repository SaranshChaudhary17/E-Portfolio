import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from './fb';

export const useMedia = () => {
  const [m, setM] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'media'), orderBy('createdAt', 'desc')), (s) => {
      setM(s.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);
  return m;
};

