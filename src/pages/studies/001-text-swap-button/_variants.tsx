import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { StudyVariants } from "~/components/study-variants";

import { TextSwapButton, TextSwapButtonIcon, TextSwapButtonText } from "./_component";

function OnClickVariant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-full items-center justify-center pb-40">
      <TextSwapButton active={isOpen} onClick={() => setIsOpen((curr) => !curr)}>
        <TextSwapButtonText className="text-6xl">
          {(inactive) => (inactive ? "Menu" : "Close")}
        </TextSwapButtonText>
        <TextSwapButtonIcon>
          <PlusIcon className="size-20 stroke-[1.5]" />
        </TextSwapButtonIcon>
      </TextSwapButton>
    </div>
  );
}

export default function Variants() {
  return <StudyVariants variants={[{ label: "On Click w/ Icon", component: OnClickVariant }]} />;
}
