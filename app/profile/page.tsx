import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Hồ sơ cá nhân</h1>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{session.user.name}</h2>
              <p className="text-gray-600">{session.user.email}</p>
              <p className="text-sm text-gray-500">
                Vai trò: {session.user.role}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Thông tin cá nhân</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Tên:</span> {session.user.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {session.user.email}
                </p>
                <p>
                  <span className="font-medium">Vai trò:</span>{" "}
                  {session.user.role}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Thống kê</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Đơn hàng:</span> 0
                </p>
                <p>
                  <span className="font-medium">Tải xuống:</span> 0
                </p>
                <p>
                  <span className="font-medium">Yêu thích:</span> 0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
