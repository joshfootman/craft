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
      <Dialog.Backdrop className="fixed inset-0 z-10 min-h-dvh bg-black opacity-20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-70" />
      <div className="group/drawer relative z-20">
        <div
          aria-hidden
          className="fixed inset-y-0 right-0 w-3/4 rounded-l-xl border-l bg-orange-500 transition-transform duration-550 ease-[--cubic] group-has-data-ending-style/drawer:translate-x-full group-has-data-starting-style/drawer:translate-x-full sm:max-w-140"
        />
        <div
          aria-hidden
          className="fixed inset-y-0 right-0 w-3/4 rounded-l-xl border-l bg-white transition-transform delay-100 duration-550 ease-[--cubic] group-has-data-ending-style/drawer:translate-x-full group-has-data-ending-style/drawer:delay-0 group-has-data-starting-style/drawer:translate-x-full sm:max-w-140"
        />
        <Dialog.Popup
          className={cn(
            "fixed inset-y-0 right-0 flex w-3/4 flex-col rounded-l-xl border-l bg-neutral-100 transition-transform delay-200 duration-550 ease-[--cubic] data-ending-style:translate-x-full data-ending-style:delay-0 data-starting-style:translate-x-full sm:max-w-140",
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

export function Demo() {
  return (
    <div
      className="flex h-full flex-col items-center justify-center pb-40"
      style={{ "--cubic": "cubic-bezier(0.65, 0.05, 0, 1)" } as React.CSSProperties}
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
