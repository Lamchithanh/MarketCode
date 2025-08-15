'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { CategoriesHeader } from './categories-header';
import { CategoriesStats } from './categories-stats';
import { CategoriesSearch } from './categories-search';
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
import { MoreHorizontal, Edit, Eye, Trash2, Database } from 'lucide-react';
import { CategoryViewDialog } from './category-view-dialog';
import { CategoryFormDialog } from './category-form-dialog';
import { CategoryDeleteDialog } from './category-delete-dialog';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  productCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Dashboard Templates',
    slug: 'dashboard-templates',
    description: 'Admin and dashboard templates',
    icon: '📊',
    productCount: 25,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'E-commerce',
    slug: 'ecommerce',
    description: 'E-commerce website templates',
    icon: '🛒',
    productCount: 18,
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
  {
    id: '3',
    name: 'Landing Pages',
    slug: 'landing-pages',
    description: 'Marketing and landing page templates',
    icon: '🌟',
    productCount: 32,
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '4',
    name: 'Backend APIs',
    slug: 'backend-apis',
    description: 'Backend API starters and frameworks',
    icon: '⚡',
    productCount: 12,
    isActive: false,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
];

export function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter categories based on search term
  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing categories:', error);
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

  const handleAddCategory = () => {
    setSelectedCategory(null); // null = Add mode
    setIsFormDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category); // category = Edit mode
    setIsFormDialogOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsViewDialogOpen(true);
  };

  const handleSaveCategory = (categoryData: any) => {
    if (categoryData.id) {
      // Edit mode - update existing category
      setCategories(categories.map(c => c.id === categoryData.id ? { ...c, ...categoryData } : c));
    } else {
      // Add mode - create new category
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        icon: categoryData.icon,
        isActive: categoryData.isActive,
        productCount: 0, // New categories start with 0 products
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories([...categories, newCategory]);
    }
    setSelectedCategory(null);
  };

  const handleConfirmDelete = (categoryToDelete: Category) => {
    setCategories(categories.filter(c => c.id !== categoryToDelete.id));
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <CategoriesHeader onAddCategory={handleAddCategory} />

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
      <CategoriesStats categories={categories} />

      {/* Search and Filters */}
      <CategoriesSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Categories Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Categories Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{category.icon || '📁'}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {category.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      /{category.slug}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-foreground">
                      {category.productCount || 0} products
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={category.isActive ? 'default' : 'destructive'}
                      className={category.isActive ? 'bg-green-100 text-green-800' : ''}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(category.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(category.updatedAt)}
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
                        <DropdownMenuItem onClick={() => handleViewCategory(category)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteCategory(category)}
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

      {/* View Category Dialog */}
      <CategoryViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        category={selectedCategory}
      />

      {/* Category Form Dialog (Add/Edit) */}
      <CategoryFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />

      {/* Delete Category Dialog */}
      <CategoryDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        category={selectedCategory}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
