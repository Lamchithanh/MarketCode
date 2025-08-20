import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminGitCodeManagement } from "@/components/admin/gitcode";

export default async function AdminGitCodePage() {
  const session = await getServerSession(authOptions);
  
  // Middleware đã handle auth rồi, chỉ cần kiểm tra session exists
  if (!session) {
    redirect("/login");
  }

  return <AdminGitCodeManagement />;
}
