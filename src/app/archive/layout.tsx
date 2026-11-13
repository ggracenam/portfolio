import { ArchiveBar } from "@/components/archive-bar";

export default function ArchiveLayout({ children }: LayoutProps<"/archive">) {
  return (
    <>
      {children}
      <ArchiveBar />
    </>
  );
}
