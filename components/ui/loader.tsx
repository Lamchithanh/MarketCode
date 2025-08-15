import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, RefreshCw, Circle } from "lucide-react";

const loaderVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "text-primary",
        secondary: "text-secondary-foreground",
        destructive: "text-destructive",
        outline: "text-border",
        ghost: "text-muted-foreground",
      },
      size: {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
        "2xl": "h-16 w-16",
      },
      type: {
        spinner: "",
        dots: "",
        pulse: "",
        bars: "",
        ring: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      type: "spinner",
    },
  }
);

export interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
  text?: string;
  textPosition?: "top" | "bottom" | "left" | "right";
  fullScreen?: boolean;
  overlay?: boolean;
}

export function Loader({
  className,
  variant,
  size,
  type,
  text,
  textPosition = "bottom",
  fullScreen = false,
  overlay = false,
  ...props
}: LoaderProps) {
  const renderLoader = () => {
    switch (type) {
      case "spinner":
        return <Loader2 className={cn(loaderVariants({ variant, size }), "animate-spin")} />;
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <Circle
                key={i}
                className={cn(
                  loaderVariants({ variant, size: "sm" }),
                  "animate-pulse"
                )}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );
      case "pulse":
        return (
          <div className={cn(loaderVariants({ variant, size }), "animate-pulse bg-current rounded-full")} />
        );
      case "bars":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  loaderVariants({ variant, size: "sm" }),
                  "animate-pulse bg-current rounded-sm"
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      case "ring":
        return (
          <div className="relative">
            <div
              className={cn(
                loaderVariants({ variant, size }),
                "animate-spin rounded-full border-2 border-current border-t-transparent"
              )}
            />
          </div>
        );
      default:
        return <Loader2 className={cn(loaderVariants({ variant, size }), "animate-spin")} />;
    }
  };

  const renderText = () => {
    if (!text) return null;
    
    const textClasses = cn(
      "text-sm text-muted-foreground mt-2",
      textPosition === "top" && "mb-2 mt-0",
      textPosition === "left" && "ml-2 mt-0",
      textPosition === "right" && "mr-2 mt-0"
    );

    return <span className={textClasses}>{text}</span>;
  };

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        textPosition === "left" && "flex-row",
        textPosition === "right" && "flex-row-reverse",
        className
      )}
      {...props}
    >
      {textPosition === "top" && renderText()}
      {textPosition === "left" && renderText()}
      {renderLoader()}
      {textPosition === "bottom" && renderText()}
      {textPosition === "right" && renderText()}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

// Specific loader components for common use cases
export function PageLoader({ text = "Đang tải trang...", ...props }: Omit<LoaderProps, "fullScreen">) {
  return <Loader fullScreen text={text} size="xl" {...props} />;
}

export function ButtonLoader({ size = "sm", ...props }: Omit<LoaderProps, "size" | "text">) {
  return <Loader size={size} type="spinner" {...props} />;
}

export function TableLoader({ text = "Đang tải dữ liệu...", ...props }: Omit<LoaderProps, "overlay">) {
  return <Loader overlay text={text} size="lg" {...props} />;
}

export function CardLoader({ text = "Đang tải...", ...props }: Omit<LoaderProps, "overlay">) {
  return <Loader overlay text={text} size="default" {...props} />;
}

export function InlineLoader({ ...props }: Omit<LoaderProps, "text" | "fullScreen" | "overlay">) {
  return <Loader size="sm" {...props} />;
}
