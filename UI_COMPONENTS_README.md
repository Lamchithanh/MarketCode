# UI Components - Loader & Toast System

## 📋 Tổng quan

Web đã được tích hợp đầy đủ hệ thống Loader và Toast UI để thay thế các thông báo cơ bản của window và cung cấp trải nghiệm người dùng tốt hơn.

## 🎯 Các Component Đã Tạo

### 1. Loader System (`components/ui/loader.tsx`)

#### Các loại Loader:
- **Spinner**: Xoay tròn (mặc định)
- **Dots**: 3 chấm nhấp nháy
- **Pulse**: Nhấp nháy tròn
- **Bars**: 3 thanh nhấp nháy
- **Ring**: Vòng tròn xoay

#### Các kích thước:
- `sm`: 16x16px
- `default`: 24x24px
- `lg`: 32x32px
- `xl`: 48x48px
- `2xl`: 64x64px

#### Các variants:
- `default`: Màu primary
- `secondary`: Màu secondary
- `destructive`: Màu đỏ
- `outline`: Màu border
- `ghost`: Màu muted

#### Các component chuyên biệt:
- `PageLoader`: Loader toàn màn hình
- `ButtonLoader`: Loader cho button
- `TableLoader`: Loader cho bảng
- `CardLoader`: Loader cho card
- `InlineLoader`: Loader inline

### 2. Toast System (`components/ui/toast.tsx`)

#### Các loại Toast:
- `success`: Thông báo thành công
- `error`: Thông báo lỗi
- `warning`: Thông báo cảnh báo
- `info`: Thông báo thông tin
- `loading`: Thông báo đang xử lý

#### Tính năng:
- Tự động đóng sau thời gian nhất định
- Hỗ trợ action buttons
- Promise toast tự động
- Thông báo tiếng Việt
- Tùy chỉnh vị trí hiển thị

### 3. Loading States (`components/ui/loading-states.tsx`)

#### Các wrapper:
- `LoadingWrapper`: Wrapper cơ bản
- `PageLoadingWrapper`: Wrapper cho trang
- `TableLoadingWrapper`: Wrapper cho bảng
- `CardLoadingWrapper`: Wrapper cho card
- `ButtonLoadingWrapper`: Wrapper cho button

#### Skeleton Patterns:
- `Table`: Skeleton cho bảng
- `Card`: Skeleton cho card
- `Profile`: Skeleton cho profile
- `Form`: Skeleton cho form
- `List`: Skeleton cho danh sách
- `Grid`: Skeleton cho grid

### 4. Confirmation Modal System (`components/ui/confirmation-modal.tsx`)

#### Các loại Modal:
- **Default**: Modal thông tin cơ bản
- **Warning**: Modal cảnh báo với icon tam giác
- **Danger**: Modal nguy hiểm với icon X đỏ
- **Info**: Modal thông tin với icon info
- **Success**: Modal thành công với icon check

#### Các component được định nghĩa sẵn:
- `DeleteConfirmationModal`: Modal xác nhận xóa
- `LogoutConfirmationModal`: Modal xác nhận đăng xuất
- `UnsavedChangesModal`: Modal cảnh báo thay đổi chưa lưu
- `ActionConfirmationModal`: Modal xác nhận hành động tùy chỉnh

#### Hook:
- `useConfirmationModal`: Hook để tạo modal động với Promise

## 🚀 Cách Sử Dụng

### 1. Loader Cơ Bản

```tsx
import { Loader } from "@/components/ui/loader";

// Loader đơn giản
<Loader />

// Loader với kích thước và loại
<Loader size="lg" type="dots" variant="destructive" />

// Loader với text
<Loader text="Đang tải..." textPosition="bottom" />

// Loader toàn màn hình
<PageLoader text="Đang tải trang..." />
```

### 2. Toast Notifications

```tsx
import { toast, useToast, toastMessages } from "@/components/ui/toast";

// Toast cơ bản
toast.success("Thành công!");
toast.error("Có lỗi xảy ra!");
toast.warning("Cảnh báo!");
toast.info("Thông tin");

// Toast với hook
const { toast: hookToast } = useToast();
hookToast.success("Thành công!");

// Toast với promise
toast.promise(
  apiCall(),
  {
    loading: "Đang xử lý...",
    success: "Thành công!",
    error: "Có lỗi xảy ra!"
  }
);

// Toast với action
toast.success("Thành công!", {
  action: {
    label: "Hoàn tác",
    onClick: () => handleUndo()
  }
});

// Sử dụng message có sẵn
toast.success(toastMessages.auth.loginSuccess);
toast.error(toastMessages.crud.createError);
```

### 3. Loading States

```tsx
import { 
  LoadingWrapper, 
  TableLoadingWrapper, 
  SkeletonLoader,
  SkeletonPatterns 
} from "@/components/ui/loading-states";

// Wrapper cơ bản
<LoadingWrapper isLoading={loading} fallback={<Loader />}>
  <p>Nội dung đã tải</p>
</LoadingWrapper>

// Wrapper cho bảng
<TableLoadingWrapper isLoading={loading}>
  <table>...</table>
</TableLoadingWrapper>

// Skeleton loading
<SkeletonLoader 
  isLoading={loading} 
  skeleton={<SkeletonPatterns.Table />}
>
  <table>...</table>
</SkeletonLoader>
```

### 4. Loading Button

```tsx
import { LoadingButton } from "@/components/ui/loading-states";

<LoadingButton 
  isLoading={loading} 
  loadingText="Đang xử lý..."
  onClick={handleSubmit}
  className="bg-primary text-white px-4 py-2 rounded"
>
  Gửi
</LoadingButton>
```

### 5. Confirmation Modal

