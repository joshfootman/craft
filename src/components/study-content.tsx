declare const PROJECT_ROOT: string;

import { useCallback, useEffect, useRef, useState } from "react";
import { MonitorIcon, TabletIcon, SmartphoneIcon, RotateCwIcon } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { InspirationPopover } from "~/components/inspiration-popover";
import { DEVICE_WIDTHS, type Device } from "~/lib/constants";
import { Badge } from "~/components/ui/badge";
import type { Meta, Viewport } from "~/types/study";

const DEVICE_ICONS: Record<Device, React.ComponentType<{ className?: string }>> = {
  desktop: MonitorIcon,
  tablet: TabletIcon,
  mobile: SmartphoneIcon,
};

const DEVICE_LIST: Device[] = ["desktop", "tablet", "mobile"];

const PRESET_WIDTHS: Record<Device, number> = {
  mobile: DEVICE_WIDTHS.mobile,
  tablet: DEVICE_WIDTHS.tablet,
  desktop: 0,
};

function defaultWidthForViewport(viewport: Viewport): number {
  if (viewport === "mobile") return PRESET_WIDTHS.mobile;
  return 0;
}

function activePreset(width: number, containerWidth: number): Device | null {
  if (width === containerWidth) return "desktop";
  if (width === PRESET_WIDTHS.tablet) return "tablet";
  if (width === PRESET_WIDTHS.mobile) return "mobile";
  return null;
}

export function StudyContent({ meta, children }: { meta: Meta; children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [frameWidth, setFrameWidth] = useState(() => defaultWidthForViewport(meta.viewport));
  const [remountKey, setRemountKey] = useState(0);

  const measureContainer = useCallback(() => {
    if (containerRef.current) {
      const style = getComputedStyle(containerRef.current);
      const padLeft = parseFloat(style.paddingLeft) || 0;
      const padRight = parseFloat(style.paddingRight) || 0;
      const w = containerRef.current.clientWidth - padLeft - padRight;
      setContainerWidth((prev) => {
        if (prev === 0 && frameWidth === 0) {
          setFrameWidth(w);
        } else if (frameWidth === prev && prev !== 0) {
          setFrameWidth(w);
        }
        return w;
      });
    }
  }, [frameWidth]);

  useEffect(() => {
    measureContainer();

    if (!containerRef.current) return;
    const observer = new ResizeObserver(measureContainer);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [measureContainer]);

  const measured = containerWidth > 0;
  const effectiveWidth = frameWidth === 0 ? containerWidth : frameWidth;
  const displayWidth = effectiveWidth || 0;
  const preset = activePreset(displayWidth, containerWidth);
  const isFullWidth = measured && displayWidth >= containerWidth;

  const dragStartRef = useRef<{ startX: number; startWidth: number } | null>(null);

  function handlePresetClick(device: Device) {
    if (device === "desktop") {
      setFrameWidth(containerWidth);
    } else {
      setFrameWidth(PRESET_WIDTHS[device]);
    }
  }

  function handleDragStart(e: React.PointerEvent) {
    e.preventDefault();
    dragStartRef.current = { startX: e.clientX, startWidth: displayWidth };

    function onMove(ev: PointerEvent) {
      if (!dragStartRef.current) return;
      const delta = ev.clientX - dragStartRef.current.startX;
      const newWidth = Math.round(dragStartRef.current.startWidth + delta);
      const clamped = Math.max(PRESET_WIDTHS.mobile, Math.min(newWidth, containerWidth));
      setFrameWidth(clamped);
    }

    function onUp() {
      dragStartRef.current = null;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    }

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }

  return (
    <div className="flex h-full flex-col" data-theme={meta.theme}>
      <header className="flex shrink-0 items-center gap-2 border-b px-4 py-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="my-1" />
        {import.meta.env.DEV ? (
          <a
            href={`vscode://file/${PROJECT_ROOT}/src/pages/studies/${meta.id}/_component.tsx`}
            className="text-sm font-medium hover:underline"
          >
            {meta.title}
          </a>
        ) : (
          <span className="text-sm font-medium">{meta.title}</span>
        )}
        {meta.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
        <div className="ml-auto flex items-center gap-1">
          {DEVICE_LIST.map((device) => {
            const Icon = DEVICE_ICONS[device];
            return (
              <button
                key={device}
                type="button"
                onClick={() => handlePresetClick(device)}
                aria-label={device}
                aria-pressed={preset === device}
                className={`rounded p-1 ${
                  preset === device
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
              </button>
            );
          })}
          <Separator orientation="vertical" className="my-0.5" />
          <button
            type="button"
            onClick={() => setRemountKey((k) => k + 1)}
            aria-label="reload"
            className="rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <RotateCwIcon className="size-4" />
          </button>
        </div>
      </header>
      <div
        ref={containerRef}
        className="relative flex flex-1 items-start justify-start overflow-auto bg-neutral-100"
      >
        <div
          className="relative h-full overflow-x-hidden bg-white"
          style={{
            width: !measured && frameWidth === 0 ? "100%" : `${displayWidth}px`,
            maxWidth: "100%",
          }}
        >
          <div key={remountKey} className="@container h-full">
            {children}
          </div>
          <div
            data-testid="resize-handle"
            onPointerDown={handleDragStart}
            style={{ opacity: isFullWidth ? 0 : 1 }}
            className={`absolute top-0 -right-3 flex h-full w-6 cursor-col-resize items-center justify-center transition-opacity ${
              isFullWidth ? "hover:opacity-100" : ""
            }`}
          >
            <div className="h-8 w-1.5 rounded-full bg-border" />
          </div>
        </div>
        <InspirationPopover inspiration={meta.inspiration} />
      </div>
    </div>
  );
}
