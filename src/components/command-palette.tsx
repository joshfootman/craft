import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import type { Meta } from "~/types/study"
import { Badge } from "./ui/badge"

export function CommandPaletteContent({
  studies,
  on_select,
}: {
  studies: Meta[]
  on_select?: (study_id: string) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Search studies..." />
      <CommandList>
        <CommandEmpty>No studies found.</CommandEmpty>
        <CommandGroup>
          {studies.map((study) => (
            <CommandItem
              key={study.id}
              value={[study.title, ...study.tags, ...study.techniques].join(" ")}
              onSelect={() => on_select?.(study.id)}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm">{study.title}</span>
                {study.tags.length > 0 ? study.tags.map((tag) => <Badge variant="outline">{tag}</Badge>) : null}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export function CommandPalette({
  studies,
  open,
  on_open_change,
}: {
  studies: Meta[]
  open: boolean
  on_open_change: (open: boolean) => void
}) {
  function handle_select(study_id: string) {
    on_open_change(false)
    window.location.href = `/studies/${study_id}`
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={on_open_change}
      title="Search studies"
      description="Search across all studies by title, tags, or techniques."
    >
      <CommandPaletteContent studies={studies} on_select={handle_select} />
    </CommandDialog>
  )
}
