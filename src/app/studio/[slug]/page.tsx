import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/project-detail";
import { getProject, studio as list } from "@/data/projects";

// Every page is generated at build time (required for static export).
export function generateStaticParams() {
  return list.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/studio/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.short,
    description: project.summary,
    openGraph: project.cover ? { images: [project.cover.src] } : undefined,
  };
}

export default async function Page(props: PageProps<"/studio/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project || !list.includes(project)) notFound();

  const index = list.indexOf(project);
  const next = list[(index + 1) % list.length];
  return <ProjectDetail project={project} next={next} base="studio" />;
}
