import { SidebarNav } from "@/components/layout/sidebar-nav";

export function Sidebar() {
  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-3 py-4 md:flex">
      <SidebarNav />
    </aside>
  );
}
