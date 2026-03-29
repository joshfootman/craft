import { CornerDownLeftIcon, SearchIcon } from "lucide-react";
import React from "react";
import { groupStudies } from "~/lib/studies";
import { cn } from "~/lib/utils";
import type { Meta } from "~/types/study";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Kbd } from "./ui/kbd";

const useMutationObserver = (
  ref: React.RefObject<HTMLElement | null>,
  callback: MutationCallback,
  options: MutationObserverInit = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  },
) => {
  React.useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(callback);
      observer.observe(ref.current, options);
      return () => observer.disconnect();
    }
  }, [ref, callback, options]);
};

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none flex h-5 items-center justify-center gap-1 rounded border bg-background px-1 font-sans text-[0.7rem] font-medium text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    />
  );
}

function CommandMenuItem({
  children,
  className,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onHighlight?: () => void;
  "data-selected"?: string;
  "aria-selected"?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onHighlight?.();
      }
    });
  });

  return (
    <CommandItem
      ref={ref}
      className={cn(
        "h-9 rounded-md border border-transparent px-3! font-medium data-[selected=true]:border-input data-[selected=true]:bg-input/50",
        className,
      )}
      {...props}
    >
      {children}
    </CommandItem>
  );
}

export function CommandMenu({
  studies,
  ...props
}: React.ComponentProps<typeof Dialog> & { studies: Meta[] }) {
  const [open, setOpen] = React.useState(false);
  const { breakdowns, standalone } = groupStudies(studies);
  const commandGroups: Array<[string, Meta[]]> = [...breakdowns.entries()];

  if (standalone.length > 0) {
    commandGroups.push(["General", standalone]);
  }

  const commandFilter = React.useCallback(
    (value: string, searchValue: string, keywords?: string[]) => {
      const extendValue = value + " " + (keywords?.join(" ") || "");
      if (extendValue.toLowerCase().includes(searchValue.toLowerCase())) {
        return 1;
      }
      return 0;
    },
    [],
  );

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="relative h-8 w-full justify-start rounded-lg pl-3 font-normal text-foreground shadow-none hover:bg-muted/50 @xl:w-64"
            onClick={() => setOpen(true)}
          >
            <SearchIcon className="size-3.5" />
            <span className="hidden xl:inline-flex">Search studies...</span>
            <span className="inline-flex xl:hidden">Search...</span>
            <Kbd className="ml-auto">⌘K</Kbd>
          </Button>
        }
      ></DialogTrigger>
      <DialogContent
        className="rounded-xl border-none bg-clip-padding p-2 pb-11"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search studies...</DialogTitle>
          <DialogDescription>Search for a study...</DialogDescription>
        </DialogHeader>
        <Command
          className="rounded-none bg-transparent p-0 **:data-[slot=input-group]:h-9! **:data-[slot=input-group]:rounded-md **:data-[slot=input-group]:border **:data-[slot=input-group]:border-input"
          filter={commandFilter}
        >
          <CommandInput placeholder="Search studies..." />
          <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
            <CommandEmpty className="py-12 text-center text-sm text-muted-foreground">
              No results found.
            </CommandEmpty>
            {commandGroups.map(([category, categoryStudies]) => (
              <CommandGroup
                key={category}
                heading={category}
                className="p-0! **:[[cmdk-group-heading]]:scroll-mt-16 **:[[cmdk-group-heading]]:p-3! **:[[cmdk-group-heading]]:pb-1!"
              >
                {categoryStudies.map((study) => (
                  <CommandMenuItem
                    key={study.id}
                    value={study.title}
                    keywords={[
                      "study",
                      study.category,
                      study.description,
                      ...study.tags,
                      study.title.toLowerCase(),
                    ]}
                    onSelect={() => {
                      window.location.href = `/studies/${study.id}`;
                    }}
                    className="flex justify-between"
                  >
                    {study.title}
                    <span className="flex flex-row gap-2">
                      {study.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
        <div className="text-muted-foreground-neutral-700-800 absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <CommandMenuKbd>
              <CornerDownLeftIcon />
            </CommandMenuKbd>{" "}
            Go to Study
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
