import { AppSidebar } from "~/components/app-sidebar";
import { StudyContent } from "~/components/study-content";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import type { Meta } from "~/types/study";

export function Shell({
  studies,
  active,
  children,
}: {
  studies: Meta[];
  active: Meta;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar studies={studies} activeStudyId={active.id} />
      <SidebarInset>
        <StudyContent meta={active}>{children}</StudyContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
