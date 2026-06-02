import gsap from "gsap";
import React from "react";
import { cn } from "~/lib/utils";
import styles from "./index.module.css";

function CircularCarouselImg({ src, degree }: { src: string; degree: number }) {
  return (
    <div className="absolute" style={{ rotate: `${degree}deg` }}>
      <div
        className="relative -top-60 flex h-36 w-30 items-center justify-center overflow-hidden rounded-[2rem]"
        data-carousel-item
      >
        <img
          className={cn(
            "inline-block size-40 max-w-none flex-none object-cover align-middle",
            styles.counterRotate,
          )}
          style={{ "--counter-rotation-start": `-${degree}deg` } as React.CSSProperties}
          src={src}
        />
      </div>
    </div>
  );
}

function CircularCarousel({ imgs }: { imgs: Array<string> }) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;

    const cards = rootRef.current.querySelectorAll("[data-carousel-item]");

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        scale: 0.5,
      },
      {
        opacity: 1,
        scale: 1,
        delay: 0.3,
        duration: 0.5,
        stagger: 0.12,
        ease: "power2.out",
      },
    );
  }, []);

  return (
    <div ref={rootRef} className={cn("relative flex items-center justify-center", styles.carousel)}>
      {imgs.map((img, i) => (
        <CircularCarouselImg key={img} degree={i * 45} src={img} />
      ))}
    </div>
  );
}

export function Demo() {
  return (
    <div className={cn("relative flex h-full items-center justify-center overflow-hidden pb-20")}>
      <CircularCarousel
        imgs={Array.from({ length: 8 }).map(
          (_, i) => `/src/pages/studies/009-formula-carousel/assets/mabel${i + 1}.jpeg`,
        )}
      />
    </div>
  );
}
