import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  text?: string;
  className?: string;
  bgColor?: string;
  textColor?: string;
}

export function PlaceholderImage({
  width = 300,
  height = 200,
  text = "Image",
  className,
  bgColor = "#3B82F6",
  textColor = "#FFFFFF"
}: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg font-medium text-white",
        className
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: bgColor,
        color: textColor,
        fontSize: `${Math.min(width, height) / 15}px`
      }}
    >
      {text}
    </div>
  );
}

// Predefined placeholders for common use cases
export function ProductPlaceholder({ className }: { className?: string }) {
  return (
    <PlaceholderImage
      width={300}
      height={200}
      text="Product Image"
      bgColor="#10B981"
      textColor="#FFFFFF"
      className={className}
    />
  );
}

export function AvatarPlaceholder({ className }: { className?: string }) {
  return (
    <PlaceholderImage
      width={40}
      height={40}
      text="👤"
      bgColor="#6B7280"
      textColor="#FFFFFF"
      className={cn("rounded-full", className)}
    />
  );
}

export function DashboardPlaceholder({ className }: { className?: string }) {
  return (
    <PlaceholderImage
      width={300}
      height={200}
      text="Dashboard"
      bgColor="#8B5CF6"
      textColor="#FFFFFF"
      className={className}
    />
  );
}
