import { Showcase } from "@/components/showcase";
import { projects } from "@/data/projects";

export default function Home() {
  return <Showcase projects={projects} />;
}
