import { PlusIcon } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

import { cn } from "~/lib/utils";

const CUSTOM_EASING = [0.65, 0.01, 0.05, 0.99] as const;

const Context = React.createContext<{ isOpen: boolean; hover: boolean } | null>(null);

function useTextSwapButton() {
  const context = React.useContext(Context);

  if (context == null) {
    throw new Error("useTextSwapButton must be used within a TextSwapButton.");
  }

  return context;
}

function TextSwapButton({
  children,
  className,
  isOpen,
  ...props
}: React.ComponentProps<"button"> & { isOpen: boolean }) {
  const [hover, setHover] = React.useState(false);

  return (
    <Context.Provider value={{ isOpen, hover }}>
      <button
        className={cn("flex cursor-pointer flex-row items-center gap-2", className)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        {...props}
      >
        {children}
      </button>
    </Context.Provider>
  );
}

function TextSwapButtonText({
  children,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  children: (value: boolean) => React.ReactNode;
}) {
  const { isOpen } = useTextSwapButton();

  return (
    <span className={cn("grid overflow-hidden", className)} {...props}>
      <motion.span
        key="child-true"
        className="col-span-full row-span-full flex justify-end"
        initial={{ y: 0 }}
        animate={{ y: isOpen ? "-100%" : 0 }}
        transition={{
          duration: 0.7,
          delay: isOpen ? 0 : 0.2,
          ease: CUSTOM_EASING,
        }}
      >
        {children(true)}
      </motion.span>
      <motion.span
        key="child-false"
        className="col-span-full row-span-full flex justify-end"
        initial={{ y: "100%" }}
        animate={{ y: isOpen ? 0 : "100%" }}
        transition={{
          duration: 0.7,
          delay: isOpen ? 0.2 : 0,
          ease: CUSTOM_EASING,
        }}
      >
        {children(false)}
      </motion.span>
    </span>
  );
}

function TextSwapButtonIcon({ children, ...props }: React.ComponentProps<typeof motion.div>) {
  const { isOpen, hover } = useTextSwapButton();

  return (
    <motion.div
      animate={{ rotate: isOpen ? 315 : 0 }}
      transition={{ duration: isOpen ? 0.6 : 0.3 }}
    >
      <motion.div {...props} animate={{ rotate: hover ? 90 : 0 }} transition={{ duration: 0.2 }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Main() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex h-full items-center justify-center pb-40">
      <TextSwapButton isOpen={isOpen} onClick={() => setIsOpen((curr) => !curr)}>
        <TextSwapButtonText className="text-6xl">
          {(value) => (value ? "Menu" : "Close")}
        </TextSwapButtonText>
        <TextSwapButtonIcon>
          <PlusIcon className="size-20 stroke-[1.5]" />
        </TextSwapButtonIcon>
      </TextSwapButton>
    </div>
  );
}
