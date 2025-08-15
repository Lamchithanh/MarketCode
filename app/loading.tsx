import { PageLoader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <PageLoader 
      text="Đang tải trang..." 
      variant="default"
      size="2xl"
    />
  );
}
