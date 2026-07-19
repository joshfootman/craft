import "@fontsource-variable/tiktok-sans/standard.css";

import { useReducedMotion } from "motion/react";
import React from "react";

const SCRAMBLE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*+-=?/<>[]{}";
const SCRAMBLE_COLORS = ["#c0fe04", "#607f02"] as const;
const DEMO_COLORS = ["#c0fe04", "#dfff81"] as const;

type TextScrambleProps = Omit<React.ComponentProps<"span">, "children"> & {
  text: string;
  startDelayMs?: number;
  letterDelayMs?: number;
  colors?: readonly string[];
};

export function TextScramble({
  text,
  startDelayMs = 0,
  letterDelayMs = 80,
  colors = SCRAMBLE_COLORS,
  className,
  style,
  ...props
}: TextScrambleProps) {
  // accessabiity, don't want to play animation if user has requested no motion
  const reduceMotion = useReducedMotion();

  // we track the time since start in ms, to allow us to implement the scramble animation on a per character basis
  const [elapsedMs, setElapsedMs] = React.useState(0);

  // special characters to scramble through
  const characters = Array.from(text);

  // duration to show color on special character, for each character
  const colorDuration = letterDelayMs * 2;

  // similar to above color duration
  const scrambleDuration = colorDuration * colors.length;

  // duration of entire animation, based on length of word
  const totalDuration =
    startDelayMs + Math.max(0, characters.length - 1) * letterDelayMs + scrambleDuration;

  // hook to increase the elapsedMs
  React.useEffect(() => {
    if (reduceMotion) {
      setElapsedMs(totalDuration);
      return;
    }

    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      setElapsedMs(elapsed);
      if (elapsed >= totalDuration) window.clearInterval(timer);
    }, 40);

    return () => window.clearInterval(timer);
  }, [reduceMotion, totalDuration]);

  //
  const settled = elapsedMs >= totalDuration;

  //
  const started = elapsedMs >= startDelayMs;

  return (
    <span
      aria-label={text}
      className={className}
      style={{ ...style, opacity: started || settled ? 1 : 0 }}
      {...props}
    >
      <span aria-hidden="true">
        {settled
          ? text
          : characters.map((character, index) => {
              if (character === "\n") return <br key={index} />;
              if (character === " ") return <React.Fragment key={index}> </React.Fragment>;

              const characterElapsed = elapsedMs - startDelayMs - index * letterDelayMs;
              if (characterElapsed < 0) {
                return (
                  <span key={index} className="opacity-0">
                    {character}
                  </span>
                );
              }

              if (characterElapsed < scrambleDuration) {
                const colorIndex = Math.min(
                  colors.length - 1,
                  Math.floor(characterElapsed / colorDuration),
                );

                return (
                  <span key={index} style={{ color: colors[colorIndex] }}>
                    {SCRAMBLE_CHARACTERS[Math.floor(Math.random() * SCRAMBLE_CHARACTERS.length)]}
                  </span>
                );
              }

              return <span key={index}>{character}</span>;
            })}
      </span>
    </span>
  );
}

export function Demo() {
  return (
    <div className="flex h-full items-end px-4 pb-8 text-white @md:px-8 @md:pb-12 @4xl:px-12 @4xl:pb-20">
      <div
        className="flex w-full flex-col bg-[#031244] p-4 text-lg leading-none font-bold uppercase @sm:text-xl @md:p-6 @md:text-2xl @lg:text-3xl @2xl:text-4xl @3xl:text-5xl @5xl:text-7xl"
        style={{
          fontFamily: '"TikTok Sans Variable", sans-serif',
          fontVariationSettings: '"wdth" 120',
        }}
      >
        <TextScramble text="I bring" startDelayMs={300} colors={DEMO_COLORS} />
        <TextScramble text="craft & taste" startDelayMs={500} colors={DEMO_COLORS} />
        <TextScramble text="to digital work" startDelayMs={700} colors={DEMO_COLORS} />
      </div>
    </div>
  );
}
