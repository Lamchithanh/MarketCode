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

interface TagItem {
  id: string;
  name: string;
  slug: string;
  color: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

const mockTags: TagItem[] = [
  {
    id: '1',
    name: 'React',
    slug: 'react',
    color: '#61DAFB',
    productCount: 25,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Next.js',
    slug: 'nextjs',
    color: '#000000',
    productCount: 18,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
  {
    id: '3',
    name: 'TypeScript',
    slug: 'typescript',
    color: '#3178C6',
    productCount: 32,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '4',
    name: 'Vue.js',
    slug: 'vuejs',
    color: '#4FC08D',
    productCount: 12,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    id: '5',
    name: 'Node.js',
    slug: 'nodejs',
    color: '#339933',
    productCount: 15,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z',
  },
];

export function TagsManagement() {
  const [tags, setTags] = useState<TagItem[]>(mockTags);
  const [filteredTags, setFilteredTags] = useState<TagItem[]>(mockTags);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedTag, setSelectedTag] = useState<TagItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter tags based on search term
  useEffect(() => {
    const filtered = tags.filter(tag =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTags(filtered);
  }, [tags, searchTerm]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing tags:', error);
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

  const handleSaveTag = (tagData: any) => {
    if (tagData.id) {
      // Edit mode - update existing tag
      setTags(tags.map(t => t.id === tagData.id ? { ...t, ...tagData } : t));
    } else {
      // Add mode - create new tag
      const newTag: TagItem = {
        id: Date.now().toString(),
        name: tagData.name,
        slug: tagData.slug,
        color: tagData.color,
        productCount: 0, // New tags start with 0 products
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTags([...tags, newTag]);
    }
    setSelectedTag(null);
  };

  const handleConfirmDelete = (tagToDelete: TagItem) => {
    setTags(tags.filter(t => t.id !== tagToDelete.id));
    setSelectedTag(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <TagsHeader onAddTag={handleAddTag} />

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
      <TagsStats tags={tags} />

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
