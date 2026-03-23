import { group_studies } from "~/lib/studies";
import { get_pattern } from "~/lib/patterns";
import { PatternBg } from "~/components/pattern-bg";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { Meta } from "~/types/study";

function StudyCard({ study }: { study: Meta }) {
  const pattern = get_pattern(study.id);

  return (
    <Card className="group relative overflow-hidden">
      <div className="relative h-32">
        <PatternBg pattern={pattern} />
      </div>
      <CardContent className="flex flex-col gap-2 p-4">
        <h3 className="text-sm font-semibold">{study.title}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">{study.description}</p>
        {study.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {study.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <a href={`/studies/${study.id}`} className="absolute inset-0">
          <span className="sr-only">View {study.title}</span>
        </a>
      </CardContent>
    </Card>
  );
}

function StudyGroup({ title, studies }: { title: string; studies: Meta[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {studies.map((study) => (
          <StudyCard key={study.id} study={study} />
        ))}
      </div>
    </section>
  );
}

export function Hub({ studies }: { studies: Meta[] }) {
  const { breakdowns, standalone } = group_studies(studies);

  return (
    <div className="flex flex-col gap-10 p-8">
      {[...breakdowns.entries()].map(([category, category_studies]) => (
        <StudyGroup key={category} title={category} studies={category_studies} />
      ))}
      {standalone.length > 0 && (
        <StudyGroup title="Studies" studies={standalone} />
      )}
    </div>
  );
}
