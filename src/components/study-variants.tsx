import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";

export type Variant = {
  label: string;
  component: React.ComponentType;
};

export function StudyVariants({ variants }: { variants: Variant[] }) {
  if (variants.length === 1) {
    const Component = variants[0].component;
    return <Component />;
  }

  return (
    <Tabs defaultValue={variants[0].label} className="flex h-full flex-col">
      <div className="flex px-2 py-1.5">
        <TabsList variant="line">
          {variants.map((v) => (
            <TabsTrigger key={v.label} value={v.label}>
              {v.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {variants.map((v) => (
        <TabsContent key={v.label} value={v.label} className="flex-1">
          <v.component />
        </TabsContent>
      ))}
    </Tabs>
  );
}
