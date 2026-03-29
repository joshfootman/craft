import { PlusIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import React from "react";

import { cn } from "~/lib/utils";

const MAIN_EASING = [0.65, 0.01, 0.05, 0.99] as const;

const Context = React.createContext<{
  active: boolean;
} | null>(null);

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
  type = "button",
  ...props
}: React.ComponentProps<"button"> & { active: boolean }) {
  return (
    <Context.Provider value={{ active }}>
      <button
        className={cn("group/text-swap-button flex cursor-pointer flex-row items-center gap-2", className)}
        type={type}
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
  const reducedMotion = useReducedMotion();

  return (
    <span className={cn("grid overflow-hidden", className)} {...props}>
      <motion.span
        key="child-true"
        className="col-span-full row-span-full flex justify-end"
        initial={{ y: 0 }}
        animate={{ y: active ? "-100%" : 0 }}
        transition={{
          duration: reducedMotion ? 0 : 0.7,
          ease: MAIN_EASING,
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
          duration: reducedMotion ? 0 : 0.7,
          delay: reducedMotion ? 0 : active ? 0.2 : 0,
          ease: MAIN_EASING,
        }}
      >
        {children(false)}
      </motion.span>
    </span>
  );
}

function TextSwapButtonIcon({ children, className, ...props }: React.ComponentProps<typeof motion.div>) {
  const { active } = useTextSwapButton();
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ rotate: active ? 315 : 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.7,
        ease: MAIN_EASING,
      }}
    >
      <motion.div
        {...props}
        className={cn(
          "transition-transform duration-400 ease-[cubic-bezier(0.65,0.05,0,1)] group-hover/text-swap-button:rotate-90 motion-reduce:transition-none motion-reduce:duration-0 motion-reduce:group-hover/text-swap-button:rotate-0",
          className,
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export { TextSwapButton, TextSwapButtonText, TextSwapButtonIcon };

export function Demo() {
  const [isActive, setIsActive] = React.useState(false);

  return (
    <div className="flex h-full items-center justify-center pb-40">
      <TextSwapButton active={isActive} onClick={() => setIsActive((curr) => !curr)}>
        <TextSwapButtonText className="text-6xl">
          {(inactive) => (inactive ? "Menu" : "Close")}
        </TextSwapButtonText>
        <TextSwapButtonIcon>
          <PlusIcon className="size-20 stroke-[1.5]" />
        </TextSwapButtonIcon>
      </TextSwapButton>
    </div>
  );
}
