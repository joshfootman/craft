import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import { SearchIcon } from "lucide-react";
import { Kbd } from "~/components/ui/kbd";
import { Badge } from "~/components/ui/badge";
import type { Meta } from "~/types/study";

export function AppSidebar({
  studies,
  active_study_id,
  on_search_click,
}: {
  studies: Meta[];
  active_study_id: string;
  on_search_click?: () => void;
}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1">
          <a href="/" className="text-sm font-semibold tracking-tight">
            Craft
          </a>
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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {studies.map((study) => (
                <SidebarMenuItem key={study.id}>
                  <SidebarMenuButton
                    isActive={study.id === active_study_id}
                    render={<a href={`/studies/${study.id}`} />}
                    className="h-auto py-2"
                  >
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="line-clamp-2 text-sm font-medium">{study.title}</span>
                      <span className="truncate text-xs text-muted-foreground">
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
                      {study.category !== "General" && (
                        <Badge variant="secondary" className="w-fit">
                          {study.category}
                        </Badge>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
