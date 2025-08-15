import { PageLoader } from "@/components/ui/loader";

export default function ProfileLoading() {
  return (
    <PageLoader 
      text="Đang tải hồ sơ..." 
      variant="default"
      size="xl"
    />
  );
}
