import { cookies } from "next/headers";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Presence only, and not trusted for access control — the API verifies the
  // token. It exists so the topbar can server-render the right state instead of
  // flashing a skeleton on every page load for signed-out visitors, who are the
  // majority on a browsable-without-an-account app.
  const hadSessionCookie = (await cookies()).has("access_token");

  return (
    <div className="flex h-dvh w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar hadSessionCookie={hadSessionCookie} />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
