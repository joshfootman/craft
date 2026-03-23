import { motion } from "motion/react";
import React from "react";

import { cn } from "~/lib/utils";

const CUSTOM_EASING = [0.65, 0.01, 0.05, 0.99] as const;

const Context = React.createContext<{ active: boolean; hover: boolean } | null>(null);

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
  active,
  ...props
}: React.ComponentProps<"button"> & { active: boolean }) {
  const [hover, setHover] = React.useState(false);

  return (
    <Context.Provider value={{ active, hover }}>
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
  const { active } = useTextSwapButton();

  return (
    <span className={cn("grid overflow-hidden", className)} {...props}>
      <motion.span
        key="child-true"
        className="col-span-full row-span-full flex justify-end"
        initial={{ y: 0 }}
        animate={{ y: active ? "-100%" : 0 }}
        transition={{
          duration: 0.7,
          delay: active ? 0 : 0.2,
          ease: CUSTOM_EASING,
        }}
      >
        {children(true)}
      </motion.span>
      <motion.span
        key="child-false"
        className="col-span-full row-span-full flex justify-end"
        initial={{ y: "100%" }}
        animate={{ y: active ? 0 : "100%" }}
        transition={{
          duration: 0.7,
          delay: active ? 0.2 : 0,
          ease: CUSTOM_EASING,
        }}
      >
        {children(false)}
      </motion.span>
    </span>
  );
}

function TextSwapButtonIcon({ children, ...props }: React.ComponentProps<typeof motion.div>) {
  const { active, hover } = useTextSwapButton();

  return (
    <motion.div
      animate={{ rotate: active ? 315 : 0 }}
      transition={{ duration: active ? 0.6 : 0.3 }}
    >
      <motion.div {...props} animate={{ rotate: hover ? 90 : 0 }} transition={{ duration: 0.2 }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export { TextSwapButton, TextSwapButtonIcon, TextSwapButtonText };
