import { DataList, DataListRow } from "@/components/chakrm/data-list";
import { AUDIT_LOG } from "@/lib/mock-data";
import type { AuditTone } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONE_DOT: Record<AuditTone, string> = {
  emerald: "bg-primary",
  gold: "bg-gold",
  red: "bg-destructive",
  muted: "bg-faint",
};

export default function AuditPage() {
  return (
    <DataList>
      {AUDIT_LOG.map((entry) => (
        <DataListRow key={entry.id}>
          <span
            className={cn("mt-1.5 size-2 shrink-0 rounded-full", TONE_DOT[entry.tone])}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-semibold">{entry.admin}</span>
              <span className="text-sm text-muted-foreground">
                {entry.action.toLowerCase()}
              </span>
            </div>
            <span className="text-xs text-faint">{entry.detail}</span>
          </div>
          <span className="w-16 shrink-0 text-right text-xs text-faint">
            {entry.t}
          </span>
        </DataListRow>
      ))}
    </DataList>
  );
}
