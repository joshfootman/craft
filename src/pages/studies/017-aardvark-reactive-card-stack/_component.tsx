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

type ReactiveCardStackProps = React.HTMLAttributes<HTMLDivElement>;

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

function ReactiveCardStack({
  children,
  className,
  ...props
}: ReactiveCardStackProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

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
    const random = createSeededRandom(17);
    const media = gsap.matchMedia();

    const randomRestTransform = () => ({
      xPercent: (random() - 0.5) * 10,
      yPercent: (random() - 0.5) * 10,
      rotation: (random() - 0.5) * 15,
    });

    items.forEach((item) => {
      gsap.set(item, randomRestTransform());
    });

    media.add(MOTION_QUERY, () => {
      const entrance = gsap.from(items, {
        rotation: (random() - 0.5) * 15,
        yPercent: "+=150",
        duration: 1.05,
        ease: "elastic.out(1, 0.75)",
        stagger: 0.088,
      });

      return () => entrance.kill();
    });

    media.add(INTERACTION_QUERY, () => {
      let activeIndex = -1;

      const resetCard = (index: number) => {
        gsap.to(items[index], {
          ...randomRestTransform(),
          scale: 1,
          duration: 0.85,
          ease: "elastic.out(1, 0.75)",
        });
      };

      const activateCard = (index: number) => {
        gsap.to(items[index], {
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          scale: 1.075,
          duration: 0.85,
          ease: "elastic.out(1, 0.75)",
        });

        cardTargets.forEach((target, targetIndex) => {
          gsap.to(target, {
            xPercent:
              targetIndex === index ? 0 : 45 / (targetIndex - index),
            duration: 0.85,
            ease: "elastic.out(1, 0.75)",
          });
        });
      };

      const handlePointerMove = (event: MouseEvent) => {
        const rect = root.getBoundingClientRect();
        const percentage = (event.clientX - rect.left) / rect.width;
        const nextIndex = Math.min(
          items.length - 1,
          Math.max(0, Math.ceil(percentage * items.length) - 1),
        );

        if (nextIndex === activeIndex) return;
        if (activeIndex >= 0) resetCard(activeIndex);

        activeIndex = nextIndex;
        activateCard(activeIndex);
      };

      const handlePointerLeave = () => {
        if (activeIndex >= 0) resetCard(activeIndex);
        activeIndex = -1;

        gsap.to(cardTargets, {
          xPercent: 0,
          duration: 0.85,
          ease: "elastic.out(1, 0.75)",
        });
      };

      root.addEventListener("mousemove", handlePointerMove);
      root.addEventListener("mouseleave", handlePointerLeave);

      return () => {
        root.removeEventListener("mousemove", handlePointerMove);
        root.removeEventListener("mouseleave", handlePointerLeave);
      };
    });

    return () => {
      media.revert();
      gsap.killTweensOf([...items, ...cardTargets]);
      gsap.set([...items, ...cardTargets], { clearProps: "transform" });
    };
  }, []);

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

export { ReactiveCardStack };
export type { ReactiveCardStackProps };

export function Demo() {
  return (
    <div className="grid h-full min-h-full place-items-center overflow-hidden bg-[#ffdbfd] px-4 py-16">
      <ReactiveCardStack>
        {cards.map((card) => (
          <div
            className={styles.item}
            data-reactive-card-item
            key={card.step}
          >
            <article
              className={`${styles.card} ${card.color}`}
              data-reactive-card-target
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
            </article>
          </div>
        ))}
      </ReactiveCardStack>
    </div>
  );
}
