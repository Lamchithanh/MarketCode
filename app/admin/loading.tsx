import { PageLoader } from "@/components/ui/loader";

export default function AdminLoading() {
  return (
    <PageLoader 
      text="Đang tải admin panel..." 
      variant="default"
      size="2xl"
    />
  );
}
