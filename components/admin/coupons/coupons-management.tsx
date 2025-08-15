'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { CouponsHeader } from './coupons-header';
import { CouponsStats } from './coupons-stats';
import { CouponsSearch } from './coupons-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Eye, Trash2, Database, Percent, DollarSign } from 'lucide-react';
import { CouponViewDialog } from './coupon-view-dialog';
import { CouponFormDialog } from './coupon-form-dialog';
import { CouponDeleteDialog } from './coupon-delete-dialog';

interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minAmount?: number;
  maxAmount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'SAVE20',
    name: '20% Off Everything',
    description: 'Get 20% discount on all products',
    type: 'PERCENTAGE',
    value: 20,
    minAmount: 50,
    maxAmount: 200,
    usageLimit: 1000,
    usageCount: 456,
    isActive: true,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-12-31T23:59:59Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    code: 'NEWUSER',
    name: 'New User Discount',
    description: 'Special discount for new customers',
    type: 'FIXED',
    value: 10,
    minAmount: 25,
    usageLimit: 500,
    usageCount: 234,
    isActive: true,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-06-30T23:59:59Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '3',
    code: 'SUMMER2024',
    name: 'Summer Sale',
    description: 'Summer seasonal discount',
    type: 'PERCENTAGE',
    value: 15,
    minAmount: 30,
    usageLimit: 200,
    usageCount: 89,
    isActive: false,
    validFrom: '2024-06-01T00:00:00Z',
    validUntil: '2024-08-31T23:59:59Z',
    createdAt: '2024-05-15T00:00:00Z',
    updatedAt: '2024-09-01T00:00:00Z',
  },
];

export function CouponsManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>(mockCoupons);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter coupons based on search term
  useEffect(() => {
    const filtered = coupons.filter(coupon =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCoupons(filtered);
  }, [coupons, searchTerm]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getDiscountDisplay = (coupon: Coupon) => {
    if (coupon.type === 'PERCENTAGE') {
      return (
        <div className="flex items-center space-x-1">
          <Percent className="h-3 w-3 text-stone-600" />
          <span>{coupon.value}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1">
          <DollarSign className="h-3 w-3 text-stone-600" />
          <span>{formatCurrency(coupon.value)}</span>
        </div>
      );
    }
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  const handleAddCoupon = () => {
    setSelectedCoupon(null); // null = Add mode
    setIsFormDialogOpen(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon); // coupon = Edit mode
    setIsFormDialogOpen(true);
  };

  const handleDeleteCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteDialogOpen(true);
  };

  const handleViewCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsViewDialogOpen(true);
  };

  const handleSaveCoupon = (couponData: any) => {
    if (couponData.id) {
      // Edit mode - update existing coupon
      setCoupons(coupons.map(c => c.id === couponData.id ? { ...c, ...couponData } : c));
    } else {
      // Add mode - create new coupon
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: couponData.code,
        name: couponData.code, // Use code as name for consistency
        description: couponData.description,
        type: couponData.type === 'FIXED_AMOUNT' ? 'FIXED' : couponData.type,
        value: couponData.value,
        minAmount: couponData.minOrderAmount,
        maxAmount: couponData.maxDiscount,
        usageLimit: couponData.usageLimit,
        usageCount: 0,
        isActive: couponData.isActive,
        validFrom: new Date().toISOString(),
        validUntil: couponData.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default 30 days
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCoupons([...coupons, newCoupon]);
    }
    setSelectedCoupon(null);
  };

  const handleConfirmDelete = (couponToDelete: Coupon) => {
    setCoupons(coupons.filter(c => c.id !== couponToDelete.id));
    setSelectedCoupon(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <CouponsHeader onAddCoupon={handleAddCoupon} />

      {/* Refresh Info */}
      <div className="flex items-center justify-end space-x-2">
        {lastUpdated && (
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
        <RefreshCw 
          className={`h-4 w-4 ${loading ? 'animate-spin' : ''} text-muted-foreground cursor-pointer hover:text-foreground`}
          onClick={handleRefresh}
        />
      </div>

      {/* Stats Cards */}
      <CouponsStats coupons={coupons} />

      {/* Search and Filters */}
      <CouponsSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Coupons Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Coupons Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coupon</TableHead>
                <TableHead>Type & Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground font-mono">
                        {coupon.code}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {coupon.name}
                      </p>
                      {coupon.description && (
                        <p className="text-xs text-muted-foreground truncate max-w-48">
                          {coupon.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {getDiscountDisplay(coupon)}
                      </div>
                      {coupon.minAmount && (
                        <p className="text-xs text-muted-foreground">
                          Min: {formatCurrency(coupon.minAmount)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {coupon.usageCount}
                        {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                      </p>
                      {coupon.usageLimit && (
                        <div className="w-full bg-stone-100 rounded-full h-2">
                          <div 
                            className="bg-stone-600 h-2 rounded-full" 
                            style={{
                              width: `${Math.min((coupon.usageCount / coupon.usageLimit) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      <p>From: {formatDate(coupon.validFrom)}</p>
                      <p>Until: {formatDate(coupon.validUntil)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isExpired(coupon.validUntil) ? (
                      <Badge variant="destructive">Expired</Badge>
                    ) : (
                      <Badge 
                        variant={coupon.isActive ? 'default' : 'secondary'}
                        className={coupon.isActive ? 'bg-green-100 text-green-800' : ''}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(coupon.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewCoupon(coupon)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCoupon(coupon)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteCoupon(coupon)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Coupon Dialog */}
      <CouponViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        coupon={selectedCoupon}
      />

      {/* Coupon Form Dialog (Add/Edit) */}
      <CouponFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        coupon={selectedCoupon}
        onSave={handleSaveCoupon}
      />

      {/* Delete Coupon Dialog */}
      <CouponDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        coupon={selectedCoupon}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