```tsx
import { 
  ConfirmationModal, 
  DeleteConfirmationModal,
  LogoutConfirmationModal,
  useConfirmationModal 
} from "@/components/ui/confirmation-modal";

// Basic usage
<ConfirmationModal
  open={showModal}
  onOpenChange={setShowModal}
  title="Xác nhận hành động"
  description="Bạn có chắc chắn muốn thực hiện?"
  type="warning"
  confirmText="Thực hiện"
  cancelText="Hủy"
  onConfirm={handleConfirm}
/>

// Predefined modals
<DeleteConfirmationModal
  open={showDeleteModal}
  onOpenChange={setShowDeleteModal}
  itemName="Sản phẩm ABC"
  onConfirm={handleDelete}
/>

// Hook usage
const { confirm } = useConfirmationModal();
const handleAction = async () => {
  const result = await confirm({
    title: "Xác nhận",
    description: "Bạn có chắc chắn?",
    type: "danger",
    onConfirm: () => deleteItem()
  });
  
  if (result) {
    console.log("User confirmed!");
  }
};
```

## 📱 Responsive & Accessibility

- Tất cả component đều responsive
- Hỗ trợ keyboard navigation
- ARIA labels cho screen readers
- Tương thích với theme sáng/tối

## 🎨 Customization

### Tùy chỉnh Loader:

```tsx
// Tùy chỉnh màu sắc
<Loader className="text-blue-500" />

// Tùy chỉnh animation
<Loader className="animate-bounce" />

// Tùy chỉnh kích thước
<Loader className="w-20 h-20" />
```

### Tùy chỉnh Toast:

```tsx
// Tùy chỉnh thời gian hiển thị
toast.success("Thành công!", { duration: 10000 });

// Tùy chỉnh vị trí
toast.success("Thành công!", { position: "bottom-center" });

// Tùy chỉnh action
toast.success("Thành công!", {
  action: {
    label: "Xem chi tiết",
    onClick: () => navigate("/details")
  }
});
```

## 🔧 Integration với Admin Panel

### Thay thế window.confirm:

```tsx
// Thay vì
if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
  // xử lý
}

// Sử dụng confirmation modal
<DeleteConfirmationModal
  open={showDeleteModal}
  onOpenChange={setShowDeleteModal}
  itemName="Sản phẩm ABC"
  onConfirm={handleDelete}
/>

// Hoặc sử dụng hook
const { confirm } = useConfirmationModal();
const handleDelete = async () => {
  const result = await confirm({
    title: "Xác nhận xóa",
    description: "Bạn có chắc chắn muốn xóa?",
    type: "danger",
    onConfirm: () => deleteItem()
  });
  
  if (result) {
    // User confirmed
    toast.success("Xóa thành công!");
  }
};
```

### Thay thế loading cơ bản:

```tsx
// Thay vì
if (status === "loading") {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      <p>Đang tải...</p>
    </div>
  );
}

// Sử dụng PageLoader
import { PageLoader } from "@/components/ui/loader";

if (status === "loading") {
  return <PageLoader text="Đang tải admin dashboard..." size="2xl" />;
}
```

### Loading states trong admin:

```tsx
// Trong admin components
const [loading, setLoading] = useState(false);

// Sử dụng
<TableLoadingWrapper isLoading={loading}>
  <UsersTable />
</TableLoadingWrapper>

// Hoặc
<SkeletonLoader 
  isLoading={loading} 
  skeleton={<SkeletonPatterns.Table rows={10} columns={6} />}
>
  <UsersTable />
</SkeletonLoader>
```

## 📁 File Structure

```
components/ui/
├── loader.tsx              # Loader components
├── toast.tsx               # Toast system
├── loading-states.tsx      # Loading state wrappers
├── confirmation-modal.tsx  # Confirmation modal system
├── sonner.tsx              # Sonner integration
└── index.ts                # Export all components
```

## 🎯 Best Practices

1. **Sử dụng đúng loại loader**: PageLoader cho trang, TableLoader cho bảng
2. **Toast messages ngắn gọn**: Không quá dài, dễ đọc
3. **Loading states nhất quán**: Sử dụng cùng pattern trong toàn bộ app
4. **Skeleton loading**: Sử dụng cho content dài, không chỉ spinner
5. **Error handling**: Luôn có error toast cho các operation quan trọng

## 🚀 Performance

- Lazy loading cho các component không cần thiết
- Optimized animations với CSS transforms
- Minimal re-renders với React.memo khi cần
- Efficient state management

## 🔍 Troubleshooting

### Toast không hiển thị:
- Kiểm tra `<Toaster />` đã được thêm vào layout
- Kiểm tra z-index của toast
- Kiểm tra theme configuration

### Loader không hoạt động:
- Kiểm tra CSS animations đã được import
- Kiểm tra Tailwind CSS classes
- Kiểm tra component props

### Loading states không sync:
- Kiểm tra state management
- Kiểm tra async operations
- Kiểm tra useEffect dependencies

## 📚 Examples

Xem các file demo để có ví dụ đầy đủ về cách sử dụng:

- `components/ui/ui-showcase.tsx` - Demo Loader và Toast components
- `app/confirmation-demo/page.tsx` - Demo Confirmation Modal components
- `app/loader-demo/page.tsx` - Demo tất cả Loader components và Loading States
- `app/toast-demo/page.tsx` - Demo Toast System và các tính năng

## 🤝 Contributing

Khi thêm component mới:
1. Tạo component trong `components/ui/`
2. Export trong `components/ui/index.ts`
3. Cập nhật README này
4. Thêm vào showcase nếu cần

---

**Lưu ý**: Tất cả component đều sử dụng design system hiện tại và tương thích với theme của web.
