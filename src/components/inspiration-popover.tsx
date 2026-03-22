import { BookOpenIcon, ExternalLinkIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

export function InspirationPopover({ inspiration }: { inspiration?: string[] }) {
  if (!inspiration || inspiration.length === 0) return null;

  return (
    <div className="absolute right-4 bottom-4 z-10">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Inspiration sources"
            className="rounded-md border bg-background p-2 text-muted-foreground shadow-sm hover:text-foreground"
          >
            <BookOpenIcon className="size-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Inspiration</span>
            {inspiration.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ExternalLinkIcon className="size-3 shrink-0" />
                <span className="truncate">{url}</span>
              </a>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
