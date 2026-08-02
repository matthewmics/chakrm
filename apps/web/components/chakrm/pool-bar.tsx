import { cn } from "@/lib/utils";

type PoolBarProps = {
  a: string;
  b: string;
  retA: number;
  retB: number;
  className?: string;
};

/**
 * The signature element: one bar split by how the Credits pool is committed
 * between the two sides. Side A is always emerald, side B always gold.
 */
export function PoolBar({ a, b, retA, retB, className }: PoolBarProps) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium">
          {a} <span className="text-primary">{retA}%</span>
        </span>
        <span className="font-medium">
          {retB}% <span className="text-gold">{b}</span>
        </span>
      </div>
      <div className={cn("flex h-2.5 w-full overflow-hidden rounded-full bg-subtle")}>
        <div className="bg-primary" style={{ width: `${retA}%` }} />
        <div className="bg-gold" style={{ width: `${retB}%` }} />
      </div>
    </div>
  );
}
