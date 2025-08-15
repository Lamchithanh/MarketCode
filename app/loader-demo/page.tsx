"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Loader, 
  PageLoader, 
  ButtonLoader, 
  TableLoader, 
  CardLoader, 
  InlineLoader 
} from "@/components/ui/loader";
import { 
  LoadingWrapper, 
  TableLoadingWrapper, 
  CardLoadingWrapper,
  SkeletonLoader,
  SkeletonPatterns 
} from "@/components/ui/loading-states";

export default function LoaderDemoPage() {
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);

  const simulateLoading = (setter: (value: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 3000);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Loader System Demo</h1>
        <p className="text-muted-foreground">Demo tất cả các loại loader đã tạo</p>
      </div>

      {/* Basic Loaders */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Loader Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center space-y-4">
              <h4 className="font-medium">Spinner (Default)</h4>
              <div className="flex justify-center">
                <Loader />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h4 className="font-medium">Dots</h4>
              <div className="flex justify-center">
                <Loader type="dots" />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h4 className="font-medium">Pulse</h4>
              <div className="flex justify-center">
                <Loader type="pulse" />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h4 className="font-medium">Bars</h4>
              <div className="flex justify-center">
                <Loader type="bars" />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h4 className="font-medium">Ring</h4>
              <div className="flex justify-center">
                <Loader type="ring" />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h4 className="font-medium">Inline</h4>
              <div className="flex justify-center">
                <InlineLoader />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loader Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Loader Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <Loader size="sm" />
              <p className="text-xs mt-2">Small</p>
            </div>
            <div className="text-center">
              <Loader size="default" />
              <p className="text-xs mt-2">Default</p>
            </div>
            <div className="text-center">
              <Loader size="lg" />
              <p className="text-xs mt-2">Large</p>
            </div>
            <div className="text-center">
              <Loader size="xl" />
              <p className="text-xs mt-2">XL</p>
            </div>
            <div className="text-center">
              <Loader size="2xl" />
              <p className="text-xs mt-2">2XL</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loader Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Loader Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <Loader variant="default" />
              <p className="text-xs mt-2">Default</p>
            </div>
            <div className="text-center">
              <Loader variant="secondary" />
              <p className="text-xs mt-2">Secondary</p>
            </div>
            <div className="text-center">
              <Loader variant="destructive" />
              <p className="text-xs mt-2">Destructive</p>
            </div>
            <div className="text-center">
              <Loader variant="outline" />
              <p className="text-xs mt-2">Outline</p>
            </div>
            <div className="text-center">
              <Loader variant="ghost" />
              <p className="text-xs mt-2">Ghost</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specialized Loaders */}
      <Card>
        <CardHeader>
          <CardTitle>Specialized Loaders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center space-y-4">
              <h4 className="font-medium">Button Loader</h4>
              <div className="flex justify-center">
                <ButtonLoader />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h4 className="font-medium">Table Loader</h4>
              <div className="flex justify-center">
                <TableLoader />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h4 className="font-medium">Card Loader</h4>
              <div className="flex justify-center">
                <CardLoader />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h4 className="font-medium">Page Loader</h4>
              <div className="flex justify-center">
                <PageLoader size="lg" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading Wrappers */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Wrappers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Basic Loading Wrapper</h4>
            <div className="border rounded-lg p-4">
              <LoadingWrapper isLoading={loading}>
                <p>Nội dung đã tải xong!</p>
              </LoadingWrapper>
              <Button 
                onClick={() => simulateLoading(setLoading)} 
                className="mt-2"
                disabled={loading}
              >
                {loading ? "Đang tải..." : "Test Loading"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Table Loading Wrapper</h4>
            <div className="border rounded-lg p-4">
              <TableLoadingWrapper isLoading={tableLoading}>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Tên</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Vai trò</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2">Nguyễn Văn A</td>
                      <td className="p-2">a@example.com</td>
                      <td className="p-2">User</td>
                    </tr>
                  </tbody>
                </table>
              </TableLoadingWrapper>
              <Button 
                onClick={() => simulateLoading(setTableLoading)} 
                className="mt-2"
                disabled={tableLoading}
              >
                {tableLoading ? "Đang tải..." : "Test Table Loading"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Card Loading Wrapper</h4>
            <div className="border rounded-lg p-4">
              <CardLoadingWrapper isLoading={cardLoading}>
                <Card>
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Nội dung của card đã tải xong!</p>
                  </CardContent>
                </Card>
              </CardLoadingWrapper>
              <Button 
                onClick={() => simulateLoading(setCardLoading)} 
                className="mt-2"
                disabled={cardLoading}
              >
                {cardLoading ? "Đang tải..." : "Test Card Loading"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skeleton Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Skeleton Loading Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Table Skeleton</h4>
              <SkeletonPatterns.Table rows={3} columns={4} />
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Card Skeleton</h4>
              <SkeletonPatterns.Card />
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Profile Skeleton</h4>
              <SkeletonPatterns.Profile />
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Form Skeleton</h4>
              <SkeletonPatterns.Form />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loader with Text */}
      <Card>
        <CardHeader>
          <CardTitle>Loader with Text</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center space-y-4">
              <h4 className="font-medium">Text Below</h4>
              <Loader text="Đang tải dữ liệu..." textPosition="bottom" />
            </div>
            
            <div className="text-center space-y-4">
              <h4 className="font-medium">Text Above</h4>
              <Loader text="Đang xử lý..." textPosition="top" />
            </div>
            
            <div className="text-center space-y-4">
              <h4 className="font-medium">Text Left</h4>
              <Loader text="Đang tải..." textPosition="left" />
            </div>
            
            <div className="text-center space-y-4">
              <h4 className="font-medium">Text Right</h4>
              <Loader text="Đang tải..." textPosition="right" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
