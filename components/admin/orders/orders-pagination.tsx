'use client';

import { Button } from '@/components/ui/button';

interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function OrdersPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  loading,
  onPageChange
}: OrdersPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-sm text-muted-foreground">
        Hiển thị {startItem}-{endItem} trong tổng số {totalItems} đơn hàng
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
        >
          Trước
        </Button>
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => 
              page === 1 || 
              page === totalPages || 
              Math.abs(page - currentPage) <= 2
            )
            .map((page, index, array) => (
              <div key={page} className="flex items-center">
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-2 text-sm text-muted-foreground">...</span>
                )}
                <Button
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  disabled={loading}
                >
                  {page}
                </Button>
              </div>
            ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || loading}
        >
          Sau
        </Button>
      </div>
    </div>
  );
}
