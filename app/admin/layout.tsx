import type { Metadata } from "next";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Quản trị - MarketCode",
  description: "Bảng điều khiển quản trị MarketCode",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <SidebarInset className="flex-1 flex flex-col min-w-0 w-full">
            <header className={cn(
              "relative flex h-16 items-center px-4 border-b border-border/40",
              "bg-gradient-to-br from-primary/5 via-background to-accent/5"
            )}>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] opacity-20" />
              <div className="relative flex items-center gap-2 w-full">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mx-2 h-6" />
                <div className="font-semibold text-foreground">Bảng điều khiển quản trị</div>
              </div>
            </header>
            <main className="flex-1 p-6 bg-background overflow-x-auto w-full">
              <div className="w-full min-w-0 max-w-none">
                {children}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
