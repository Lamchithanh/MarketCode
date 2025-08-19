import { useState, useEffect, useMemo } from 'react';
import { Project } from '@/types';

interface UseProductsListReturn {
  products: Project[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  totalProducts: number;
}

export function useProductsList(): UseProductsListReturn {
  const [allProducts, setAllProducts] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('newest');

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/products/all');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const result = await response.json();
        
        if (result.success && result.products) {
          setAllProducts(result.products);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'Tất cả' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort products
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'price-low':
          const priceA = parseFloat(a.price.replace(/[^\d]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^\d]/g, ''));
          return priceA - priceB;
        case 'price-high':
          const priceA2 = parseFloat(a.price.replace(/[^\d]/g, ''));
          const priceB2 = parseFloat(b.price.replace(/[^\d]/g, ''));
          return priceB2 - priceA2;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        default:
          return 0;
      }
    });
  }, [allProducts, searchTerm, selectedCategory, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const products = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    products,
    loading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    totalProducts: filteredAndSortedProducts.length
  };
}
