import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { StudyContent } from "~/components/study-content";
import { CommandPalette } from "~/components/command-palette";
import type { Meta } from "~/types/study";

export function Shell({
  studies,
  activeStudyId,
  meta,
  children,
}: {
  studies: Meta[];
  activeStudyId: string;
  meta?: Meta;
  children: React.ReactNode;
}) {
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        e.preventDefault();
        setCommandOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar
        studies={studies}
        activeStudyId={activeStudyId}
        onSearchClick={() => setCommandOpen(true)}
      />
      <SidebarInset>
        {meta ? <StudyContent meta={meta}>{children}</StudyContent> : children}
      </SidebarInset>
      <CommandPalette studies={studies} open={commandOpen} onOpenChange={setCommandOpen} />
    </SidebarProvider>
  );
}
