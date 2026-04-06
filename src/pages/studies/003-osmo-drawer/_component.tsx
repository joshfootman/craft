import { Dialog } from "@base-ui/react/dialog";
import type React from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

function Drawer(props: React.ComponentProps<typeof Dialog.Root>) {
  return <Dialog.Root {...props} />;
}

function DrawerTrigger(props: React.ComponentProps<typeof Dialog.Trigger>) {
  return <Dialog.Trigger {...props} />;
}

function DrawerMeta({
  title,
  description,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & { title: string; description: string }) {
  return (
    <div className="sr-only" {...props}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{description}</Dialog.Description>
    </div>
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Dialog.Popup>) {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-10 min-h-dvh bg-[#13131366] transition-opacity duration-700 ease-(--cubic-main) data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute motion-reduce:transition-none motion-reduce:duration-0" />
      <div className="group/drawer relative z-20">
        <div
          aria-hidden
          className="fixed inset-y-0 right-0 w-full rounded-none border-l bg-orange-500 transition-transform duration-575 ease-(--cubic-main) will-change-transform group-has-data-ending-style/drawer:translate-x-[120%] group-has-data-starting-style/drawer:translate-x-[101%] motion-reduce:transition-none motion-reduce:duration-0 md:w-[35em] md:rounded-l-[1.25em]"
        />
        <div
          aria-hidden
          className="fixed inset-y-0 right-0 w-full rounded-none border-l bg-white transition-transform delay-[120ms] duration-575 ease-(--cubic-main) will-change-transform group-has-data-ending-style/drawer:translate-x-[120%] group-has-data-ending-style/drawer:delay-0 group-has-data-starting-style/drawer:translate-x-[101%] motion-reduce:transition-none motion-reduce:delay-0 motion-reduce:duration-0 md:w-[35em] md:rounded-l-[1.25em]"
        />
        <Dialog.Popup
          className={cn(
            "fixed inset-y-0 right-0 flex w-full flex-col overflow-y-auto rounded-none border-l bg-neutral-200 transition-transform delay-[240ms] duration-575 ease-(--cubic-main) will-change-transform data-ending-style:translate-x-[120%] data-ending-style:delay-0 data-starting-style:translate-x-[101%] motion-reduce:transition-none motion-reduce:delay-0 motion-reduce:duration-0 md:w-[35em] md:rounded-l-[1.25em]",
            className,
          )}
          {...props}
        >
          {children}
        </Dialog.Popup>
      </div>
    </Dialog.Portal>
  );
}

export { Drawer, DrawerTrigger, DrawerContent, DrawerMeta };

export function Demo() {
  return (
    <div
      className="flex h-full flex-col items-center justify-center pb-40"
      style={{ "--cubic-main": "cubic-bezier(0.65, 0.01, 0.05, 0.99)" } as React.CSSProperties}
    >
      <Drawer>
        <DrawerTrigger render={<Button variant="outline" />}>Menu</DrawerTrigger>
        <DrawerContent>
          <DrawerMeta title="Menu" description="Navigation and Social links" />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
