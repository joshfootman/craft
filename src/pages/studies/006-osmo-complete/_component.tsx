import { PlusIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import React from "react";

import {
  TextSwapButton,
  TextSwapButtonIcon,
  TextSwapButtonText,
} from "../001-osmo-text-swap-button/_component";
import {
  TextSwapLink,
  TextSwapLinkAnchor,
  TextSwapLinkBackground,
  TextSwapLinkEyebrow,
} from "../002-osmo-text-swap-link/_component";
import { Drawer, DrawerContent, DrawerMeta, DrawerTrigger } from "../003-osmo-drawer/_component";
import { Underline } from "../004-osmo-underline-hover/_component";
import { FadeUp, RotateUp } from "../005-osmo-intro/_component";

const MENU_ITEMS = ["About Us", "Our Work", "Services", "Blog", "Contact Us"];
const SOCIALS = ["Instagram", "LinkedIn", "X/Twitter", "Awwwards"];

export function Demo() {
  const [isOpen, setIsOpen] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex w-full p-8">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger
          render={<TextSwapButton active={isOpen} className="z-30 ml-auto gap-1 text-[1.125rem]" />}
        >
          <TextSwapButtonText>{(inactive) => (inactive ? "Menu" : "Close")}</TextSwapButtonText>
          <TextSwapButtonIcon>
            <PlusIcon className="size-5 stroke-[1.5]" />
          </TextSwapButtonIcon>
        </DrawerTrigger>
        <DrawerContent
          className="[--menu-padding:1em] md:[--menu-padding:2em]"
          initialFocus={false}
          style={
            {
              "--font-bebas": "Bebas Neue",
              "--cubic-main": "cubic-bezier(0.65, 0.01, 0.05, 0.99)",
              "--cubic-hover": "cubic-bezier(0.65, 0.05, 0, 1)",
            } as CSSProperties
          }
        >
          <DrawerMeta title="Menu" description="Navigation and Social links" />
          <div className="flex h-full flex-col justify-between pt-40 pb-[2em]">
            <motion.div
              className="w-full"
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
                <div key={item} className="h-[4.5em] overflow-hidden md:h-auto">
                  <RotateUp className="origin-bottom-left">
                    <TextSwapLink>
                      <TextSwapLinkAnchor className="font-(family-name:--font-bebas)" href="#">
                        {item}
                      </TextSwapLinkAnchor>
                      <TextSwapLinkEyebrow className="font-mono">0{i + 1}</TextSwapLinkEyebrow>
                      <TextSwapLinkBackground />
                    </TextSwapLink>
                  </RotateUp>
                </div>
              ))}
            </motion.div>
            <motion.div
              className="flex flex-col gap-5 pl-(--menu-padding)"
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
              <FadeUp className="text-sm">Socials</FadeUp>
              <div className="flex flex-wrap gap-[1.5em] text-[1.125rem]">
                {SOCIALS.map((social) => (
                  <Underline key={social} render={<a href="#" />} className="w-fit overflow-hidden">
                    <FadeUp>{social}</FadeUp>
                  </Underline>
                ))}
              </div>
            </motion.div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
