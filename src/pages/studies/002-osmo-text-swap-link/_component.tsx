import { cn } from "~/lib/utils";

function TextSwapLink({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("group relative flex gap-3 overflow-hidden py-2 pl-8", className)}
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
        "absolute inset-0 origin-[50%_100%] scale-y-0 bg-neutral-800 transition-transform duration-550 ease-[cubic-bezier(0.65,0.05,0,1)] group-hover:scale-y-100",
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
        "z-1 overflow-hidden p-2 text-7xl font-bold uppercase [text-box:trim-both_cap_alphabetic]",
        className,
      )}
      {...props}
    >
      <span className="absolute inset-0 z-1"></span>
      <span className="inline-block transition-transform duration-550 ease-[cubic-bezier(0.65,0.05,0,1)] text-shadow-[0_1em_0] text-shadow-white group-hover:-translate-y-[1em]">
        {children}
      </span>
    </a>
  );
}

function TextSwapLinkEyebrow({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("z-1 text-orange-500", className)} {...props}>
      {children}
    </div>
  );
}

export function Demo() {
  const MenuItems = ["About Us", "Our Work", "Services", "Blog", "Contact Us"];

  return (
    <div className="flex h-full flex-col items-center justify-center pb-40">
      <div className="w-fit @xl:w-[35em]">
        {MenuItems.map((item, i) => (
          <TextSwapLink key={item} style={{ "--font-bebas": "Bebas Neue" } as React.CSSProperties}>
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
