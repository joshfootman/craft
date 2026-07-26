import { gsap } from "gsap";
import React from "react";

import styles from "./index.module.css";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type HandwrittenCharacterRevealProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  as?: "div" | "h1" | "h2" | "h3" | "p" | "span";
  children: string;
};

function HandwrittenCharacterReveal({
  as: Component = "div",
  children,
  className,
  ...props
}: HandwrittenCharacterRevealProps) {
  const rootRef = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const characters = Array.from(
      root.querySelectorAll<HTMLElement>("[data-handwritten-character]"),
    );

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      gsap.set(characters, { clearProps: "all" });
      return;
    }

    gsap.set(characters, {
      display: "inline-block",
      opacity: 0,
      rotate: 22,
      x: "-0.25em",
      y: "0.5em",
    });

    const timeline = gsap.timeline();

    timeline.to(characters, {
      opacity: 1,
      rotate: 0,
      x: "0em",
      y: "0em",
      ease: "elastic.out(1,0.75)",
      duration: 0.75,
      stagger: 0.016,
    });

    return () => {
      timeline.kill();
      gsap.killTweensOf(characters);
      gsap.set(characters, { clearProps: "all" });
    };
  }, [children]);

  const parts = children.split(/(\s+)/);

  return (
    <Component
      {...props}
      ref={rootRef as React.Ref<never>}
      aria-label={props["aria-label"] ?? children}
      className={[styles.root, className].filter(Boolean).join(" ")}
    >
      <span aria-hidden="true">
        {parts.map((part, partIndex) =>
          /^\s+$/.test(part) ? (
            <React.Fragment key={partIndex}>{part}</React.Fragment>
          ) : (
            <span className={styles.word} key={partIndex}>
              {Array.from(part).map((character, characterIndex) => (
                <span
                  className={styles.character}
                  data-handwritten-character
                  key={`${partIndex}-${characterIndex}`}
                >
                  {character}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </Component>
  );
}

export { HandwrittenCharacterReveal };
export type { HandwrittenCharacterRevealProps };

export function Demo() {
  return (
    <div className="grid h-full min-h-full place-items-center overflow-hidden px-6 py-12">
      <HandwrittenCharacterReveal
        as="p"
        className="max-w-4xl pb-20 text-center font-['Caveat',cursive] text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.82] font-bold tracking-[-0.025em] text-[#111]"
      >
        Shipping to the USA and Canada
      </HandwrittenCharacterReveal>
    </div>
  );
}
