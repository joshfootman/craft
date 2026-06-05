import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React from "react";

gsap.registerPlugin(ScrollTrigger);

type FlashWordsProps = React.ComponentProps<"div"> & {
  text: string;
  finalColor?: string;
};

function FlashWords({ text, className, ...props }: FlashWordsProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const words = Array.from(root.querySelectorAll<HTMLElement>("[data-flash-word]"));
    if (words.length === 0) return;

    gsap.set(words, {
      opacity: 0,
      color: "#F94A00",
    });

    const tween = gsap.to(words, {
      scrollTrigger: {
        trigger: root,
        start: "top 90%",
        once: true,
      },
      keyframes: [
        { opacity: 1, color: "#F94A00", duration: 0.2, ease: "power2.out" },
        { color: "#FD7B03", duration: 0.05 },
        { color: "#171717", duration: 0.1 },
      ],
      stagger: { each: 0.1 },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const lines = text.split("\n");

  return (
    <div ref={rootRef} className={className} style={{ color: "#171717" }} {...props}>
      {lines.map((line, lineIndex) => {
        const tokens = line.split(/(\s+)/);

        return (
          <React.Fragment key={`${line}-${lineIndex}`}>
            {tokens.map((token, tokenIndex) => {
              if (!token.trim()) {
                return <React.Fragment key={`${lineIndex}-${tokenIndex}`}>{token}</React.Fragment>;
              }

              return (
                <span
                  key={`${lineIndex}-${tokenIndex}`}
                  data-flash-word
                  className="inline-block will-change-[opacity,color]"
                >
                  {token}
                </span>
              );
            })}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function Demo() {
  return (
    <div className="flex h-[80%] items-center justify-center">
      <FlashWords
        text={"On-brand visuals.\nMade by AI."}
        className="text-4xl tracking-tighter @md:text-[6rem]"
      />
    </div>
  );
}
