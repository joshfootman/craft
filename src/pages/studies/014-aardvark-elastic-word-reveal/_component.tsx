import { gsap } from "gsap";
import React from "react";

import styles from "./index.module.css";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type ElasticWordRevealHandle = {
  pause: () => void;
  play: () => void;
  restart: () => void;
  reverse: () => void;
  timeline: () => gsap.core.Timeline | null;
};

type ElasticWordRevealProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  as?: "div" | "h1" | "h2" | "h3" | "p" | "span";
  children: string;
  duration?: number;
  stagger?: number;
  trigger?: "in-view" | "manual" | "mount";
};

const ElasticWordReveal = React.forwardRef<ElasticWordRevealHandle, ElasticWordRevealProps>(
  function ElasticWordReveal(
    {
      as: Component = "div",
      children,
      className,
      duration = 0.875,
      stagger = 0.088,
      trigger = "mount",
      ...props
    },
    ref,
  ) {
    const rootRef = React.useRef<HTMLElement | null>(null);
    const timelineRef = React.useRef<gsap.core.Timeline | null>(null);

    React.useImperativeHandle(
      ref,
      () => ({
        pause: () => timelineRef.current?.pause(),
        play: () => timelineRef.current?.play(),
        restart: () => timelineRef.current?.restart(),
        reverse: () => timelineRef.current?.reverse(),
        timeline: () => timelineRef.current,
      }),
      [],
    );

    React.useLayoutEffect(() => {
      const root = rootRef.current;
      if (!root) return;

      const words = Array.from(root.querySelectorAll<HTMLElement>("[data-elastic-word]"));
      const reduceMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

      if (reduceMotion) {
        gsap.set(words, { clearProps: "all" });
        return;
      }

      gsap.set(words, {
        xPercent: 40,
        yPercent: -10,
        scaleX: 0.85,
        scaleY: 0.1,
        rotate: 8,
        opacity: 0,
        transformOrigin: "top left",
        willChange: "transform, opacity",
      });

      const timeline = gsap.timeline({ paused: true });
      timelineRef.current = timeline;

      timeline.to(words, {
        keyframes: {
          "0%": {
            xPercent: 40,
            yPercent: -10,
            scaleX: 0.85,
            scaleY: 0.1,
            rotate: 8,
            opacity: 0,
          },
          "10%": {
            opacity: 1,
          },
          "100%": {
            xPercent: 0,
            yPercent: 0,
            scaleX: 1,
            scaleY: 1,
            rotate: 0,
            opacity: 1,
            ease: "elastic.out(1,0.72)",
          },
        },
        duration,
        stagger,
      });

      let observer: IntersectionObserver | undefined;

      if (trigger === "mount") {
        timeline.play();
      }

      if (trigger === "in-view") {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.isIntersecting) return;
            timeline.play();
            observer?.disconnect();
          },
          { threshold: 0.2 },
        );
        observer.observe(root);
      }

      return () => {
        observer?.disconnect();
        timeline.kill();
        timelineRef.current = null;
        gsap.killTweensOf(words);
        gsap.set(words, { clearProps: "all" });
      };
    }, [children, duration, stagger, trigger]);

    const parts = children.split(/(\s+)/);

    return (
      <Component
        {...props}
        ref={rootRef as React.Ref<never>}
        aria-label={props["aria-label"] ?? children}
        className={[styles.root, className].filter(Boolean).join(" ")}
      >
        <span aria-hidden="true">
          {parts.map((part, index) =>
            /^\s+$/.test(part) ? (
              <React.Fragment key={index}>{part}</React.Fragment>
            ) : (
              <span className={styles.word} data-elastic-word key={index}>
                {part}
              </span>
            ),
          )}
        </span>
      </Component>
    );
  },
);

export { ElasticWordReveal };
export type { ElasticWordRevealHandle, ElasticWordRevealProps };

export function Demo() {
  return (
    <div className="grid h-full min-h-full place-items-center overflow-hidden p-[clamp(1.5rem,5vw,5rem)]">
      <ElasticWordReveal
        as="h1"
        className="max-w-[11ch] pb-20 text-center font-['Archivo',Arial,sans-serif] text-[clamp(3.5rem,10vw,9rem)] leading-[0.82] font-bold tracking-[-0.065em] text-balance text-[#111]"
      >
        Your next great read is waiting
      </ElasticWordReveal>
    </div>
  );
}
