import { useCallback, useEffect, useRef, useState } from "react"
import { MonitorIcon, TabletIcon, SmartphoneIcon, RotateCwIcon } from "lucide-react"
import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { InspirationPopover } from "~/components/inspiration-popover"
import { DEVICE_WIDTHS, type Device } from "~/lib/constants"
import type { Meta, Viewport } from "~/types/study"

const DEVICE_ICONS: Record<Device, React.ComponentType<{ className?: string }>> = {
  desktop: MonitorIcon,
  tablet: TabletIcon,
  mobile: SmartphoneIcon,
}

const DEVICE_LIST: Device[] = ["desktop", "tablet", "mobile"]

const PRESET_WIDTHS: Record<Device, number> = {
  mobile: DEVICE_WIDTHS.mobile as number,
  tablet: DEVICE_WIDTHS.tablet as number,
  desktop: 0, // placeholder, replaced by container width
}

function default_width_for_viewport(viewport: Viewport): number {
  if (viewport === "mobile") return PRESET_WIDTHS.mobile
  return 0 // will be replaced by container width
}

function active_preset(width: number, container_width: number): Device | null {
  if (width === container_width) return "desktop"
  if (width === PRESET_WIDTHS.tablet) return "tablet"
  if (width === PRESET_WIDTHS.mobile) return "mobile"
  return null
}

export function StudyContent({ meta, children }: { meta: Meta; children: React.ReactNode }) {
  const container_ref = useRef<HTMLDivElement>(null)
  const [container_width, set_container_width] = useState(0)
  const [frame_width, set_frame_width] = useState(() => default_width_for_viewport(meta.viewport))
  const [remount_key, set_remount_key] = useState(0)

  const measure_container = useCallback(() => {
    if (container_ref.current) {
      const style = getComputedStyle(container_ref.current)
      const pad_left = parseFloat(style.paddingLeft) || 0
      const pad_right = parseFloat(style.paddingRight) || 0
      const w = container_ref.current.clientWidth - pad_left - pad_right
      set_container_width((prev) => {
        if (prev === 0 && frame_width === 0) {
          // first measurement — set frame to container width if desktop default
          set_frame_width(w)
        } else if (frame_width === prev && prev !== 0) {
          // frame was tracking container width (desktop), keep it in sync
          set_frame_width(w)
        }
        return w
      })
    }
  }, [frame_width])

  useEffect(() => {
    measure_container()

    if (!container_ref.current) return
    const observer = new ResizeObserver(measure_container)
    observer.observe(container_ref.current)
    return () => observer.disconnect()
  }, [measure_container])

  const effective_width = frame_width === 0 ? container_width : frame_width
  const display_width = effective_width || 0
  const preset = active_preset(display_width, container_width)
  const is_full_width = container_width > 0 && display_width >= container_width

  const drag_start_ref = useRef<{ start_x: number; start_width: number } | null>(null)

  function handle_preset_click(device: Device) {
    if (device === "desktop") {
      set_frame_width(container_width)
    } else {
      set_frame_width(PRESET_WIDTHS[device])
    }
  }

  function handle_drag_start(e: React.PointerEvent) {
    e.preventDefault()
    drag_start_ref.current = { start_x: e.clientX, start_width: display_width }

    function on_move(ev: PointerEvent) {
      if (!drag_start_ref.current) return
      const delta = ev.clientX - drag_start_ref.current.start_x
      const new_width = Math.round(drag_start_ref.current.start_width + delta)
      const clamped = Math.max(PRESET_WIDTHS.mobile, Math.min(new_width, container_width))
      set_frame_width(clamped)
    }

    function on_up() {
      drag_start_ref.current = null
      document.removeEventListener("pointermove", on_move)
      document.removeEventListener("pointerup", on_up)
    }

    document.addEventListener("pointermove", on_move)
    document.addEventListener("pointerup", on_up)
  }

  return (
    <div className="flex h-full flex-col" data-theme={meta.theme}>
      <header className="flex h-10 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="my-2" />
        <span className="text-sm font-medium">{meta.title}</span>
        {meta.tags.map((tag) => (
          <span key={tag} className="text-xs text-muted-foreground">
            {tag}
          </span>
        ))}
        <div className="ml-auto flex items-center gap-1">
          {DEVICE_LIST.map((device) => {
            const Icon = DEVICE_ICONS[device]
            return (
              <button
                key={device}
                type="button"
                onClick={() => handle_preset_click(device)}
                aria-label={device}
                aria-pressed={preset === device}
                className={`rounded p-1 ${
                  preset === device ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
              </button>
            )
          })}
          <Separator orientation="vertical" className="mx-1 my-2" />
          <button
            type="button"
            onClick={() => set_remount_key((k) => k + 1)}
            aria-label="reload"
            className="rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <RotateCwIcon className="size-4" />
          </button>
        </div>
      </header>
      <div ref={container_ref} className="relative flex flex-1 items-start justify-start overflow-auto p-4">
        <div className="relative h-full" style={{ width: `${display_width}px`, maxWidth: "100%" }}>
          <div key={remount_key} className="h-full">
            {children}
          </div>
          <div
            data-testid="resize-handle"
            onPointerDown={handle_drag_start}
            style={{ opacity: is_full_width ? 0 : 1 }}
            className={`absolute top-0 -right-3 flex h-full w-6 cursor-col-resize items-center justify-center transition-opacity ${
              is_full_width ? "hover:opacity-100" : ""
            }`}
          >
            <div className="h-8 w-1.5 rounded-full bg-border" />
          </div>
        </div>
        <InspirationPopover inspiration={meta.inspiration} />
      </div>
    </div>
  )
}
