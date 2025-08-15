"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader, PageLoader, ButtonLoader, TableLoader, CardLoader, InlineLoader } from "./loader";
import { Skeleton } from "./skeleton";

// Loading States for different UI patterns
export interface LoadingStatesProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

// Basic loading wrapper
export function LoadingWrapper({ 
  isLoading, 
  children, 
  fallback = <InlineLoader />,
  className 
}: LoadingStatesProps) {
  if (isLoading) {
    return <div className={cn("flex items-center justify-center", className)}>{fallback}</div>;
  }
  return <>{children}</>;
}

// Page loading wrapper
export function PageLoadingWrapper({ 
  isLoading, 
  children, 
  text = "Đang tải trang...",
  className 
}: LoadingStatesProps & { text?: string }) {
  if (isLoading) {
    return <PageLoader text={text} className={className} />;
  }
  return <>{children}</>;
}

// Table loading wrapper
export function TableLoadingWrapper({ 
  isLoading, 
  children, 
  text = "Đang tải dữ liệu...",
  className 
}: LoadingStatesProps & { text?: string }) {
  if (isLoading) {
    return <TableLoader text={text} className={className} />;
  }
  return <>{children}</>;
}

// Card loading wrapper
export function CardLoadingWrapper({ 
  isLoading, 
  children, 
  text = "Đang tải...",
  className 
}: LoadingStatesProps & { text?: string }) {
  if (isLoading) {
    return <CardLoader text={text} className={className} />;
  }
  return <>{children}</>;
}

// Button loading wrapper
export function ButtonLoadingWrapper({ 
  isLoading, 
  children, 
  loadingText = "Đang xử lý...",
  className 
}: LoadingStatesProps & { loadingText?: string }) {
  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <ButtonLoader />
        <span>{loadingText}</span>
      </div>
    );
  }
  return <>{children}</>;
}

// Skeleton loading patterns
export function SkeletonLoader({ 
  isLoading, 
  children, 
  skeleton,
  className 
}: LoadingStatesProps & { 
  skeleton: React.ReactNode;
}) {
  if (isLoading) {
    return <div className={className}>{skeleton}</div>;
  }
  return <>{children}</>;
}

// Common skeleton patterns
export const SkeletonPatterns = {
  // Table skeleton
  Table: ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-24" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-4 w-24" />
          ))}
        </div>
      ))}
    </div>
  ),

  // Card skeleton
  Card: ({ lines = 3 }: { lines?: number }) => (
    <div className="space-y-3">
      <Skeleton className="h-6 w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  ),

  // Profile skeleton
  Profile: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),

  // Form skeleton
  Form: ({ fields = 4 }: { fields?: number }) => (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  ),

  // List skeleton
  List: ({ items = 5 }: { items?: number }) => (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  ),

  // Grid skeleton
  Grid: ({ rows = 3, cols = 3 }: { rows?: number; cols?: number }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} className="space-y-3 p-4 border rounded-lg">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  ),
};

// Loading overlay for modals and dialogs
export function LoadingOverlay({ 
  isLoading, 
  children, 
  text = "Đang xử lý...",
  className 
}: LoadingStatesProps & { text?: string }) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className={cn(
          "absolute inset-0 bg-background/80 backdrop-blur-sm z-10",
          "flex items-center justify-center",
          className
        )}>
          <div className="text-center">
            <Loader size="lg" />
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading button component
export function LoadingButton({ 
  isLoading, 
  children, 
  loadingText = "Đang xử lý...",
  disabled,
  className,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingText?: string;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <ButtonLoader />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

// Loading text component
export function LoadingText({ 
  isLoading, 
  children, 
  loadingText = "Đang tải...",
  className 
}: LoadingStatesProps & { loadingText?: string }) {
  if (isLoading) {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <InlineLoader />
        {loadingText}
      </span>
    );
  }
  return <>{children}</>;
}
