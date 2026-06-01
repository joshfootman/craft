import gsap from "gsap";
import { Dialog } from "@base-ui/react/dialog";
import React from "react";
import styles from "./index.module.css";
import { cn } from "~/lib/utils";

type HoverSplitTextProps<T extends React.ElementType = "span"> = {
  as?: T;
  text: string;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  return prefersReducedMotion;
}

function HoverSplitText<T extends React.ElementType = "span">({
  as,
  text,
  className,
  ...props
}: HoverSplitTextProps<T>) {
  const Comp = (as ?? "span") as React.ElementType;
  const textWrapRef = React.useRef<HTMLSpanElement | null>(null);
  const tlRef = React.useRef<gsap.core.Timeline | null>(null);
  const chars = React.useMemo(() => Array.from(text), [text]);
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    if (!textWrapRef.current) return;

    const hoverTarget =
      (textWrapRef.current.closest("[hover-stagger-wrap]") as HTMLElement | null) ??
      textWrapRef.current;
    const baseChars = textWrapRef.current.querySelectorAll('[data-row="base"] [data-char]');
    const hoverChars = textWrapRef.current.querySelectorAll('[data-row="hover"] [data-char]');

    if (prefersReducedMotion) {
      gsap.set(baseChars, { yPercent: 0 });
      gsap.set(hoverChars, { yPercent: 100 });
      return;
    }

    gsap.set(baseChars, { yPercent: 0 });
    gsap.set(hoverChars, { yPercent: 100 });

    tlRef.current = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power1.inOut",
        duration: 0.2,
        stagger: 0.02,
      },
    });

    tlRef.current
      .fromTo(
        baseChars,
        {
          yPercent: 0,
        },
        {
          yPercent: -100,
        },
      )
      .fromTo(
        hoverChars,
        {
          yPercent: 100,
        },
        {
          yPercent: 0,
        },
        "<",
      );

    const play = () => tlRef.current?.restart();
    const reverse = () => tlRef.current?.reverse();
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.matches(":focus-visible")) {
        play();
      }
    };
    const onFocusOut = () => {
      reverse();
    };

    hoverTarget.addEventListener("mouseenter", play);
    hoverTarget.addEventListener("mouseleave", reverse);
    hoverTarget.addEventListener("focusin", onFocusIn);
    hoverTarget.addEventListener("focusout", onFocusOut);

    return () => {
      hoverTarget.removeEventListener("mouseenter", play);
      hoverTarget.removeEventListener("mouseleave", reverse);
      hoverTarget.removeEventListener("focusin", onFocusIn);
      hoverTarget.removeEventListener("focusout", onFocusOut);
      tlRef.current?.kill();
      tlRef.current = null;
    };
  }, [prefersReducedMotion, text]);

  return (
    <Comp ref={textWrapRef} className={cn("flex align-top", className)} {...props}>
      <span className="relative inline-block overflow-hidden mask-[linear-gradient(#000_0_0)] mask-size-[100%_70%] mask-center mask-no-repeat whitespace-pre [-webkit-mask-image:linear-gradient(#000_0_0)] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%_70%]">
        <span aria-hidden="true" data-row="base" className="inline-flex whitespace-pre">
          {chars.map((char, index) => (
            <span key={`base-${char}-${index}`} data-char className="inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
        <span
          aria-hidden="true"
          data-row="hover"
          className="absolute top-0 left-0 inline-flex whitespace-pre"
        >
          {chars.map((char, index) => (
            <span key={`hover-${char}-${index}`} data-char className="inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </span>
      <span className="sr-only">{text}</span>
    </Comp>
  );
}

const NightSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M14.845 8.36965C14.7735 9.69243 14.3205 10.9662 13.5406 12.037C12.7607 13.1079 11.6874 13.9298 10.4503 14.4036C9.21321 14.8774 7.86538 14.9827 6.56972 14.7068C5.27407 14.431 4.08605 13.7857 3.14929 12.849C2.21253 11.9123 1.56714 10.7244 1.29113 9.42878C1.01511 8.13315 1.12029 6.78531 1.59395 5.54818C2.06762 4.31106 2.88948 3.23761 3.9602 2.45761C5.03092 1.67761 6.30465 1.22444 7.62741 1.1529C7.93599 1.13613 8.09752 1.50337 7.9337 1.7647C7.38581 2.64132 7.15121 3.67774 7.26818 4.70485C7.38515 5.73196 7.84679 6.6891 8.57776 7.42008C9.30873 8.15105 10.2659 8.61269 11.293 8.72966C12.3201 8.84662 13.3565 8.61203 14.2331 8.06413C14.4953 7.90033 14.8617 8.06108 14.845 8.36965Z"
      stroke="currentColor"
      strokeWidth="1.71429"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);

const DaySVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M10.0007 15.8333C13.2223 15.8333 15.834 13.2217 15.834 10C15.834 6.77833 13.2223 4.16666 10.0007 4.16666C6.77899 4.16666 4.16732 6.77833 4.16732 10C4.16732 13.2217 6.77899 15.8333 10.0007 15.8333Z"
      fill="currentColor"
    ></path>
    <path
      d="M10.0007 19.1333C9.54232 19.1333 9.16732 18.7917 9.16732 18.3333V18.2667C9.16732 17.8083 9.54232 17.4333 10.0007 17.4333C10.459 17.4333 10.834 17.8083 10.834 18.2667C10.834 18.725 10.459 19.1333 10.0007 19.1333ZM15.9507 16.7833C15.734 16.7833 15.5257 16.7 15.359 16.5417L15.2507 16.4333C14.9257 16.1083 14.9257 15.5833 15.2507 15.2583C15.5757 14.9333 16.1006 14.9333 16.4256 15.2583L16.534 15.3667C16.859 15.6917 16.859 16.2167 16.534 16.5417C16.3757 16.7 16.1673 16.7833 15.9507 16.7833ZM4.05065 16.7833C3.83398 16.7833 3.62565 16.7 3.45898 16.5417C3.13398 16.2167 3.13398 15.6917 3.45898 15.3667L3.56732 15.2583C3.89232 14.9333 4.41732 14.9333 4.74232 15.2583C5.06732 15.5833 5.06732 16.1083 4.74232 16.4333L4.63398 16.5417C4.47565 16.7 4.25898 16.7833 4.05065 16.7833ZM18.334 10.8333H18.2673C17.809 10.8333 17.434 10.4583 17.434 9.99999C17.434 9.54166 17.809 9.16666 18.2673 9.16666C18.7257 9.16666 19.134 9.54166 19.134 9.99999C19.134 10.4583 18.7923 10.8333 18.334 10.8333ZM1.73398 10.8333H1.66732C1.20898 10.8333 0.833984 10.4583 0.833984 9.99999C0.833984 9.54166 1.20898 9.16666 1.66732 9.16666C2.12565 9.16666 2.53398 9.54166 2.53398 9.99999C2.53398 10.4583 2.19232 10.8333 1.73398 10.8333ZM15.8423 4.99166C15.6257 4.99166 15.4173 4.90833 15.2507 4.74999C14.9257 4.42499 14.9257 3.89999 15.2507 3.57499L15.359 3.46666C15.684 3.14166 16.209 3.14166 16.534 3.46666C16.859 3.79166 16.859 4.31666 16.534 4.64166L16.4256 4.74999C16.2673 4.90833 16.059 4.99166 15.8423 4.99166ZM4.15898 4.99166C3.94232 4.99166 3.73398 4.90833 3.56732 4.74999L3.45898 4.63333C3.13398 4.30833 3.13398 3.78333 3.45898 3.45833C3.78398 3.13333 4.30898 3.13333 4.63398 3.45833L4.74232 3.56666C5.06732 3.89166 5.06732 4.41666 4.74232 4.74166C4.58398 4.90833 4.36732 4.99166 4.15898 4.99166ZM10.0007 2.53333C9.54232 2.53333 9.16732 2.19166 9.16732 1.73333V1.66666C9.16732 1.20833 9.54232 0.833328 10.0007 0.833328C10.459 0.833328 10.834 1.20833 10.834 1.66666C10.834 2.12499 10.459 2.53333 10.0007 2.53333Z"
      fill="currentColor"
    ></path>
  </svg>
);

export function Demo() {
  const [open, setOpen] = React.useState(false);
  const [themeToggle, setThemeToggle] = React.useState(true);
  const [menuLabel, setMenuLabel] = React.useState("Menu");

  const dialogActionsRef = React.useRef<Dialog.Root.Actions>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const iconRef = React.useRef<HTMLDivElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const menuTlRef = React.useRef<gsap.core.Timeline | null>(null);
  const menuItemsRef = React.useRef<HTMLElement[]>([]);
  const scrambleFrameRef = React.useRef<number | null>(null);
  const hasInteractedRef = React.useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    if (!iconRef.current || !popupRef.current) return;

    const topLine = iconRef.current.children[0] as HTMLDivElement;
    const botLine = iconRef.current.children[1] as HTMLDivElement;
    const items = Array.from(
      popupRef.current.querySelectorAll("[data-menu-item]"),
    ) as HTMLElement[];
    menuItemsRef.current = items;

    if (prefersReducedMotion) {
      gsap.set(topLine, {
        y: open ? "0.025em" : "-0.2em",
        rotate: open ? 45 : 0,
        transformOrigin: "50% 50%",
      });
      gsap.set(botLine, {
        y: open ? "-0.025em" : "0.2em",
        rotate: open ? -45 : 0,
        transformOrigin: "50% 50%",
      });
      gsap.set(popupRef.current, {
        marginTop: open ? "-3em" : "-1.5em",
        height: open ? "39em" : "3em",
        width: open ? "18em" : "15.5em",
      });
      gsap.set(items, { opacity: open ? 1 : 0 });
      return;
    }

    if (!menuTlRef.current) {
      gsap.set(topLine, {
        y: "-0.2em",
        rotate: 0,
        transformOrigin: "50% 50%",
      });

      gsap.set(botLine, {
        y: "0.2em",
        rotate: 0,
        transformOrigin: "50% 50%",
      });

      gsap.set(popupRef.current, {
        marginTop: "-1.5em",
        height: "3em",
        width: "15.5em",
      });
      gsap.set(items, { opacity: 0 });

      menuTlRef.current = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power2.out",
        },
        onReverseComplete: () => {
          dialogActionsRef.current?.unmount();
        },
      });

      menuTlRef.current
        .to(
          topLine,
          {
            y: "0.025em",
            rotate: 45,
            duration: 0.25,
          },
          0,
        )
        .to(
          botLine,
          {
            y: "-0.025em",
            rotate: -45,
            duration: 0.25,
          },
          0,
        )
        .to(
          popupRef.current,
          {
            marginTop: "-3em",
            height: "39em",
            width: "18em",
            duration: 0.4,
          },
          0,
        )
        .to(
          items,
          {
            opacity: 1,
            stagger: 0.05,
            duration: 0.3,
          },
          "-=0.2",
        );
    }

    if (open) {
      menuTlRef.current.play();
    } else {
      gsap.to([...menuItemsRef.current].reverse(), {
        opacity: 0,
        stagger: 0.05,
        duration: 0.2,
      });

      menuTlRef.current.reverse(0.3);
    }
  }, [open, prefersReducedMotion]);

  React.useEffect(() => {
    return () => {
      menuTlRef.current?.kill();
      menuTlRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (!hasInteractedRef.current) return;

    if (prefersReducedMotion) {
      setMenuLabel(open ? "Close" : "Menu");
      return;
    }

    const letters = "•";
    const nextText = open ? "Close" : "Menu";
    const currentText = menuLabel;
    const length = Math.max(currentText.length, nextText.length);
    const totalFrames = 20;
    let frame = 0;

    if (scrambleFrameRef.current) {
      window.clearInterval(scrambleFrameRef.current);
    }

    scrambleFrameRef.current = window.setInterval(() => {
      let display = "";

      for (let i = 0; i < length; i += 1) {
        if (i < nextText.length && frame / totalFrames > i / length) {
          display += nextText[i];
        } else {
          display += letters[Math.floor(Math.random() * letters.length)];
        }
      }

      setMenuLabel(display);
      frame += 1;

      if (frame > totalFrames) {
        setMenuLabel(nextText);
        if (scrambleFrameRef.current) {
          window.clearInterval(scrambleFrameRef.current);
          scrambleFrameRef.current = null;
        }
      }
    }, 20);

    return () => {
      if (scrambleFrameRef.current) {
        window.clearInterval(scrambleFrameRef.current);
        scrambleFrameRef.current = null;
      }
    };
  }, [open, prefersReducedMotion]);

  return (
    <Dialog.Root
      actionsRef={dialogActionsRef}
      open={open}
      onOpenChange={(nextOpen, eventDetails) => {
        if (!nextOpen) {
          eventDetails.preventUnmountOnClose();
        }

        hasInteractedRef.current = true;
        setOpen(nextOpen);
      }}
    >
      <div
        ref={rootRef}
        className={cn("relative flex items-center justify-center px-8 py-12", styles.root)}
      >
        <div
          className={cn(
            "z-10 flex h-[3em] items-center justify-center gap-[1.5em] rounded-full bg-black p-[0.5em]",
            styles.scale,
          )}
        >
          <Dialog.Trigger
            render={
              <button className="flex cursor-pointer items-center justify-center gap-[0.75em] rounded-full p-[0.5em] pr-0 transition-opacity duration-200 hover:opacity-65" />
            }
          >
            <div ref={iconRef} className="relative h-[1.65em] w-[1.65em]">
              <div className="absolute top-1/2 left-0 h-px w-full -translate-y-[0.2em] bg-white"></div>
              <div className="absolute top-1/2 left-0 h-px w-full translate-y-[0.2em] bg-white"></div>
            </div>
            <div className="w-[3em]  text-start text-[1em] leading-none text-white">
              {menuLabel}
            </div>
          </Dialog.Trigger>
          <button
            aria-label={themeToggle ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-[2em] w-[2em] cursor-pointer items-center justify-center rounded-full border border-white/25 transition-all duration-200 hover:border-white/65"
            onClick={() => setThemeToggle((curr) => !curr)}
          >
            <div className="h-[1em] w-[1em] text-white">
              {themeToggle ? <NightSVG /> : <DaySVG />}
            </div>
          </button>
          <div className="flex h-[2em] items-center justify-center rounded-full bg-white/20 px-[0.55em]">
            <div className="w-[2.5em] text-center text-[1em] leading-none text-white">0%</div>
          </div>
        </div>
      </div>
      <Dialog.Portal container={rootRef} keepMounted>
        <Dialog.Popup
          ref={popupRef}
          className={cn(
            "absolute left-1/2 z-0 -mt-[1.5em] h-[3em] w-[15.5em] -translate-x-1/2 rounded-[2em] bg-neutral-200",
            styles.scale,
          )}
        >
          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>
          <div className="flex h-full shrink-0 flex-col justify-between p-[1em] pt-[6em]">
            <div data-menu-item className="flex flex-col gap-[0.65em]">
              <div className="text-[0.75em] text-neutral-900/50">Menu</div>
              <div className="flex flex-col gap-[0.2rem]">
                {["PDP's", "Products", "Videos", "Our features"].map((item) => (
                  <HoverSplitText
                    as="a"
                    className="rounded-sm text-[1.5em] transition-opacity duration-200 hover:opacity-65 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    href="#"
                    key={item}
                    text={item}
                  />
                ))}
              </div>
            </div>
            <div
              data-menu-item
              className="flex flex-col gap-[0.65em] border border-t-neutral-950/20 pt-[1.5em]"
            >
              <div className="text-[0.75em] text-neutral-950/50">Other</div>
              <div className="flex flex-col gap-[0.2rem]">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <HoverSplitText
                    as="a"
                    className="text-[0.875em] transition-opacity duration-200 hover:opacity-65 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    href="#"
                    key={item}
                    text={item}
                  />
                ))}
              </div>
            </div>
            <div data-menu-item className="flex flex-col gap-[0.65em] pb-[1em]">
              <div className="text-[0.75em] text-neutral-950/50">Social Media</div>
              <HoverSplitText
                as="a"
                className="text-[0.875em] transition-opacity duration-200 hover:opacity-65 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                href="#"
                text="Instagram"
              />
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
