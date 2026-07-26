import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { gsap } from "gsap";
import { ArrowUpRightIcon } from "lucide-react";
import React from "react";

import { cn } from "~/lib/utils";

import styles from "./index.module.css";

const HOVER_MEDIA_QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

type ElasticTextButtonProps = Omit<ButtonPrimitive.Props, "children"> & {
  children: string;
  endAdornment?: React.ReactNode;
  stagger?: "forward" | "reverse";
};

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

function ElasticTextButton({
  children,
  className,
  endAdornment,
  ref,
  stagger = "forward",
  type = "button",
  ...props
}: ElasticTextButtonProps) {
  const rootRef = React.useRef<HTMLElement | null>(null);

  const mergedRef = React.useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node;
      setRef(ref, node);
    },
    [ref],
  );

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const characters = Array.from(root.querySelectorAll<HTMLElement>("[data-elastic-character]"));
    const targets = stagger === "reverse" ? characters.toReversed() : characters;
    const media = gsap.matchMedia();

    media.add(HOVER_MEDIA_QUERY, () => {
      gsap.set(targets, {
        display: "inline-block",
        transformOrigin: "center center",
        willChange: "transform",
      });

      const timeline = gsap.timeline({ paused: true });

      timeline.to(targets, {
        keyframes: {
          "0%": {
            yPercent: 0,
            scaleY: 1,
            rotate: 0,
          },
          "20%": {
            yPercent: 55,
            scaleY: 0.3,
            rotate: 17,
            ease: "power2.in",
          },
          "100%": {
            yPercent: 0,
            scaleY: 1,
            rotate: 0,
            ease: "elastic.out(1,0.4)",
          },
        },
        duration: 0.725,
        stagger: {
          amount: 0.225,
        },
      });

      const settle = () => {
        timeline.pause();
        gsap.to(targets, {
          yPercent: 0,
          scaleY: 1,
          rotate: 0,
          duration: 0.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const animate = () => timeline.restart();
      const animateFocus = () => {
        if (root.matches(":focus-visible")) animate();
      };
      const settleFocus = () => {
        if (!root.matches(":hover")) settle();
      };

      root.addEventListener("mouseenter", animate);
      root.addEventListener("mouseleave", settle);
      root.addEventListener("focusin", animateFocus);
      root.addEventListener("focusout", settleFocus);

      return () => {
        root.removeEventListener("mouseenter", animate);
        root.removeEventListener("mouseleave", settle);
        root.removeEventListener("focusin", animateFocus);
        root.removeEventListener("focusout", settleFocus);
        timeline.kill();
        gsap.killTweensOf(targets);
        gsap.set(targets, { clearProps: "all" });
      };
    });

    return () => media.revert();
  }, [children, stagger]);

  return (
    <ButtonPrimitive
      {...props}
      ref={mergedRef}
      type={type}
      aria-label={props["aria-label"] ?? children}
      className={cn(
        styles.root,
        "group relative inline-flex min-h-10 cursor-pointer items-stretch rounded-[0.4rem] font-semibold tracking-[-0.024em] text-white antialiased outline-none select-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      <span className={cn(styles.segment, styles.textSegment)} data-elastic-segment="text">
        <span className={styles.surface} />
        <span className="relative col-start-1 row-start-1 flex items-center px-4 py-2.5">
          <span aria-hidden="true" className="whitespace-pre">
            {Array.from(children).map((character, index) =>
              character === " " ? (
                <span key={index}> </span>
              ) : (
                <span key={index} data-elastic-character>
                  {character}
                </span>
              ),
            )}
          </span>
        </span>
      </span>

      {endAdornment ? (
        <span
          aria-hidden="true"
          className={cn(styles.segment, styles.iconSegment, "-ml-px aspect-square min-h-10")}
          data-elastic-segment="icon"
        >
          <span className={styles.surface} />
          <span className="relative col-start-1 row-start-1 grid place-items-center">
            {endAdornment}
          </span>
        </span>
      ) : null}
    </ButtonPrimitive>
  );
}

export { ElasticTextButton };

export function Demo() {
  return (
    <div
      className="flex h-full items-center justify-center px-6 pb-40"
      style={{ fontFamily: "Archivo, Arial, sans-serif" }}
    >
      <ElasticTextButton
        render={<a href="#elastic-text-button" />}
        endAdornment={<ArrowUpRightIcon className="size-3 stroke-[2.25]" />}
      >
        Explore books
      </ElasticTextButton>
    </div>
  );
}
