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
import { SearchIcon } from "lucide-react";
import { Kbd } from "~/components/ui/kbd";
import { Badge } from "~/components/ui/badge";
import { groupStudies } from "~/lib/studies";
import type { Meta } from "~/types/study";
import { Logo } from "~/assets/logo";

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
              <span className="line-clamp-2 text-xs text-muted-foreground">
                {study.description}
              </span>
              {study.tags.length > 0 && (
                <span className="flex flex-wrap gap-1">
                  {study.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </span>
              )}
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function AppSidebar({
  studies,
  activeStudyId,
  onSearchClick,
}: {
  studies: Meta[];
  activeStudyId: string;
  onSearchClick?: () => void;
}) {
  const { breakdowns, standalone } = groupStudies(studies);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1">
          <a href="/" className="text-md font-semibold" aria-label="Craft logo">
            <Logo />
          </a>
        </div>
        <button
          type="button"
          onClick={onSearchClick}
          className="flex h-8 w-full items-center gap-2 rounded-md bg-background px-3 text-sm text-muted-foreground shadow-none ring-1 ring-border"
          aria-label="Search studies"
        >
          <SearchIcon className="size-4" />
          <span>Search...</span>
          <Kbd className="ml-auto">⌘K</Kbd>
        </button>
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
