import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const baseUrl = "https://saransh.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const mainRoutes = ["", "/projects", "/github", "/videos", "/gallery", "/profile", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7
  }));

  return [...mainRoutes, ...projectRoutes];
}
