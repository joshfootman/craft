import { motion, useReducedMotion } from "motion/react";
import type React from "react";
import type { CSSProperties } from "react";

const CUSTOM_EASING = [0.65, 0.05, 0, 1] as const;

const MENU_ITEMS = ["About Us", "Our Work", "Services", "Blog", "Contact Us"];
const SOCIALS = ["Instagram", "LinkedIn", "X/Twitter", "Awwwards"];

function RotateUp({ children, ...props }: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      {...props}
      variants={{
        hidden: {
          y: "140%",
          rotate: 10,
        },
        visible: {
          y: "0%",
          rotate: 0,
          transition: {
            duration: 0.8,
            ease: CUSTOM_EASING,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

function FadeUp({ children, ...props }: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      {...props}
      variants={{
        hidden: {
          opacity: 0,
          y: "50%",
        },
        visible: {
          opacity: 1,
          y: "0%",
          transition: {
            duration: 0.6,
            ease: CUSTOM_EASING,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export { RotateUp, FadeUp };

export function Demo() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="flex h-full flex-col items-center justify-center pb-20"
      style={
        {
          "--font-bebas": "Bebas Neue",
        } as CSSProperties
      }
    >
      <div className="flex w-fit flex-col gap-40">
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          variants={{
            visible: {
              transition: {
                delayChildren: 0.35,
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {MENU_ITEMS.map((item, i) => (
            <div key={item} className="overflow-hidden py-2">
              <RotateUp className="flex origin-bottom-left gap-3">
                <div className="p-2 font-(family-name:--font-bebas) text-7xl font-bold uppercase [text-box:trim-both_cap_alphabetic]">
                  {item}
                </div>
                <div className="font-mono text-orange-500">0{i + 1}</div>
              </RotateUp>
            </div>
          ))}
        </motion.div>
        <motion.div
          className="flex flex-col gap-5"
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          variants={{
            visible: {
              transition: {
                delayChildren: 0.55,
                staggerChildren: 0.04,
              },
            },
          }}
        >
          <FadeUp>Socials</FadeUp>
          <div className="flex flex-row gap-6 text-lg">
            {SOCIALS.map((social) => (
              <div key={social} className="overflow-hidden">
                <FadeUp>{social}</FadeUp>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
