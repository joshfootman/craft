import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { Kbd } from "~/components/ui/kbd";
import { CommandPalette } from "~/components/command-palette";
import type { Meta } from "~/types/study";

export function HubHeader({ studies }: { studies: Meta[] }) {
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
    <>
      <header className="flex h-12 shrink-0 items-center justify-between border-b px-8">
        <span className="text-sm font-semibold tracking-tight">Craft</span>
        <button
          type="button"
          onClick={() => set_command_open(true)}
          className="flex h-8 w-64 items-center gap-2 rounded-md bg-background px-3 text-sm text-muted-foreground ring-1 ring-border"
          aria-label="Search studies"
        >
          <SearchIcon className="size-4" />
          <span>Search...</span>
          <Kbd className="ml-auto">⌘K</Kbd>
        </button>
      </header>
      <CommandPalette studies={studies} open={command_open} on_open_change={set_command_open} />
    </>
  );
}
