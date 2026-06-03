import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React from "react";
import { cn } from "~/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type FallingPageProps = React.ComponentProps<"section"> & {
  zIndex?: number;
};

function FallingPages({ className, children, ...props }: React.ComponentProps<"div">) {
  const pages = React.Children.map(children, (child, index) => {
    if (!React.isValidElement<FallingPageProps>(child)) return child;
    return React.cloneElement(child, {
      zIndex: index * 10,
    });
  });

  return (
    <div className={cn("relative overflow-hidden object-fill", className)} {...props}>
      {pages}
    </div>
  );
}

function FallingPagesPage({ className, children, zIndex, ...props }: FallingPageProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const wrapper = section.querySelector("[data-falling-page-wrap]");
    const content = section.querySelector("[data-falling-page-content]");

    if (!wrapper || !content) return;

    const transformTween = gsap.to(content, {
      rotationZ: (Math.random() - 0.5) * 20,
      scale: 0.4,
      rotationX: 40,
      ease: "power1.in",
      scrollTrigger: {
        pin: wrapper,
        trigger: section,
        start: "top 0%",
        end: `+=${window.innerHeight}`,
        scrub: true,
      },
    });

    const fadeTween = gsap.to(content, {
      autoAlpha: 0,
      ease: "power1.in",
      scrollTrigger: {
        trigger: content,
        start: "top -80%",
        end: `+=${0.5 * window.innerHeight}`,
        scrub: true,
      },
    });

    return () => {
      transformTween.scrollTrigger?.kill();
      transformTween.kill();
      fadeTween.scrollTrigger?.kill();
      fadeTween.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn("relative h-screen", className)}
      style={{ zIndex }}
      {...props}
    >
      <div data-falling-page-wrap className="h-screen">
        <div data-falling-page-content className="flex h-full w-full flex-col">
          {children}
        </div>
      </div>
    </section>
  );
}

