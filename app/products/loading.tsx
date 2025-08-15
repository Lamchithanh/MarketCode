import { PageLoader } from "@/components/ui/loader";

export default function ProductsLoading() {
  return (
    <PageLoader 
      text="Đang tải danh sách sản phẩm..." 
      variant="default"
      size="xl"
    />
  );
}
