import { gsap } from "gsap";
import React from "react";

import stepOneImage from "./01-step-illustration.webp";
import stepTwoImage from "./02-step-illustration.webp";
import stepThreeImage from "./03-step-illustration.webp";
import stepFourImage from "./04-step-illustration.webp";
import styles from "./index.module.css";

const INTERACTION_QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

const cards = [
  {
    color: styles.cyan,
    image: stepOneImage.src,
    imageAlt: "A reader holding a calendar",
    step: "Step #1",
    title: "Explore our books",
    copy: "The first of every month we reveal 6-7 new books. Follow us on socials to keep an eye on any hints we may post.",
  },
  {
    color: styles.pink,
    image: stepTwoImage.src,
    imageAlt: "A reader relaxing with a book",
    step: "Step #2",
    title: "Build your box",
    copy: "Members can order up to 3 books per box. At least one title must be from the current month's selections.",
  },
  {
    color: styles.yellow,
    image: stepThreeImage.src,
    imageAlt: "Books being packed into a box",
    step: "Step #3",
    title: "Check your doorstop",
    copy: "Your box is delivered right to your doorstep. This is the best excuse to cancel your Friday night plans.",
  },
  {
    color: styles.periwinkle,
    image: stepFourImage.src,
    imageAlt: "Readers discussing books",
    step: "Step #4",
    title: "Share your reads",
    copy: "Share your box and tag us @aardvarkbook or participate in the Club discussions in-app!",
  },
] as const;

type EntranceTrigger = "in-view" | "mount";

type ReactiveCardStackProps = React.HTMLAttributes<HTMLDivElement> & {
  activeScale?: number;
  disabled?: boolean;
  displacement?: number;
  ease?: string;
  entranceDuration?: number;
  entranceStagger?: number;
  entranceTrigger?: EntranceTrigger;
  interactionDuration?: number;
  onActiveIndexChange?: (index: number | null) => void;
  seed?: number;
};

type ReactiveCardProps = React.ComponentPropsWithoutRef<"article"> & {
  wrapperClassName?: string;
};

