import { ArrowDownRight, ArrowUpRight, Award } from "lucide-react";

import { DataList, DataListRow } from "@/components/chakrm/data-list";
import { SectionHeader } from "@/components/chakrm/section-header";
import { StatCard } from "@/components/chakrm/stat-card";
import { Card } from "@/components/ui/card";
import { formatCredits } from "@/lib/format";
import { CURRENT_USER, TRANSACTIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function WalletPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="gap-0 bg-linear-160 from-card to-primary-soft">
          <span className="px-(--card-spacing) text-xs text-muted-foreground">
            Current balance
          </span>
          <div className="px-(--card-spacing) font-mono text-3xl font-semibold tabular-nums">
            {formatCredits(CURRENT_USER.credits)}
          </div>
          <span className="px-(--card-spacing) text-xs text-primary">
            Credits
          </span>
        </Card>
        <StatCard label="Committed" value="820" icon={ArrowDownRight} />
        <StatCard
          label="Total rewards earned"
          value="38,210"
          sub="+1,240"
          icon={Award}
          tone="primary"
        />
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader title="Transaction history" />
        <DataList>
          {TRANSACTIONS.map((transaction, index) => (
            <DataListRow key={index} className="py-3">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  transaction.positive ? "bg-primary-soft" : "bg-destructive-soft",
                )}
              >
                {transaction.positive ? (
                  <ArrowUpRight className="size-3.5 text-primary" />
                ) : (
                  <ArrowDownRight className="size-3.5 text-destructive" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm">{transaction.desc}</div>
                <div className="text-xs text-faint">
                  {transaction.type} · {transaction.t}
                </div>
              </div>
              <span
                className={cn(
                  "font-mono text-sm font-semibold tabular-nums",
                  transaction.positive ? "text-primary" : "text-destructive",
                )}
              >
                {transaction.amt > 0 ? "+" : ""}
                {formatCredits(transaction.amt)}
              </span>
            </DataListRow>
          ))}
        </DataList>
      </div>
    </div>
  );
}
