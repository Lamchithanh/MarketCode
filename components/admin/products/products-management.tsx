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

interface Product {
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

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'React Admin Dashboard',
    slug: 'react-admin-dashboard',
    description: 'Modern admin dashboard built with React',
    price: 29.99,
    thumbnailUrl: 'https://via.placeholder.com/150',
    downloadCount: 1250,
    viewCount: 5670,
    isActive: true,
    category: 'Dashboard',
    tags: ['React', 'Admin', 'Dashboard'],
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Vue.js E-commerce Template',
    slug: 'vuejs-ecommerce-template',
    description: 'E-commerce website template with Vue.js',
    price: 39.99,
    thumbnailUrl: 'https://via.placeholder.com/150',
    downloadCount: 890,
    viewCount: 3420,
    isActive: true,
    category: 'E-commerce',
    tags: ['Vue.js', 'E-commerce', 'Template'],
    technologies: ['Vue.js', 'JavaScript', 'CSS'],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
  {
    id: '3',
    title: 'Node.js API Starter',
    slug: 'nodejs-api-starter',
    description: 'API starter kit with Node.js and Express',
    price: 19.99,
    thumbnailUrl: 'https://via.placeholder.com/150',
    downloadCount: 567,
    viewCount: 1890,
    isActive: false,
    category: 'Backend',
    tags: ['Node.js', 'API', 'Express'],
    technologies: ['Node.js', 'Express', 'MongoDB'],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
  },
];

export function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter products based on search term
  useEffect(() => {
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing products:', error);
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

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product); // product = Edit mode
    setIsFormDialogOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleSaveProduct = (productData: any) => {
    if (productData.id) {
      // Edit mode - update existing product
      setProducts(products.map(p => p.id === productData.id ? { ...p, ...productData } : p));
    } else {
      // Add mode - create new product
      const newProduct: Product = {
        id: Date.now().toString(),
        title: productData.title,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        thumbnailUrl: productData.thumbnailUrl,
        isActive: productData.isActive,
        category: productData.category,
        tags: productData.tags,
        technologies: productData.technologies,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts([...products, newProduct]);
    }
    setSelectedProduct(null);
  };

  const handleConfirmDelete = (productToDelete: Product) => {
    setProducts(products.filter(p => p.id !== productToDelete.id));
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProductsHeader onAddProduct={handleAddProduct} />

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
      <ProductsStats products={products} />

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