function createSeededRandom(seed: number) {
  let value = seed;

  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function ReactiveCard({
  children,
  className,
  wrapperClassName,
  ...props
}: ReactiveCardProps) {
  return (
    <div
      className={[styles.item, wrapperClassName].filter(Boolean).join(" ")}
      data-reactive-card-item
    >
      <article
        {...props}
        className={[styles.card, className].filter(Boolean).join(" ")}
        data-reactive-card-target
      >
        {children}
      </article>
    </div>
  );
}

function ReactiveCardStackRoot({
  activeScale = 1.075,
  children,
  className,
  disabled = false,
  displacement = 45,
  ease = "elastic.out(1, 0.75)",
  entranceDuration = 1.05,
  entranceStagger = 0.088,
  entranceTrigger = "in-view",
  interactionDuration = 0.85,
  onActiveIndexChange,
  seed = 17,
  ...props
}: ReactiveCardStackProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const onActiveIndexChangeRef = React.useRef(onActiveIndexChange);
  onActiveIndexChangeRef.current = onActiveIndexChange;

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = gsap.utils.toArray<HTMLElement>(
      "[data-reactive-card-item]",
      root,
    );
    const cardTargets = gsap.utils.toArray<HTMLElement>(
      "[data-reactive-card-target]",
      root,
    );
    if (disabled || items.length === 0) return;

    const randomByIndex = items.map((_, index) =>
      createSeededRandom(seed + index),
    );
    const media = gsap.matchMedia();

    const randomRestTransform = (index: number, rotationRange = 15) => {
      const random = randomByIndex[index];

      return {
        xPercent: (random() - 0.5) * 10,
        yPercent: (random() - 0.5) * 10,
        rotation: (random() - 0.5) * rotationRange,
      };
    };

    items.forEach((item, index) => {
      gsap.set(item, randomRestTransform(index));
    });

    media.add(MOTION_QUERY, () => {
      let entrance: gsap.core.Tween | null = null;

      const playEntrance = () => {
        entrance = gsap.from(items, {
          rotation: (randomByIndex[0]() - 0.5) * 15,
          yPercent: "+=150",
          duration: entranceDuration,
          ease,
          stagger: entranceStagger,
        });
      };

      if (entranceTrigger === "mount") {
        playEntrance();
        return () => entrance?.kill();
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;

          observer.disconnect();
          playEntrance();
        },
        { rootMargin: "0px 0px -15% 0px" },
      );

      observer.observe(root);

      return () => {
        observer.disconnect();
        entrance?.kill();
      };
    });

    media.add(INTERACTION_QUERY, () => {
      let activeIndex = -1;
      let bounds = root.getBoundingClientRect();

      const updateBounds = () => {
        bounds = root.getBoundingClientRect();
      };

      const resizeObserver = new ResizeObserver(updateBounds);
      resizeObserver.observe(root);

      const resetCard = (index: number) => {
        gsap.to(items[index], {
          ...randomRestTransform(index, 20),
          scale: 1,
          duration: interactionDuration,
          ease,
          overwrite: "auto",
        });
      };

      const activateCard = (index: number) => {
        gsap.to(items[index], {
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          scale: activeScale,
          duration: interactionDuration,
          ease,
          overwrite: "auto",
        });

        cardTargets.forEach((target, targetIndex) => {
          gsap.to(target, {
            xPercent:
              targetIndex === index
                ? 0
                : displacement / (targetIndex - index),
            duration: interactionDuration,
            ease,
            overwrite: "auto",
          });
        });
      };

      const handlePointerMove = (event: MouseEvent) => {
        const percentage = (event.clientX - bounds.left) / bounds.width;
        const nextIndex = Math.min(
          items.length - 1,
          Math.max(0, Math.ceil(percentage * items.length) - 1),
        );

        if (nextIndex === activeIndex) return;
        if (activeIndex >= 0) resetCard(activeIndex);

        activeIndex = nextIndex;
        activateCard(activeIndex);
        onActiveIndexChangeRef.current?.(activeIndex);
      };

      const handlePointerLeave = () => {
        if (activeIndex >= 0) resetCard(activeIndex);
        activeIndex = -1;
        onActiveIndexChangeRef.current?.(null);

        gsap.to(cardTargets, {
          xPercent: 0,
          duration: interactionDuration,
          ease,
          overwrite: "auto",
        });
      };

      root.addEventListener("mouseenter", updateBounds);
      root.addEventListener("mousemove", handlePointerMove);
      root.addEventListener("mouseleave", handlePointerLeave);

      return () => {
        resizeObserver.disconnect();
        root.removeEventListener("mouseenter", updateBounds);
        root.removeEventListener("mousemove", handlePointerMove);
        root.removeEventListener("mouseleave", handlePointerLeave);
      };
    });

    return () => {
      media.revert();
      gsap.killTweensOf([...items, ...cardTargets]);
      gsap.set([...items, ...cardTargets], { clearProps: "transform" });
    };
  }, [
    activeScale,
    disabled,
    displacement,
    ease,
    entranceDuration,
    entranceStagger,
    entranceTrigger,
    interactionDuration,
    seed,
  ]);

  return (
    <div
      {...props}
      className={[styles.stack, className].filter(Boolean).join(" ")}
      data-call-out
      ref={rootRef}
    >
      {children}
    </div>
  );
}

const ReactiveCardStack = Object.assign(ReactiveCardStackRoot, {
  Card: ReactiveCard,
});

export { ReactiveCardStack };
export type { ReactiveCardProps, ReactiveCardStackProps };

export function Demo() {
  return (
    <div className="grid h-full min-h-full place-items-center overflow-hidden bg-[#ffdbfd] px-4 py-16">
      <ReactiveCardStack>
        {cards.map((card) => (
          <ReactiveCardStack.Card
            className={card.color}
            key={card.step}
          >
            <div className={styles.cardInner}>
              <header className={styles.cardHeader}>{card.step}</header>
              <div className={styles.imageWrap}>
                <img
                  alt={card.imageAlt}
                  className={styles.image}
                  height="588"
                  src={card.image}
                  width="720"
                />
              </div>
              <div className={styles.content}>
                <h2 className={styles.title}>{card.title}</h2>
                <p className={styles.copy}>{card.copy}</p>
              </div>
            </div>
          </ReactiveCardStack.Card>
        ))}
      </ReactiveCardStack>
    </div>
  );
}
