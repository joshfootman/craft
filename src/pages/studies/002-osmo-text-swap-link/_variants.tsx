import { StudyVariants } from "~/components/study-variants";

// import {  } from "./_component";

function Main() {
  return <div className="flex h-full items-center justify-center pb-40"></div>;
}

export default function Variants() {
  return <StudyVariants variants={[{ label: "Main", component: Main }]} />;
}
