'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { TagsHeader } from './tags-header';
import { TagsStats } from './tags-stats';
import { TagsSearch } from './tags-search';
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
import { TagViewDialog } from './tag-view-dialog';
import { TagFormDialog } from './tag-form-dialog';
import { TagDeleteDialog } from './tag-delete-dialog';
import { useTags } from '@/hooks/use-tags';
import { toast } from 'sonner';

interface TagItem {
  id: string;
  name: string;
  slug: string;
  color: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface TagFormData {
  id?: string;
  name: string;
  slug: string;
  color: string;
}

export function TagsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTags, setFilteredTags] = useState<TagItem[]>([]);
  const [selectedTag, setSelectedTag] = useState<TagItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    tags,
    loading,
    error,
    createTag,
    updateTag,
    deleteTag,
    fetchTags,
    stats
  } = useTags();

  // Filter tags based on search term
  useEffect(() => {
    if (tags) {
      const filtered = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        color: tag.color || '#000000',
        productCount: tag.usageCount || 0, // Use usageCount from API
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt
      })).filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTags(filtered);
    }
  }, [tags, searchTerm]);

  const handleRefresh = async () => {
    try {
      await fetchTags();
      toast.success('Tags refreshed successfully');
    } catch (error) {
      console.error('Error refreshing tags:', error);
      toast.error('Failed to refresh tags');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleAddTag = () => {
    setSelectedTag(null); // null = Add mode
    setIsFormDialogOpen(true);
  };

  const handleEditTag = (tag: TagItem) => {
    setSelectedTag(tag); // tag = Edit mode
    setIsFormDialogOpen(true);
  };

  const handleDeleteTag = (tag: TagItem) => {
    setSelectedTag(tag);
    setIsDeleteDialogOpen(true);
  };

  const handleViewTag = (tag: TagItem) => {
    setSelectedTag(tag);
    setIsViewDialogOpen(true);
  };

  const handleSaveTag = async (tagData: TagFormData) => {
    try {
      if (tagData.id) {
        // Edit mode - update existing tag
        await updateTag(tagData.id, {
          name: tagData.name,
          slug: tagData.slug,
          color: tagData.color
        });
        toast.success('Tag updated successfully');
      } else {
        // Add mode - create new tag
        await createTag({
          name: tagData.name,
          slug: tagData.slug,
          color: tagData.color
        });
        toast.success('Tag created successfully');
      }
      setSelectedTag(null);
      setIsFormDialogOpen(false);
    } catch (error) {
      console.error('Error saving tag:', error);
      toast.error('Failed to save tag');
    }
  };

  const handleConfirmDelete = async (tagToDelete: TagItem) => {
    try {
      await deleteTag(tagToDelete.id);
      toast.success('Tag deleted successfully');
      setSelectedTag(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Failed to delete tag');
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
      <TagsHeader onAddTag={handleAddTag} />

      {/* Refresh Info */}
      <div className="flex items-center justify-end space-x-2">
        <p className="text-sm text-muted-foreground">
          Total: {stats?.total || 0} tags
        </p>
        <RefreshCw 
          className={`h-4 w-4 ${loading ? 'animate-spin' : ''} text-muted-foreground cursor-pointer hover:text-foreground`}
          onClick={handleRefresh}
        />
      </div>

      {/* Stats Cards */}
      <TagsStats tags={filteredTags} />

      {/* Search and Filters */}
      <TagsSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Tags Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Tags Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full border border-stone-200"
                        style={{ backgroundColor: tag.color }}
                      ></div>
                      <div>
                        <p className="font-medium text-foreground">{tag.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {tag.slug}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded-lg border border-stone-200"
                        style={{ backgroundColor: tag.color }}
                      ></div>
                      <span className="font-mono text-xs text-stone-600">
                        {tag.color}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-foreground">
                      {tag.productCount} products
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(tag.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(tag.updatedAt)}
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
                        <DropdownMenuItem onClick={() => handleViewTag(tag)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Products
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditTag(tag)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteTag(tag)}
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

      {/* View Tag Dialog */}
      <TagViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        tag={selectedTag}
      />

      {/* Tag Form Dialog (Add/Edit) */}
      <TagFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        tag={selectedTag}
        onSave={handleSaveTag}
      />

      {/* Delete Tag Dialog */}
      <TagDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        tag={selectedTag}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
