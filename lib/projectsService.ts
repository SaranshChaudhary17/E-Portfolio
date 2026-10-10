import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { projects as defaultProjects, Project } from "@/data/projects";

export interface FirestoreProject extends Project {
  id?: string;
  order?: number;
  published?: boolean;
  createdAt?: any;
  updatedAt?: any;
  thumbnailUrl?: string;
  objectivesMediaMode?: "video" | "image" | "slideshow";
  objectivesSlideshow?: string[];
}

const COLLECTION_NAME = "projects";

// Fetch all projects (or only published ones for public pages)
export async function fetchProjects(includeDrafts = false): Promise<FirestoreProject[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      return [];
    }
    const all = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<FirestoreProject, "id">),
    }));
    const filtered = includeDrafts ? all : all.filter((p) => p.published !== false);
    return filtered.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (err) {
    console.error("Firestore fetch error:", err);
    return [];
  }
}

// Fetch single project by slug
export async function fetchProjectBySlug(slug: string): Promise<FirestoreProject | null> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where("slug", "==", slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { id: docSnap.id, ...(docSnap.data() as Omit<FirestoreProject, "id">) };
    }
  } catch (err) {
    console.error("Firestore slug fetch error:", err);
  }
  return null;
}

// Fetch single project by ID (for admin editing)
export async function fetchProjectById(id: string): Promise<FirestoreProject | null> {
  const dRef = doc(db, COLLECTION_NAME, id);
  const snap = await getDoc(dRef);
  if (snap.exists()) {
    return { id: snap.id, ...(snap.data() as Omit<FirestoreProject, "id">) };
  }
  return null;
}

// Create new project
export async function saveNewProject(data: Partial<FirestoreProject>): Promise<string> {
  const colRef = collection(db, COLLECTION_NAME);
  const payload = {
    ...data,
    published: data.published ?? true,
    order: data.order ?? 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(colRef, payload);
  return docRef.id;
}

// Update existing project
export async function updateExistingProject(id: string, data: Partial<FirestoreProject>): Promise<void> {
  if (id.startsWith("local-")) {
    // If it was local fallback, create as new in Firestore
    const { id: _, ...rest } = data;
    await saveNewProject(rest);
    return;
  }
  const dRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(dRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete project
export async function removeProject(id: string): Promise<void> {
  if (id.startsWith("local-")) return;
  const dRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(dRef);
}

// Seed default projects into Firestore (One click utility)
export async function seedDefaultProjects(): Promise<number> {
  const colRef = collection(db, COLLECTION_NAME);
  let count = 0;
  for (let i = 0; i < defaultProjects.length; i++) {
    const p = defaultProjects[i];
    await addDoc(colRef, {
      ...p,
      published: true,
      order: i,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    count++;
  }
  return count;
}
