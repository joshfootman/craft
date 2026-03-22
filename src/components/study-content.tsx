import { useState } from "react";
import { MonitorIcon, TabletIcon, SmartphoneIcon } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { InspirationPopover } from "~/components/inspiration-popover";
import { DEVICE_WIDTHS, type Device } from "~/lib/constants";
import type { Meta, Viewport } from "~/types/study";

function viewport_to_default_device(viewport: Viewport): Device {
  if (viewport === "mobile") return "mobile";
  return "desktop";
}

const DEVICE_ICONS: Record<Device, React.ComponentType<{ className?: string }>> = {
  desktop: MonitorIcon,
  tablet: TabletIcon,
  mobile: SmartphoneIcon,
};

const DEVICE_LIST: Device[] = ["desktop", "tablet", "mobile"];

export function StudyContent({
  meta,
  children,
}: {
  meta: Meta;
  children: React.ReactNode;
}) {
  const [active_device, set_active_device] = useState<Device>(
    viewport_to_default_device(meta.viewport),
  );

  const width = DEVICE_WIDTHS[active_device];
  const frame_style = {
    width: typeof width === "number" ? `${width}px` : width,
    maxWidth: "100%",
  };

  return (
    <div className="flex h-full flex-col" data-theme={meta.theme}>
      <header className="flex h-10 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <span className="text-sm font-medium">{meta.title}</span>
        {meta.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        <div className="ml-auto flex items-center gap-1">
          {DEVICE_LIST.map((device) => {
            const Icon = DEVICE_ICONS[device];
            return (
              <button
                key={device}
                type="button"
                onClick={() => set_active_device(device)}
                aria-label={device}
                aria-pressed={device === active_device}
                className={`rounded p-1 ${
                  device === active_device
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
              </button>
            );
          })}
        </div>
      </header>
      <div className="relative flex flex-1 items-start justify-center overflow-auto p-4">
        <div style={frame_style} className="h-full">
          {children}
        </div>
        <InspirationPopover inspiration={meta.inspiration} />
      </div>
    </div>
  );
}
