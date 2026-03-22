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
import type { Meta } from "~/types/study";
import { Badge } from "./ui/badge";

function group_by_category(studies: Meta[]): Map<string, Meta[]> {
  const groups = new Map<string, Meta[]>();
  for (const study of studies) {
    const existing = groups.get(study.category) ?? [];
    existing.push(study);
    groups.set(study.category, existing);
  }
  return groups;
}

export function AppSidebar({
  studies,
  active_study_id,
  on_search_click,
}: {
  studies: Meta[];
  active_study_id: string;
  on_search_click?: () => void;
}) {
  const grouped = group_by_category(studies);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1">
          <span className="text-sm font-semibold tracking-tight">Craft</span>
        </div>
        <button
          type="button"
          onClick={on_search_click}
          className="flex h-8 w-full items-center gap-2 rounded-md bg-background px-3 text-sm text-muted-foreground shadow-none ring-1 ring-border"
          aria-label="Search studies"
        >
          <SearchIcon className="size-4" />
          <span>Search...</span>
          <Kbd className="ml-auto">⌘K</Kbd>
        </button>
      </SidebarHeader>
      <SidebarContent>
        {[...grouped.entries()].map(([category, category_studies]) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel>{category}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {category_studies.map((study) => (
                  <SidebarMenuItem key={study.id}>
                    <SidebarMenuButton
                      isActive={study.id === active_study_id}
                      render={<a href={`/studies/${study.id}`} />}
                      className="h-auto py-2"
                    >
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate text-sm font-medium">{study.title}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {study.description}
                        </span>
                        <span className="truncate">
                          {study.tags.map((tag) => (
                            <Badge variant="outline">{tag}</Badge>
                          ))}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
