'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { ProductsHeader } from './products-header';
import { ProductsStats } from './products-stats';
import { ProductsSearch } from './products-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { MoreHorizontal, Edit, Eye, Trash2, Download, Database } from 'lucide-react';
import { ProductViewDialog } from './product-view-dialog';
import { ProductFormDialog } from './product-form-dialog';
import { ProductDeleteDialog } from './product-delete-dialog';
import { useProducts } from '@/hooks/use-products';
import { toast } from 'sonner';

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  downloadCount: number;
  viewCount: number;
  isActive: boolean;
  category: string;
  tags: string[];
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  categoryId: string;
  tags: string[];
  technologies: string[];
  isActive?: boolean;
}

export function ProductsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
    stats
  } = useProducts();

  // Filter products based on search term
  useEffect(() => {
    if (products) {
      const filtered = products.map(product => ({
        id: product.id,
        title: product.title,
        slug: product.slug,
        description: product.description || '',
        price: product.price,
        thumbnailUrl: product.thumbnailUrl,
        downloadCount: product.downloadCount || 0,
        viewCount: product.viewCount || 0,
        isActive: product.isActive ?? true,
        category: 'Unknown', // We'll need to fetch category name separately
        tags: [], // We'll need to fetch tags separately
        technologies: product.technologies || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      })).filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);

  const handleRefresh = async () => {
    try {
      await fetchProducts();
      toast.success('Products refreshed successfully');
    } catch (error) {
      console.error('Error refreshing products:', error);
      toast.error('Failed to refresh products');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null); // null = Add mode
    setIsFormDialogOpen(true);
  };

  const handleEditProduct = (product: ProductItem) => {
    setSelectedProduct(product); // product = Edit mode
    setIsFormDialogOpen(true);
  };

  const handleDeleteProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleViewProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleSaveProduct = async (productData: ProductFormData) => {
    try {
      if (productData.id) {
        // Edit mode - update existing product
        await updateProduct(productData.id, {
          title: productData.title,
          slug: productData.slug,
          description: productData.description,
          price: productData.price,
          thumbnailUrl: productData.thumbnailUrl,
          categoryId: productData.categoryId,
          technologies: productData.technologies,
          isActive: productData.isActive
        });
        toast.success('Product updated successfully');
      } else {
        // Add mode - create new product
        // For now, we'll use a placeholder userId - in a real app, this would come from auth context
        await createProduct({
          userId: '00000000-0000-0000-0000-000000000000', // Placeholder - should come from auth
          title: productData.title,
          slug: productData.slug,
          description: productData.description,
          price: productData.price,
          thumbnailUrl: productData.thumbnailUrl,
          categoryId: productData.categoryId,
          technologies: productData.technologies,
          isActive: productData.isActive ?? true
        });
        toast.success('Product created successfully');
      }
      setSelectedProduct(null);
      setIsFormDialogOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleConfirmDelete = async (productToDelete: ProductItem) => {
    try {
      await deleteProduct(productToDelete.id);
      toast.success('Product deleted successfully');
      setSelectedProduct(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Show error if any
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <Button onClick={handleRefresh} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProductsHeader onAddProduct={handleAddProduct} />

      {/* Refresh Info */}
      <div className="flex items-center justify-end space-x-2">
        {/* lastUpdated state was removed, so this will always be null */}
        {/* <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdated?.toLocaleTimeString()}
        </p> */}
        <RefreshCw 
          className={`h-4 w-4 ${loading ? 'animate-spin' : ''} text-muted-foreground cursor-pointer hover:text-foreground`}
          onClick={handleRefresh}
        />
      </div>

      {/* Stats Cards */}
      {stats && <ProductsStats products={products || []} />}

      {/* Search and Filters */}
      <ProductsSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Products Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Products Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Statistics</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={product.thumbnailUrl} alt={product.title} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                          {product.title.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{product.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {product.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground">{formatPrice(product.price)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Download className="w-3 h-3 mr-1" />
                        {product.downloadCount.toLocaleString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Eye className="w-3 h-3 mr-1" />
                        {product.viewCount.toLocaleString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={product.isActive ? 'default' : 'destructive'}
                      className={product.isActive ? 'bg-green-100 text-green-800' : ''}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(product.createdAt)}
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
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteProduct(product)}
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

      {/* View Product Dialog */}
      <ProductViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        product={selectedProduct}
      />

      {/* Product Form Dialog (Add/Edit) */}
      <ProductFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />

      {/* Delete Product Dialog */}
      <ProductDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        product={selectedProduct}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
