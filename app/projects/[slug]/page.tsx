import { notFound } from "next/navigation";
import { projects as staticProjects } from "@/data/projects";
import { fetchProjects, fetchProjectBySlug } from "@/lib/projectsService";
import ProjectDetailView from "@/components/ProjectDetailView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";


const aliasMap: Record<string, string> = {
  "project-one": "rotana-media-group",
  "project-two": "ottava-surgical-robotic-system",
  "project-three": "cyber-telemetry-interface",
  "project-four": "kinetic-audio-synthesizer",
  "project-five": "rotana-media-group",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const targetSlug = aliasMap[slug] || slug;
  const p = await fetchProjectBySlug(targetSlug);
  if (!p) return { title: "Project Not Found" };
  return {
    title: `${p.title} | Saransh Chaudhary - Portfolio`,
    description: p.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const targetSlug = aliasMap[slug] || slug;
  const all = await fetchProjects(false);
  const p = await fetchProjectBySlug(targetSlug);

  if (!p) notFound();

  const currentIndex = all.findIndex((item) => item.slug === p.slug);
  const next =
    all.length > 1 && currentIndex >= 0
      ? all[(currentIndex + 1) % all.length]
      : p;

  return <ProjectDetailView project={p} next={next} />;
}