export function Demo() {
  return (
    <div style={{ "--font-inter": "Inter" } as React.CSSProperties}>
      <section className="flex h-[calc(100vh-45px)] flex-col">
        <div className="flex flex-1"></div>
        <div className="flex flex-col gap-8 border-t p-6 pb-16 md:flex-row md:items-end md:justify-between">
          <div className="font-(family-name:--font-inter) text-6xl tracking-tighter">
            From idea to assets <br /> in four steps.
          </div>
          <div className="text-right text-sm">
            Sign up for free and supercharge <br /> your creative workflow.
          </div>
        </div>
      </section>
      <FallingPages>
        <FallingPagesPage>
          <div className="flex h-full w-full flex-col bg-linear-to-b from-[#F94A00] to-[#FD7B03] font-(family-name:--font-inter) tracking-tighter text-white">
            <div className="flex w-full items-center justify-center py-8 text-xl text-white opacity-40">
              (PB)
            </div>
            <div className="flex flex-row justify-between px-12 pb-8">
              <div className="text-5xl">
                Add products
                <br /> and brand.
              </div>
              <div className="text-8xl">01</div>
            </div>
            <div className="flex w-full flex-row px-12">
              <div className="flex flex-1 flex-col border-t border-r border-white/30">
                <div className="flex w-full flex-row items-start gap-2 border-l border-white/30 p-6 pb-10">
                  <div className="size-1.5 rounded-full bg-white"></div>
                  <div className="text-xs leading-2">14+ model presets</div>
                </div>
                <div className="flex w-45 flex-col gap-0 pt-4 leading-5">
                  <div className="pl-6">Store your products,</div>
                  <div className="text-white/60">shots and brand look in one place</div>
                </div>
              </div>
              <div className="flex flex-1 flex-col border-t border-white/30">
                <div className="flex w-full flex-row items-start gap-2 border-r border-white/30 p-6 pb-10">
                  <div className="size-1.5 rounded-full bg-white"></div>
                  <div className="text-xs leading-2">Multiple pose options</div>
                </div>
                <div></div>
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <button className="flex w-fit items-center justify-center rounded-full bg-white px-5 py-2.5 text-xs text-black">
                Get started
              </button>
            </div>
            <div className="relative flex w-full flex-1 justify-center">
              <div className="absolute bottom-0 z-20 h-40 w-full bg-linear-to-b from-[#FC730300] to-[#FC7303]"></div>
              <div className="absolute bottom-12 h-100 w-100 rounded-4xl bg-white/30 align-middle md:h-120 md:w-220"></div>
            </div>
          </div>
        </FallingPagesPage>
        <FallingPagesPage>
          <div className="flex h-full w-full flex-col bg-linear-to-b from-[#48A3D1] to-[#FD7B03] font-(family-name:--font-inter) tracking-tighter text-white">
            <div className="flex w-full items-center justify-center py-8 text-xl text-white opacity-40">
              (GO)
            </div>
            <div className="flex flex-row justify-between px-12 pb-8">
              <div className="text-5xl">
                AI generates <br /> options.
              </div>
              <div className="text-8xl">02</div>
            </div>
            <div className="flex w-full flex-row px-12">
              <div className="flex flex-1 flex-col border-t border-r border-white/30">
                <div className="flex w-full flex-row items-start gap-2 border-l border-white/30 p-6 pb-10">
                  <div className="size-1.5 rounded-full bg-white"></div>
                  <div className="text-xs leading-2">Concept & scene variations</div>
                </div>
                <div className="flex w-45 flex-col gap-0 pt-4 leading-5">
                  <div className="pl-6">Use AI to</div>
                  <div className="text-white/60">create new concepts, scenes and ideas.</div>
                </div>
              </div>
              <div className="flex flex-1 flex-col border-t border-white/30">
                <div className="flex w-full flex-row items-start gap-2 border-r border-white/30 p-6 pb-10">
                  <div className="size-1.5 rounded-full bg-white"></div>
                  <div className="text-xs leading-2">Multiple visual directions</div>
                </div>
                <div></div>
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <button className="flex w-fit items-center justify-center rounded-full bg-white px-5 py-2.5 text-xs text-black">
                Get started
              </button>
            </div>
            <div className="relative flex w-full flex-1 justify-center">
              <div className="absolute bottom-0 z-20 h-40 w-full bg-linear-to-b from-[#FC730300] to-[#FC7303]"></div>
              <div className="absolute bottom-12 h-100 w-100 rounded-4xl bg-white/30 align-middle md:h-120 md:w-220"></div>
            </div>
          </div>
        </FallingPagesPage>
        <FallingPagesPage>
          <div className="flex h-full w-full flex-col bg-linear-to-b from-[#3A54FF] via-[#7A67C5] to-[#FD7B03] font-(family-name:--font-inter) tracking-tighter text-white">
            <div className="flex w-full items-center justify-center py-8 text-xl text-white opacity-40">
              (CB)
            </div>
            <div className="flex flex-row justify-between px-12 pb-8">
              <div className="w-90 text-5xl">
                Choose the <br /> best ones.
              </div>
              <div className="text-8xl">03</div>
            </div>
            <div className="flex w-full flex-row px-12">
              <div className="flex flex-1 flex-col border-t border-r border-white/30">
                <div className="flex w-full flex-row items-start gap-2 border-l border-white/30 p-6 pb-10">
                  <div className="size-1.5 rounded-full bg-white"></div>
                  <div className="text-xs leading-2">Side-by-side comparison</div>
                </div>
                <div className="flex w-45 flex-col gap-0 pt-4 leading-5">
                  <div className="pl-6">Pick the versions</div>
                  <div className="text-white/60">you like from the generations.</div>
                </div>
              </div>
              <div className="flex flex-1 flex-col border-t border-white/30">
                <div className="flex w-full flex-row items-start gap-2 border-r border-white/30 p-6 pb-10">
                  <div className="size-1.5 rounded-full bg-white"></div>
                  <div className="text-xs leading-2">Easy selection & review</div>
                </div>
                <div></div>
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <button className="flex w-fit items-center justify-center rounded-full bg-white px-5 py-2.5 text-xs text-black">
                Get started
              </button>
            </div>
            <div className="relative flex w-full flex-1 justify-center">
              <div className="absolute bottom-0 z-20 h-40 w-full bg-linear-to-b from-[#FC730300] to-[#FC7303]"></div>
              <div className="absolute bottom-12 h-100 w-100 rounded-4xl bg-white/30 align-middle md:h-120 md:w-220"></div>
            </div>
          </div>
        </FallingPagesPage>
      </FallingPages>
      <section className="relative z-30 flex h-screen flex-col bg-linear-to-b from-[#9A0101] to-[#FD7B03] font-(family-name:--font-inter) tracking-tighter text-white">
        <div className="flex w-full items-center justify-center py-8 text-xl text-white opacity-40">
          (AX)
        </div>
        <div className="flex flex-row justify-between px-12 pb-8">
          <div className="text-5xl">
            Ready-made <br />
            assets export.
          </div>
          <div className="text-8xl">04</div>
        </div>
        <div className="flex w-full flex-row px-12">
          <div className="flex flex-1 flex-col border-t border-r border-white/30">
            <div className="flex w-full flex-row items-start gap-2 border-l border-white/30 p-6 pb-10">
              <div className="size-1.5 rounded-full bg-white"></div>
              <div className="text-xs leading-2">Optimized for PDP & ads</div>
            </div>
            <div className="flex w-45 flex-col gap-0 pt-4 leading-5">
              <div className="pl-6">Export ready-made</div>
              <div className="text-white/60">files to your store, ads and social.</div>
            </div>
          </div>
          <div className="flex flex-1 flex-col border-t border-white/30">
            <div className="flex w-full flex-row items-start gap-2 border-r border-white/30 p-6 pb-10">
              <div className="size-1.5 rounded-full bg-white"></div>
              <div className="text-xs leading-2">One-click export</div>
            </div>
            <div></div>
          </div>
        </div>
        <div className="flex w-full items-center justify-center">
          <button className="flex w-fit items-center justify-center rounded-full bg-white px-5 py-2.5 text-xs text-black">
            Get started
          </button>
        </div>
        <div className="relative flex w-full flex-1 justify-center">
          <div className="absolute bottom-0 z-20 h-40 w-full bg-linear-to-b from-[#FC730300] to-[#FC7303]"></div>
          <div className="absolute bottom-12 h-100 w-100 rounded-4xl bg-white/30 align-middle md:h-120 md:w-220"></div>
        </div>
      </section>
      <section className="h-screen" />
    </div>
  );
}
