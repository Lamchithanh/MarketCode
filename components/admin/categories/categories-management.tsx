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
import { useCategories } from '@/hooks/use-categories';
import { toast } from 'sonner';

interface CategoryItem {
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

interface CategoryFormData {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

export function CategoriesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
    stats
  } = useCategories();

  // Filter categories based on search term
  useEffect(() => {
    if (categories) {
      const filtered = categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        productCount: category.productCount || 0, // Use productCount from API
        isActive: true, // Default to true since Category interface doesn't have this
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      })).filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCategories(filtered);
    }
  }, [categories, searchTerm]);

  const handleRefresh = async () => {
    try {
      await fetchCategories();
      toast.success('Categories refreshed successfully');
    } catch (error) {
      console.error('Error refreshing categories:', error);
      toast.error('Failed to refresh categories');
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

  const handleEditCategory = (category: CategoryItem) => {
    setSelectedCategory(category); // category = Edit mode
    setIsFormDialogOpen(true);
  };

  const handleDeleteCategory = (category: CategoryItem) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleViewCategory = (category: CategoryItem) => {
    setSelectedCategory(category);
    setIsViewDialogOpen(true);
  };

  const handleSaveCategory = async (categoryData: CategoryFormData) => {
    try {
      if (categoryData.id) {
        // Edit mode - update existing category
        await updateCategory(categoryData.id, {
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          icon: categoryData.icon
        });
        toast.success('Category updated successfully');
      } else {
        // Add mode - create new category
        await createCategory({
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          icon: categoryData.icon
        });
        toast.success('Category created successfully');
      }
      setSelectedCategory(null);
      setIsFormDialogOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleConfirmDelete = async (categoryToDelete: CategoryItem) => {
    try {
      await deleteCategory(categoryToDelete.id);
      toast.success('Category deleted successfully');
      setSelectedCategory(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
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
      <CategoriesHeader onAddCategory={handleAddCategory} />

      {/* Refresh Info */}
      <div className="flex items-center justify-end space-x-2">
        <p className="text-sm text-muted-foreground">
          Total: {stats?.total || 0} categories
        </p>
        <RefreshCw 
          className={`h-4 w-4 ${loading ? 'animate-spin' : ''} text-muted-foreground cursor-pointer hover:text-foreground`}
          onClick={handleRefresh}
        />
      </div>

      {/* Stats Cards */}
      <CategoriesStats categories={filteredCategories} />

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
