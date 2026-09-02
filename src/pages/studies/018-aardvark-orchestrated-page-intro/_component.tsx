import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import React from "react";

import heroBackgroundMarkup from "./hero-background.svg?raw";
import logoCircle from "./logo-circle.svg";
import styles from "./index.module.css";

gsap.registerPlugin(DrawSVGPlugin);

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

type OrchestratedPageIntroProps = React.ComponentPropsWithoutRef<"div">;

function OrchestratedPageIntro({ className, ...props }: OrchestratedPageIntroProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const select = gsap.utils.selector(root);
    const media = gsap.matchMedia();

    media.add(MOTION_QUERY, () => {
      const loader = select<HTMLElement>("[data-intro-loader]");
      const loaderPath = select<SVGPathElement>("[data-intro-loader-path]");
      const loaderLogo = select<HTMLElement>("[data-intro-loader-logo]");
      const background = select<HTMLElement>("[data-intro-background]");
      const wavePaths = select<SVGPathElement>("[data-wave-background] path");

      gsap.set(loaderPath, { drawSVG: "0% 100%" });
      gsap.set(loaderLogo, { autoAlpha: 0, rotation: -64, scale: 0 });
      gsap.set(background, { clipPath: "ellipse(20% 0% at 100% 100%)" });
      gsap.set(wavePaths, {
        attr: { "stroke-width": 0 },
        rotation: 0,
        transformBox: "fill-box",
        transformOrigin: "center center",
      });

      const waveTimeline = gsap
        .timeline({ repeat: -1 })
        .to(wavePaths, {
          attr: { "stroke-width": 35 },
          duration: 3,
          ease: "sine.inOut",
          rotation: 2,
        })
        .to(wavePaths, {
          attr: { "stroke-width": 0 },
          duration: 3,
          ease: "sine.inOut",
          rotation: 0,
        });

      const timeline = gsap.timeline();
      timeline.addLabel("start", 0);
      timeline.to(
        loaderPath,
        {
          keyframes: {
            "95%": { ease: "circ.out", strokeWidth: "8%" },
            "100%": { drawSVG: "100% 100%" },
          },
          delay: 0.65,
          duration: 1.25,
        },
        "start",
      );
      timeline.to(
        loaderLogo,
        {
          autoAlpha: 1,
          delay: 0.05,
          duration: 0.65,
          ease: "elastic.out(1, 0.72)",
          rotation: 0,
          scale: 1,
        },
        "start",
      );
      timeline.to(
        loaderLogo,
        {
          autoAlpha: 0,
          delay: 0.5,
          duration: 0.6,
          ease: "elastic.in(1, 0.72)",
          rotation: 64,
          scale: 0,
        },
        "start",
      );
      timeline.to(
        background,
        {
          clipPath: "ellipse(150% 130% at 100% 100%)",
          delay: 0.2,
          duration: 1.1,
          ease: "circ.out",
        },
        "start+=1.1",
      );
      timeline.set(loader, { display: "none" });

      return () => {
        timeline.revert();
        waveTimeline.revert();
      };
    });

    return () => media.revert();
  }, []);

  return (
    <div {...props} className={[styles.root, className].filter(Boolean).join(" ")} ref={rootRef}>
      <div aria-hidden="true" className={styles.background} data-intro-background>
        <div
          className={styles.backgroundSvg}
          data-wave-background
          dangerouslySetInnerHTML={{ __html: heroBackgroundMarkup }}
        />
      </div>

      <div aria-hidden="true" className={styles.loader} data-intro-loader>
        <svg className={styles.loaderShape} preserveAspectRatio="none" viewBox="0 0 1080 1080">
          <path
            d="M66.858-19C57.597 196.452 127.164 482.585 206.5 464.5c125.428-28.592 52.293-293.51 200.001-339 568.234-175-241.425 712.6 15.5 803.02C645 1007 629.398 499 810.5 499c113.398 0 106.54 189.465 164.235 429.52 48.005 199.72 89.415 213.09 105.265 173.78"
            data-intro-loader-path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="70%"
          />
        </svg>
        <img alt="" className={styles.loaderLogo} data-intro-loader-logo src={logoCircle.src} />
      </div>
    </div>
  );
}

export { OrchestratedPageIntro };
export type { OrchestratedPageIntroProps };

export function Demo() {
  return (
    <div className="h-full min-h-0 overflow-hidden bg-white">
      <OrchestratedPageIntro />
    </div>
  );
}
