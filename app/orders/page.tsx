import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Đơn hàng của tôi</h1>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Lịch sử đơn hàng</h2>
            <p className="text-gray-600 text-sm mt-1">
              Quản lý và theo dõi các đơn hàng của bạn
            </p>
          </div>

          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có đơn hàng nào
              </h3>
              <p className="text-gray-600 mb-4">
                Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm và tạo đơn
                hàng đầu tiên!
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Khám phá sản phẩm
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>
            Đăng nhập với:{" "}
            <span className="font-medium">{session.user.email}</span>
          </p>
          <p>
            Vai trò: <span className="font-medium">{session.user.role}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
