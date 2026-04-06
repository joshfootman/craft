import { cn } from "~/lib/utils";

function TextSwapLink({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group relative flex w-full gap-[0.75em] overflow-hidden py-[0.75em] pl-(--menu-padding)",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function TextSwapLinkBackground({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children">) {
  return (
    <div
      className={cn(
        "absolute inset-0 origin-[50%_100%] scale-y-0 bg-neutral-800 transition-transform duration-550 ease-(--cubic-hover) group-focus-within:scale-y-100 group-hover:scale-y-100 motion-reduce:scale-y-100 motion-reduce:opacity-0 motion-reduce:transition-none motion-reduce:duration-0 motion-reduce:group-focus-within:opacity-100 motion-reduce:group-hover:opacity-100",
        className,
      )}
      {...props}
    ></div>
  );
}

function TextSwapLinkAnchor({ children, className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "z-1 overflow-hidden p-2 text-[4em] leading-[0.75] font-bold uppercase [text-box:trim-both_cap_alphabetic] focus-visible:outline-none md:text-[5.625em]",
        className,
      )}
      {...props}
    >
      <span className="absolute inset-0 z-1"></span>
      <span className="inline-block transition-transform duration-550 ease-(--cubic-hover) text-shadow-[0_1em_0] text-shadow-white group-focus-within:-translate-y-[1em] group-hover:-translate-y-[1em] motion-reduce:transition-none motion-reduce:duration-0 motion-reduce:text-shadow-none motion-reduce:group-focus-within:translate-y-0 motion-reduce:group-focus-within:text-white motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:text-white">
        {children}
      </span>
    </a>
  );
}

function TextSwapLinkEyebrow({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("pointer-events-none z-1 text-orange-500", className)} {...props}>
      {children}
    </div>
  );
}

export { TextSwapLink, TextSwapLinkAnchor, TextSwapLinkEyebrow, TextSwapLinkBackground };

export function Demo() {
  const MenuItems = ["About Us", "Our Work", "Services", "Blog", "Contact Us"];

  return (
    <div className="flex h-full flex-col items-center justify-center pb-40">
      <div className="w-fit @xl:w-[35em]">
        {MenuItems.map((item, i) => (
          <TextSwapLink
            key={item}
            style={
              {
                "--font-bebas": "Bebas Neue",
                "--menu-padding": "2em",
                "--cubic-hover": "cubic-bezier(0.65, 0.05, 0, 1)",
              } as React.CSSProperties
            }
          >
            <TextSwapLinkAnchor className="font-(family-name:--font-bebas)" href="#">
              {item}
            </TextSwapLinkAnchor>
            <TextSwapLinkEyebrow className="font-mono">0{i + 1}</TextSwapLinkEyebrow>
            <TextSwapLinkBackground />
          </TextSwapLink>
        ))}
      </div>
    </div>
  );
}
