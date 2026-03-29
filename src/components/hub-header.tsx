import { Logo } from "~/assets/logo";
import type { Meta } from "~/types/study";
import { CommandMenu } from "./command-menu";

export function HubHeader({ studies }: { studies: Meta[] }) {
  return (
    <>
      <header className="flex shrink-0 items-center justify-between px-8 pt-8">
        <Logo />
        <div className="w-48 sm:w-64">
          <CommandMenu studies={studies} />
        </div>
      </header>
    </>
  );
}
