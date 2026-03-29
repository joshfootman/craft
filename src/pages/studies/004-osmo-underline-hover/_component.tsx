import { mergeProps } from "@base-ui/react";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "~/lib/utils";

function Underline({ className, render, ...props }: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "relative after:absolute after:bottom-0 after:left-0 after:h-0.25 after:w-full after:origin-[right_center] after:scale-[0_1] after:bg-orange-500 after:transition-transform after:duration-400 after:ease-[--cubic] hover:after:origin-[left_center] hover:after:scale-[1_1]",
          className,
        ),
      },
      props,
    ),
    render,
  });
}

export function Demo() {
  const Socials = ["Instagram", "LinkedIn", "X/Twitter", "Awwwards"];

  return (
    <div
      className="flex h-full flex-col items-center justify-center pb-40"
      style={{ "--cubic": "cubic-bezier(0.65, 0.05, 0, 1)" } as React.CSSProperties}
    >
      <div className="flex flex-row gap-6 text-2xl">
        {Socials.map((social) => (
          <Underline key={social} render={<a href="#" />} className="after:h-0.5">
            {social}
          </Underline>
        ))}
      </div>
    </div>
  );
}
