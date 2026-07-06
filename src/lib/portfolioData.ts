// ─── Central Portfolio Data Store ───────────────────────────────────────────
// Admin panel writes to localStorage which overrides these defaults at runtime.
// All public pages read from this as their default fallback.

export interface Project {
  slug: string;
  title: string;
  type: string;
  description?: string;
  techStack?: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  thumbnailUrl?: string; // remote URL
  galleryUrls?: string[]; // remote URLs for slideshow
}

export interface Video {
  id: string;
  title: string;
  subtitle?: string;
  youtubeUrl?: string;
  localVideoUrl?: string; // base64 data URL from local file
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category?: string;
  imageUrl?: string;
  span?: string;
}

export interface ProfileData {
  name: string;
  role: string;
  location: string;
  bio: string;
  bio2: string;
  skills: string[];
  avatarUrl?: string; // base64 data URL or remote URL
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export const defaultProjects: Project[] = [
  { slug: "sarvanash", title: "Sarvanash Comic Site", type: "Web Platform", description: "A cinematic digital comic reader built with Next.js and Framer Motion.", techStack: ["Next.js", "Framer Motion", "TypeScript"], featured: true },
  { slug: "ovid-bathware", title: "Ovid Bathware", type: "E-Commerce", description: "Premium bathware e-commerce with luxury design.", techStack: ["Next.js", "Tailwind", "Stripe"] },
  { slug: "invoice-generator", title: "Invoice Generator", type: "SaaS Tool", description: "Smart invoice generation tool for freelancers.", techStack: ["React", "PDF.js", "Firebase"] },
  { slug: "ai-phishing-detection", title: "AI Phishing Detection", type: "Security", description: "ML-based phishing email and URL detection system.", techStack: ["Python", "ML", "Flask"] },
  { slug: "gym-web", title: "Gym Web", type: "Landing Page", description: "High-performance gym landing page with animations.", techStack: ["HTML", "GSAP", "CSS"] },
  { slug: "electricity-billing-system", title: "Electricity Billing System", type: "Dashboard", description: "Utility billing management dashboard.", techStack: ["React", "Firebase", "Charts"] },
  { slug: "t2t-indian-languages", title: "T2T Indian Languages", type: "AI Tool", description: "Text-to-text translation for Indian regional languages.", techStack: ["Python", "NLP", "Next.js"] },
];

export const defaultVideos: Video[] = [
  { id: "showreel-2026", title: "Showreel 2026", subtitle: "Featured Reel", featured: true },
  { id: "motion-concept-01", title: "Motion Concept 01" },
  { id: "motion-concept-02", title: "Motion Concept 02" },
];

export const defaultGallery: GalleryItem[] = [
  { id: "1", title: "Comic Concept A", category: "Illustration", span: "col-span-1 row-span-2" },
  { id: "2", title: "UI Design Alpha", category: "UI/UX", span: "col-span-1 row-span-1" },
  { id: "3", title: "Motion Poster", category: "Motion", span: "col-span-2 row-span-2" },
  { id: "4", title: "Experimental Visual", category: "Experimental", span: "col-span-1 row-span-1" },
  { id: "5", title: "3D Rendering", category: "3D", span: "col-span-1 row-span-2" },
  { id: "6", title: "Hologram Sketch", category: "Concept", span: "col-span-2 row-span-1" },
];

export const defaultProfile: ProfileData = {
  name: "Saransh Chaudhary",
  role: "Creative Developer",
  location: "Earth",
  bio: "I am Saransh Chaudhary, a multi-disciplinary creative developer merging logic with cinematic aesthetics. My work exists at the intersection of motion design, 3D interaction, and robust software engineering.",
  bio2: "With a background in video editing and motion graphics, I treat every digital product as an immersive experience. I build tools, platforms, and experiences that feel premium, alive, and futuristic.",
  skills: ["Next.js", "React", "TypeScript", "Tailwind", "Framer Motion", "GSAP", "Three.js", "Premiere Pro", "After Effects"],
};

// ─── Runtime helpers (reads from Firestore, falls back to defaults) ────────
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const COLLECTION = "portfolio_data";
const DOC_ID = "main";
const LOCAL_KEY = "portfolio_data_main";

type PortfolioDocument = {
  projects?: Project[];
  videos?: Video[];
  gallery?: GalleryItem[];
  profile?: ProfileData;
  messages?: ContactMessage[];
};

const canUseLocalStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readLocalData = (): PortfolioDocument => {
  if (!canUseLocalStorage()) return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeLocalData = (data: PortfolioDocument) => {
  if (!canUseLocalStorage()) return;
  const current = readLocalData();
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...current, ...data }));
};

