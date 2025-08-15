"use client";

import { useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Separator } from "./separator";
import { 
  Loader, 
  PageLoader, 
  ButtonLoader, 
  TableLoader, 
  CardLoader, 
  InlineLoader,
  LoadingButton,
  LoadingWrapper,
  SkeletonLoader,
  SkeletonPatterns
} from "./loading-states";
import { 
  toast, 
  useToast, 
  toastMessages 
} from "./toast";

export function UIShowcase() {
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const { toast: hookToast } = useToast();

  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  const handleTableLoading = () => {
    setTableLoading(true);
    setTimeout(() => setTableLoading(false), 2000);
  };

  const handleCardLoading = () => {
    setCardLoading(true);
    setTimeout(() => setCardLoading(false), 2500);
  };

  const showToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        toast.success('Đây là thông báo thành công!');
        break;
      case 'error':
        toast.error('Đây là thông báo lỗi!');
        break;
      case 'warning':
        toast.warning('Đây là thông báo cảnh báo!');
        break;
      case 'info':
        toast.info('Đây là thông báo thông tin!');
        break;
    }
  };

  const showHookToast = () => {
    hookToast.success('Toast từ hook useToast!');
  };

  const showPromiseToast = () => {
    const promise = new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    
    toast.promise(promise, {
      loading: 'Đang xử lý...',
      success: 'Hoàn thành thành công!',
      error: 'Có lỗi xảy ra!',
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">UI Components Showcase</h1>
        <p className="text-muted-foreground">Demo các component Loader và Toast mới</p>
      </div>

      {/* Loader Components */}
      <Card>
        <CardHeader>
          <CardTitle>Loader Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Loaders */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Basic Loaders</h3>
            <div className="flex flex-wrap gap-4">
              <div className="text-center">
                <Loader size="sm" />
                <p className="text-sm text-muted-foreground mt-2">Small</p>
              </div>
              <div className="text-center">
                <Loader size="default" />
                <p className="text-sm text-muted-foreground mt-2">Default</p>
              </div>
              <div className="text-center">
                <Loader size="lg" />
                <p className="text-sm text-muted-foreground mt-2">Large</p>
              </div>
              <div className="text-center">
                <Loader size="xl" />
                <p className="text-sm text-muted-foreground mt-2">Extra Large</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Loader Types */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Loader Types</h3>
            <div className="flex flex-wrap gap-4">
              <div className="text-center">
                <Loader type="spinner" />
                <p className="text-sm text-muted-foreground mt-2">Spinner</p>
              </div>
              <div className="text-center">
                <Loader type="dots" />
                <p className="text-sm text-muted-foreground mt-2">Dots</p>
              </div>
              <div className="text-center">
                <Loader type="pulse" />
                <p className="text-sm text-muted-foreground mt-2">Pulse</p>
              </div>
              <div className="text-center">
                <Loader type="bars" />
                <p className="text-sm text-muted-foreground mt-2">Bars</p>
              </div>
              <div className="text-center">
                <Loader type="ring" />
                <p className="text-sm text-muted-foreground mt-2">Ring</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Loader Variants */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Loader Variants</h3>
            <div className="flex flex-wrap gap-4">
              <div className="text-center">
                <Loader variant="default" />
                <p className="text-sm text-muted-foreground mt-2">Default</p>
              </div>
              <div className="text-center">
                <Loader variant="secondary" />
                <p className="text-sm text-muted-foreground mt-2">Secondary</p>
              </div>
              <div className="text-center">
                <Loader variant="destructive" />
                <p className="text-sm text-muted-foreground mt-2">Destructive</p>
              </div>
              <div className="text-center">
                <Loader variant="outline" />
                <p className="text-sm text-muted-foreground mt-2">Outline</p>
              </div>
              <div className="text-center">
                <Loader variant="ghost" />
                <p className="text-sm text-muted-foreground mt-2">Ghost</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Specialized Loaders */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Specialized Loaders</h3>
            <div className="flex flex-wrap gap-4">
              <div className="text-center">
                <ButtonLoader />
                <p className="text-sm text-muted-foreground mt-2">Button Loader</p>
              </div>
              <div className="text-center">
                <InlineLoader />
                <p className="text-sm text-muted-foreground mt-2">Inline Loader</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>Loading States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Loading Wrappers */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Loading Wrappers</h3>
            <div className="space-y-4">
              <div>
                <Button onClick={handleLoading} className="mb-2">
                  Toggle Loading
                </Button>
                <LoadingWrapper isLoading={loading} fallback={<Loader text="Đang tải..." />}>
                  <p>Nội dung đã được tải xong!</p>
                </LoadingWrapper>
              </div>

              <div>
                <Button onClick={handleTableLoading} className="mb-2">
                  Toggle Table Loading
                </Button>
                <TableLoadingWrapper isLoading={tableLoading}>
                  <div className="p-4 border rounded">
                    <p>Bảng dữ liệu đã được tải!</p>
                  </div>
                </TableLoadingWrapper>
              </div>

              <div>
                <Button onClick={handleCardLoading} className="mb-2">
                  Toggle Card Loading
                </Button>
                <CardLoadingWrapper isLoading={cardLoading}>
                  <div className="p-4 border rounded">
                    <p>Card đã được tải!</p>
                  </div>
                </CardLoadingWrapper>
              </div>
            </div>
          </div>

          <Separator />

          {/* Loading Button */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Loading Button</h3>
            <LoadingButton 
              isLoading={loading} 
              onClick={handleLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded"
            >
              Click để Loading
            </LoadingButton>
          </div>

          <Separator />

          {/* Skeleton Patterns */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Skeleton Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Table Skeleton</h4>
                <SkeletonLoader isLoading={tableLoading} skeleton={<SkeletonPatterns.Table />}>
                  <p>Bảng dữ liệu thực</p>
                </SkeletonLoader>
              </div>
              <div>
                <h4 className="font-medium mb-2">Card Skeleton</h4>
                <SkeletonLoader isLoading={cardLoading} skeleton={<SkeletonPatterns.Card />}>
                  <p>Card thực</p>
                </SkeletonLoader>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toast System */}
      <Card>
        <CardHeader>
          <CardTitle>Toast System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Toasts */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Basic Toasts</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => showToast('success')} variant="default">
                Success Toast
              </Button>
              <Button onClick={() => showToast('error')} variant="destructive">
                Error Toast
              </Button>
              <Button onClick={() => showToast('warning')} variant="outline">
                Warning Toast
              </Button>
              <Button onClick={() => showToast('info')} variant="secondary">
                Info Toast
              </Button>
            </div>
          </div>

          <Separator />

          {/* Advanced Toasts */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Advanced Toasts</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={showHookToast} variant="outline">
                Hook Toast
              </Button>
              <Button onClick={showPromiseToast} variant="secondary">
                Promise Toast
              </Button>
              <Button 
                onClick={() => toast.loading('Loading...', { duration: 5000 })}
                variant="ghost"
              >
                Loading Toast
              </Button>
            </div>
          </div>

          <Separator />

          {/* Toast Messages */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Predefined Messages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Auth Messages</h4>
                <div className="space-y-2">
                  <Button 
                    size="sm" 
                    onClick={() => toast.success(toastMessages.auth.loginSuccess)}
                    variant="outline"
                  >
                    Login Success
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => toast.error(toastMessages.auth.loginError)}
                    variant="outline"
                  >
                    Login Error
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">CRUD Messages</h4>
                <div className="space-y-2">
                  <Button 
                    size="sm" 
                    onClick={() => toast.success(toastMessages.crud.createSuccess)}
                    variant="outline"
                  >
                    Create Success
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => toast.error(toastMessages.crud.createError)}
                    variant="outline"
                  >
                    Create Error
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Page Loader Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Page Loader Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => {
              const loader = toast.loading('Đang tải trang...');
              setTimeout(() => {
                toast.dismiss(loader);
                toast.success('Trang đã được tải!');
              }, 3000);
            }}
            className="w-full"
          >
            Show Page Loading (3s)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
