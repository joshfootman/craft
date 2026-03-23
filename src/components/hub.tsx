import { group_studies } from "~/lib/studies";
import type { Meta } from "~/types/study";

function StudyLink({ study }: { study: Meta }) {
  return (
    <a
      href={`/studies/${study.id}`}
      className="flex items-baseline justify-between gap-4 rounded-md px-3 py-2 text-sm hover:bg-muted"
    >
      <span className="font-medium">{study.title}</span>
      <span className="shrink-0 text-xs text-muted-foreground">{study.date}</span>
    </a>
  );
}

function BreakdownCard({ category, studies }: { category: string; studies: Meta[] }) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-3 text-sm font-semibold tracking-tight">{category}</h2>
      <div className="flex flex-col gap-0.5">
        {studies.map((study) => (
          <StudyLink key={study.id} study={study} />
        ))}
      </div>
    </div>
  );
}

export function Hub({ studies }: { studies: Meta[] }) {
  const { breakdowns, standalone } = group_studies(studies);

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col gap-8 p-8">
      {breakdowns.size > 0 && (
        <div className="flex flex-col gap-4">
          {[...breakdowns.entries()].map(([category, category_studies]) => (
            <BreakdownCard key={category} category={category} studies={category_studies} />
          ))}
        </div>
      )}
      {standalone.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {standalone.map((study) => (
            <StudyLink key={study.id} study={study} />
          ))}
        </div>
      )}
    </div>
  );
}