const getCloudData = async (): Promise<PortfolioDocument | null> => {
  try {
    const d = await getDoc(doc(db, COLLECTION, DOC_ID));
    if (!d.exists()) return null;
    const data = d.data() as PortfolioDocument;
    writeLocalData(data);
    return data;
  } catch (error) {
    console.warn("Firestore read failed, using local/default portfolio data.", error);
    return null;
  }
};

const saveData = async (data: PortfolioDocument) => {
  writeLocalData(data);
  try {
    await setDoc(doc(db, COLLECTION, DOC_ID), data, { merge: true });
  } catch (error) {
    console.warn("Firestore write failed, saved portfolio data locally only.", error);
  }
};

export const portfolioData = {
  getProjects: async (): Promise<Project[]> => {
    const data = await getCloudData();
    return data?.projects || readLocalData().projects || defaultProjects;
  },
  getVideos: async (): Promise<Video[]> => {
    const data = await getCloudData();
    return data?.videos || readLocalData().videos || defaultVideos;
  },
  getGallery: async (): Promise<GalleryItem[]> => {
    const data = await getCloudData();
    return data?.gallery || readLocalData().gallery || defaultGallery;
  },
  getProfile: async (): Promise<ProfileData> => {
    const data = await getCloudData();
    return data?.profile || readLocalData().profile || defaultProfile;
  },
  getMessages: async (): Promise<ContactMessage[]> => {
    const data = await getCloudData();
    return data?.messages || readLocalData().messages || [];
  },

  saveProjects: async (data: Project[]) => {
    await saveData({ projects: data });
  },
  saveVideos: async (data: Video[]) => {
    await saveData({ videos: data });
  },
  saveGallery: async (data: GalleryItem[]) => {
    await saveData({ gallery: data });
  },
  saveProfile: async (data: ProfileData) => {
    await saveData({ profile: data });
  },
  saveMessages: async (data: ContactMessage[]) => {
    await saveData({ messages: data });
  },
  addMessage: async (msg: Omit<ContactMessage, "id" | "date">) => {
    const messages = await portfolioData.getMessages();
    const newMsg: ContactMessage = { ...msg, id: Date.now().toString(), date: new Date().toISOString() };
    await portfolioData.saveMessages([newMsg, ...messages]);
  },

  resetAll: async () => {
    await saveData({
      projects: defaultProjects,
      videos: defaultVideos,
      gallery: defaultGallery,
      profile: defaultProfile
    });
  },

  clearAllMedia: async () => {
    const data = (await getCloudData()) || readLocalData();
    
    const projects = (data.projects || defaultProjects) as Project[];
    const gallery = (data.gallery || defaultGallery) as GalleryItem[];
    const videos = (data.videos || defaultVideos) as Video[];
    const profile = (data.profile || defaultProfile) as ProfileData;

    await saveData({
      projects: projects.map(p => ({ ...p, thumbnailUrl: undefined })),
      gallery: gallery.map(g => ({ ...g, imageUrl: undefined })),
      videos: videos.map(v => ({ ...v, localVideoUrl: undefined })),
      profile: { ...profile, avatarUrl: undefined }
    });
  },

  // Storage usage is not applicable for Firebase in the same way, but keeping the signature
  getStorageUsage: () => {
    return { usedKB: 0, usedPct: 0 };
  },
};
