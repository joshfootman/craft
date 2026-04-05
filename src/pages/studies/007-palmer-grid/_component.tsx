import React from "react";
import { cn } from "~/lib/utils";
import { PalmerDraggableGrid } from "./palmer-grid";

const GRID = [
  [3, 7, 1, 5, 2],
  [4, 6, 3, 7, 1],
  [5, 2, 4, 6, 1],
  [3, 5, 1, 6, 2],
  [4, 6, 3, 5, 1],
  [5, 6, 2, 1, 4],
  [3, 4, 1, 2, 6],
  [5, 2, 4, 6, 1],
  [3, 5, 1, 6, 2],
  [4, 6, 3, 5, 1],
];

type PalmerGridContextValue = {
  grid: PalmerDraggableGrid;
};

const PalmerGridContext = React.createContext<PalmerGridContextValue | null>(null);

function usePalmerGridContext() {
  const context = React.useContext(PalmerGridContext);
  if (!context) {
    throw new Error("Palmer components must be used within PalmerRoot.");
  }
  return context;
}

function PalmerRoot({ children, className, ...props }: React.ComponentProps<"div">) {
  const grid = React.useMemo(() => new PalmerDraggableGrid(), []);

  React.useLayoutEffect(() => {
    grid.init();

    return () => {
      grid.destroy();
    };
  }, [grid]);

  return (
    <PalmerGridContext.Provider value={{ grid }}>
      <div data-slot="container" className={cn("flex h-full w-full", className)} {...props}>
        {children}
      </div>
    </PalmerGridContext.Provider>
  );
}

function PalmerGrid({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="grid" className={cn("absolute flex cursor-grab gap-20", className)} {...props}>
      {children}
    </div>
  );
}

function PalmerGridColumn({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-20 even:mt-40", className)} {...props}>
      {children}
    </div>
  );
}

function PalmerGridProduct({
  children,
  className,
  "data-id": id,
  ...props
}: React.ComponentProps<"div"> & { "data-id": number }) {
  return (
    <div
      data-slot="product"
      data-id={id}
      className={cn("relative aspect-square w-64", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { PalmerRoot, PalmerGrid, PalmerGridColumn, PalmerGridProduct, usePalmerGridContext };

export function Demo() {
  return (
    <PalmerRoot>
      <PalmerGrid>
        {GRID.map((col, i) => (
          <PalmerGridColumn key={`col-${i}`}>
            {col.map((id) => (
              <PalmerGridProduct key={`product-${i}-${id}`} data-id={id}>
                <img
                  className="absolute h-full w-full object-contain"
                  src={`/src/pages/studies/007-palmer-grid/assets/img-${id}.png`}
                />
              </PalmerGridProduct>
            ))}
          </PalmerGridColumn>
        ))}
      </PalmerGrid>
    </PalmerRoot>
  );
}
