import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { StudyContent } from "~/components/study-content";
import { CommandPalette } from "~/components/command-palette";
import type { Meta } from "~/types/study";

export function Shell({
  studies,
  active_study_id,
  meta,
  children,
}: {
  studies: Meta[];
  active_study_id: string;
  meta?: Meta;
  children: React.ReactNode;
}) {
  const [command_open, set_command_open] = useState(false);

  useEffect(() => {
    function handle_keydown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        set_command_open((open) => !open);
      }
    }

    window.addEventListener("keydown", handle_keydown);
    return () => window.removeEventListener("keydown", handle_keydown);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar
        studies={studies}
        active_study_id={active_study_id}
        on_search_click={() => set_command_open(true)}
      />
      <SidebarInset>
        {meta ? <StudyContent meta={meta}>{children}</StudyContent> : children}
      </SidebarInset>
      <CommandPalette studies={studies} open={command_open} on_open_change={set_command_open} />
    </SidebarProvider>
  );
}
