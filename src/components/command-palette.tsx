import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import type { Meta } from "~/types/study";
import { Badge } from "./ui/badge";

export function CommandPaletteContent({
  studies,
  onSelect,
}: {
  studies: Meta[];
  onSelect?: (studyId: string) => void;
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
              value={[study.title, ...study.tags].join(" ")}
              onSelect={() => onSelect?.(study.id)}
            >
              <div className="flex flex-col gap-2">
                <span className="text-sm">{study.title}</span>
                {study.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {study.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function CommandPalette({
  studies,
  open,
  onOpenChange,
}: {
  studies: Meta[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  function handleSelect(studyId: string) {
    onOpenChange(false);
    window.location.href = `/studies/${studyId}`;
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search studies"
      description="Search across all studies by title or tags."
    >
      <CommandPaletteContent studies={studies} onSelect={handleSelect} />
    </CommandDialog>
  );
}
