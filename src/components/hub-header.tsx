import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { Kbd } from "~/components/ui/kbd";
import { CommandPalette } from "~/components/command-palette";
import type { Meta } from "~/types/study";
import { Logo } from "~/assets/logo";

export function HubHeader({ studies }: { studies: Meta[] }) {
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        e.preventDefault();
        setCommandOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <>
      <header className="flex shrink-0 items-center justify-between px-8 pt-8">
        <Logo />
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="flex h-8 w-60 items-center gap-2 rounded-md bg-background px-3 text-sm text-muted-foreground ring-1 ring-border"
          aria-label="Search studies"
        >
          <SearchIcon className="size-4" />
          <span>Search...</span>
          <Kbd className="ml-auto">⌘K</Kbd>
        </button>
      </header>
      <CommandPalette studies={studies} open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
