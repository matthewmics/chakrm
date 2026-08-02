"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="icon-sm" className="-ml-1 md:hidden" />
        }
      >
        <Menu />
        <span className="sr-only">Open navigation</span>
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[260px] gap-0 bg-sidebar px-3 py-4 sm:max-w-[260px]"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SheetDescription className="sr-only">
          Move between Chakrm sections.
        </SheetDescription>
        <SidebarNav onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
