'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { TagMultiSelect } from './tag-multi-select';
import { ImageUpload } from './image-upload';
import { useAllTags } from '@/hooks/use-all-tags';
import { Tag } from '@/lib/services/product-service';
import Image from 'next/image';

// Default thumbnail image
const DEFAULT_THUMBNAIL = '/Images/do.jpg';

// Get the default thumbnail
const getDefaultThumbnail = () => {
  return DEFAULT_THUMBNAIL;
};

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  images?: string[];
  githubUrl?: string;
  demoUrl?: string;
  downloadCount: number;
  viewCount: number;
  isActive: boolean;
  category: string;
  tags: Tag[];
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductItem | null;
  onSave: (productData: ProductFormData) => void;
}

interface ProductFormData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  images?: string[];
  categoryId: string;
  tags: string[]; // Tag IDs
  technologies: string[];
  features?: Array<{
    title: string;
    description: string;
  }>;
  isActive?: boolean;
}

export function ProductFormDialog({ open, onOpenChange, product, onSave }: ProductFormDialogProps) {
  const isEditMode = !!product;
  const { tags: availableTags, loading: tagsLoading } = useAllTags();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: 0,
    thumbnailUrl: '',
    githubUrl: '',
    demoUrl: '',
    isActive: true,
    categoryId: '',
    technologies: '',
  });

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const result = await response.json();
          // API returns {categories: [...]} format
          if (result.categories && Array.isArray(result.categories)) {
            console.log('Categories loaded:', result.categories.length);
            setCategories(result.categories);
          } else if (Array.isArray(result)) {
            console.log('Categories loaded as array:', result.length);
            setCategories(result);
          } else {
            console.error('Unexpected categories response format:', result);
            setCategories([]);
            toast.error('Failed to load categories - unexpected format');
          }
        } else {
          console.error('Failed to fetch categories');
          toast.error('Failed to load categories');
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error loading categories');
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (open) {
      if (isEditMode && product) {
        console.log('ProductFormDialog - Edit mode, product data:', {
          title: product.title,
          images: product.images,
          githubUrl: product.githubUrl,
          demoUrl: product.demoUrl,
          tags: product.tags
        });
        
        // For edit mode, we need to find the categoryId from category name
        // This is a temporary solution - ideally we should store categoryId in product
        const matchedCategory = categories.find(cat => cat.name === product.category);
        
        setFormData({
          title: product.title,
          slug: product.slug,
          description: product.description,
          price: product.price,
          thumbnailUrl: product.thumbnailUrl || '',
          githubUrl: product.githubUrl || '',
          demoUrl: product.demoUrl || '',
          isActive: product.isActive,
          categoryId: matchedCategory?.id || '',
          technologies: product.technologies.join(', '),
        });
        
        // Set selected tags and images
        setSelectedTags(product.tags || []);
        setSelectedImages(product.images || []);
        
        // Set thumbnail preview if exists
        if (product.thumbnailUrl) {
          setThumbnailPreview(product.thumbnailUrl);
        } else {
          setThumbnailPreview(null);
        }
      } else {
        setFormData({
          title: '',
          slug: '',
          description: '',
          price: 0,
          thumbnailUrl: '',
          githubUrl: '',
          demoUrl: '',
          isActive: true,
          categoryId: '',
          technologies: '',
        });
        
        // Clear selected tags and images
        setSelectedTags([]);
        setSelectedImages([]);
        setThumbnailPreview(null);
      }
      
      setErrors({});
      setLoading(false);
    }
  }, [open, product, isEditMode, categories]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    } else if (formData.slug.trim().length < 3) {
      newErrors.slug = 'Slug must be at least 3 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    } else if (formData.price > 10000) {
      newErrors.price = 'Price cannot exceed $10,000';
    }

    if (!formData.categoryId.trim()) {
      newErrors.categoryId = 'Category is required';
    }

    // Removed thumbnail URL validation - will use default image if not uploaded

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png', 
      'image/webp',
      'image/gif',
      'image/bmp'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only JPG, PNG, WEBP, GIF, and BMP images are allowed.';
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return 'File size too large. Maximum size is 5MB.';
    }

    return null;
  };

  const handleThumbnailUpload = async (file: File) => {
    try {
      // Validate file first
      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      setThumbnailUploading(true); // Start uploading state
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
      
      toast.info('Uploading thumbnail...'); // Show uploading message
      
      // Upload file to server
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'thumbnails'); // Specify folder for better organization
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Upload response:', result); // Debug log
        
        // Check the actual API response structure
        if (result.success && result.url) {
          handleInputChange('thumbnailUrl', result.url);
          toast.success('Thumbnail uploaded successfully');
        } else {
          throw new Error(result.error || 'Upload failed - no URL returned');
        }
      } else {
        const errorText = await response.text();
        console.error('Upload failed with status:', response.status, errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast.error(`Failed to upload thumbnail: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Reset preview on error
      setThumbnailPreview(null);
    } finally {
      setThumbnailUploading(false); // End uploading state
    }
  };

  const removeThumbnail = () => {
    setThumbnailPreview(null);
    setThumbnailUploading(false);
    handleInputChange('thumbnailUrl', '');
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        
        // Debug: Log form data before saving
        console.log('Form save - selectedImages:', selectedImages);
        console.log('Form save - selectedTags:', selectedTags);
        
        // Set default thumbnail if none provided
        let finalThumbnailUrl = formData.thumbnailUrl;
        if (!finalThumbnailUrl || finalThumbnailUrl.trim() === '') {
          finalThumbnailUrl = getDefaultThumbnail();
          console.log('Using default thumbnail:', finalThumbnailUrl);
        }
        
        const productData: ProductFormData = {
          ...formData,
          thumbnailUrl: finalThumbnailUrl, // Use final thumbnail URL
          ...(isEditMode && product ? { id: product.id } : {}),
          images: selectedImages,
          tags: selectedTags.map(tag => tag.id), // Use tag IDs
          technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
          price: Number(formData.price),
        };
        
        console.log('Sending productData:', productData);
        
        await onSave(productData);
        
        // Reset form on successful save
        if (!isEditMode) {
          setFormData({
            title: '',
            slug: '',
            description: '',
            price: 0,
            thumbnailUrl: '',
            githubUrl: '',
            demoUrl: '',
            isActive: true,
            categoryId: '',
            technologies: '',
          });
          setSelectedTags([]);
          setSelectedImages([]);
          setThumbnailPreview(null);
        }
        
        toast.success(isEditMode ? 'Product updated successfully' : 'Product created successfully');
        onOpenChange(false);
      } catch (error) {
        console.error('Error saving product:', error);
        toast.error('Failed to save product. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    handleInputChange('title', title);
    if (!isEditMode) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      handleInputChange('slug', slug);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update product information below. All fields marked with * are required.' : 'Create a new product by filling in the information below. All fields marked with * are required.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input 
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Product title"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input 
              id="slug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className={`mt-1 ${errors.slug ? 'border-red-500' : ''}`}
              placeholder="product-slug"
            />
            {errors.slug && (
              <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`mt-1 ${errors.description ? 'border-red-500' : ''}`}
              rows={3}
              placeholder="Product description"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input 
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                className={`mt-1 ${errors.price ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-600 mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(value) => handleInputChange('categoryId', value)}
                disabled={categoriesLoading}
              >
                <SelectTrigger className={`mt-1 ${errors.categoryId ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select a category"} />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          {category.icon && <span>{category.icon}</span>}
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      {categoriesLoading ? 'Loading...' : 'No categories available'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-600 mt-1">{errors.categoryId}</p>
              )}
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <Label>Thumbnail Image</Label>
            <div className="mt-2">
              {thumbnailPreview || formData.thumbnailUrl ? (
                <div className="relative inline-block">
                  <Image
                    src={thumbnailPreview || formData.thumbnailUrl}
                    alt="Thumbnail preview"
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  {thumbnailUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    disabled={thumbnailUploading}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Upload Option */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleThumbnailUpload(file);
                        }
                      }}
                      disabled={thumbnailUploading}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label htmlFor="thumbnail-upload" className={`cursor-pointer ${thumbnailUploading ? 'cursor-not-allowed opacity-50' : ''}`}>
                      <div className="text-gray-500">
                        {thumbnailUploading ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-2"></div>
                            <p className="text-sm">Uploading...</p>
                          </div>
                        ) : (
                          <>
                            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <p className="text-sm">Click to upload thumbnail</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, GIF up to 5MB</p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Default Images Option */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Or use the default thumbnail:</p>
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, thumbnailUrl: DEFAULT_THUMBNAIL });
                          setThumbnailPreview(DEFAULT_THUMBNAIL);
                          toast.success('Default thumbnail selected!');
                        }}
                        className={`relative group ${
                          formData.thumbnailUrl === DEFAULT_THUMBNAIL 
                            ? 'ring-2 ring-blue-500' 
                            : ''
                        }`}
                      >
                        <Image
                          src={DEFAULT_THUMBNAIL}
                          alt="Default thumbnail"
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-opacity"></div>
                        {formData.thumbnailUrl === DEFAULT_THUMBNAIL && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">
                      Don&apos;t worry! If you skip uploading a thumbnail, we&apos;ll automatically assign one when you save.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Optional: Upload a thumbnail image or default image will be used</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input 
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                className={`mt-1 ${errors.githubUrl ? 'border-red-500' : ''}`}
                placeholder="https://github.com/username/repo"
              />
              {errors.githubUrl && (
                <p className="text-sm text-red-600 mt-1">{errors.githubUrl}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Optional: Link to source code repository</p>
            </div>
            <div>
              <Label htmlFor="demoUrl">Demo URL</Label>
              <Input 
                id="demoUrl"
                value={formData.demoUrl}
                onChange={(e) => handleInputChange('demoUrl', e.target.value)}
                className={`mt-1 ${errors.demoUrl ? 'border-red-500' : ''}`}
                placeholder="https://demo.example.com"
              />
              {errors.demoUrl && (
                <p className="text-sm text-red-600 mt-1">{errors.demoUrl}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Optional: Link to live demo</p>
            </div>
          </div>

          <div>
            <ImageUpload
              images={selectedImages}
              onImagesChange={setSelectedImages}
              maxImages={4}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="mt-1">
              <TagMultiSelect
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                availableTags={availableTags}
                placeholder="Select tags..."
              />
              {tagsLoading && (
                <p className="text-xs text-gray-500 mt-1">Loading tags...</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="technologies">Technologies (comma separated)</Label>
            <Input 
              id="technologies"
              value={formData.technologies}
              onChange={(e) => handleInputChange('technologies', e.target.value)}
              className="mt-1"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.isActive ? 'active' : 'inactive'} 
              onValueChange={(value) => handleInputChange('isActive', value === 'active')}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditMode ? 'Update Product' : 'Add Product'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
