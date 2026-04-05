import { Logo } from "~/assets/logo";
import { Badge } from "~/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import { groupStudies } from "~/lib/studies";
import type { Meta } from "~/types/study";
import { CommandMenu } from "./command-menu";

function StudyList({ studies, activeStudyId }: { studies: Meta[]; activeStudyId: string }) {
  return (
    <SidebarMenu>
      {studies.map((study) => (
        <SidebarMenuItem key={study.id}>
          <SidebarMenuButton
            isActive={study.id === activeStudyId}
            render={<a href={`/studies/${study.id}`} />}
            className="h-auto py-2"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-sm font-medium">{study.title}</span>
              <span className="line-clamp-2 min-h-8 text-xs leading-4 text-muted-foreground">
                {study.description}
              </span>
              {study.tags.length > 0 && (
                <span className="flex gap-1">
                  {study.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {study.tags.length > 2 && (
                    <Badge variant="outline">+{study.tags.length - 2}</Badge>
                  )}
                </span>
              )}
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function AppSidebar({ studies, activeStudyId }: { studies: Meta[]; activeStudyId: string }) {
  const { breakdowns, standalone } = groupStudies(studies);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1">
          <a href="/" className="text-md font-semibold" aria-label="Craft logo">
            <Logo />
          </a>
        </div>
        <CommandMenu studies={studies} />
      </SidebarHeader>
      <SidebarContent>
        {Array.from(breakdowns.entries()).map(([category, categoryStudies]) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel>{category}</SidebarGroupLabel>
            <SidebarGroupContent>
              <StudyList studies={categoryStudies} activeStudyId={activeStudyId} />
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        {standalone.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>General</SidebarGroupLabel>
            <SidebarGroupContent>
              <StudyList studies={standalone} activeStudyId={activeStudyId} />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
