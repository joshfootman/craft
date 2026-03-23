import { PlusIcon } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

import { cn } from "~/lib/utils";

const Context = React.createContext<{ toggle: boolean; hover: boolean } | null>(null);

function useToggle() {
  const context = React.useContext(Context);

  if (context == null) {
    throw new Error("useToggle must be used within a TextSwapButtonProvider.");
  }

  return context;
}

function TextSwapButton({
  children,
  className,
  toggle,
  ...props
}: React.ComponentProps<"button"> & { toggle: boolean }) {
  const [hover, setHover] = React.useState(false);

  return (
    <Context.Provider value={{ toggle, hover }}>
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
  const { toggle } = useToggle();

  return (
    <span className={cn("grid overflow-hidden", className)} {...props}>
      <motion.span
        key="child-true"
        className="col-span-full row-span-full flex justify-end"
        initial={{ y: 0 }}
        animate={{ y: toggle ? "-100%" : 0 }}
        transition={{
          duration: 0.7,
          delay: toggle ? 0 : 0.2,
          ease: [0.65, 0.01, 0.05, 0.99],
        }}
      >
        {children(true)}
      </motion.span>
      <motion.span
        key="child-false"
        className="col-span-full row-span-full flex justify-end"
        initial={{ y: "100%" }}
        animate={{ y: toggle ? 0 : "100%" }}
        transition={{
          duration: 0.7,
          delay: toggle ? 0.2 : 0,
          ease: [0.65, 0.01, 0.05, 0.99],
        }}
      >
        {children(false)}
      </motion.span>
    </span>
  );
}

function TextSwapButtonIcon({ children, ...props }: React.ComponentProps<typeof motion.div>) {
  const { toggle, hover } = useToggle();

  return (
    <motion.div
      animate={{ rotate: toggle ? 315 : 0 }}
      transition={{ duration: toggle ? 0.6 : 0.3 }}
    >
      <motion.div {...props} animate={{ rotate: hover ? 90 : 0 }} transition={{ duration: 0.2 }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Main() {
  const [toggle, setToggle] = React.useState(false);

  return (
    <div className="flex h-full items-center justify-center pb-40">
      <TextSwapButton toggle={toggle} onClick={() => setToggle((curr) => !curr)}>
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
