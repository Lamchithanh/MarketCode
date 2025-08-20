'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { 
  Github, 
  Globe, 
  Eye, 
  Star, 
  Heart, 
  Search,
  Filter,
  User,
  Calendar,
  Code2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { usePublicGitCodes } from '@/hooks/use-gitcode';
import type { GitCodeItem } from '@/hooks/use-gitcode';
import { useCategories } from '@/hooks/use-categories';

export function GitCodeGallery() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [technologyFilter, setTechnologyFilter] = useState('all');

  const { 
    gitCodes, 
    loading, 
    fetchGitCodes 
  } = usePublicGitCodes();
  
  const { categories } = useCategories();

  useEffect(() => {
    fetchGitCodes();
  }, [fetchGitCodes]);

  // Get all unique technologies from all gitcodes
  const allTechnologies = [...new Set(
    gitCodes.flatMap((gitcode: GitCodeItem) => gitcode.technologies || [])
  )].sort();

  const filteredGitCodes = gitCodes.filter((gitcode: GitCodeItem) => {
    const matchesSearch = gitcode.title.toLowerCase().includes(search.toLowerCase()) ||
                         gitcode.description?.toLowerCase().includes(search.toLowerCase()) ||
                         gitcode.User?.name?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || gitcode.categoryId === categoryFilter;
    
    const matchesTechnology = technologyFilter === 'all' || 
                             gitcode.technologies?.includes(technologyFilter);

    return matchesSearch && matchesCategory && matchesTechnology;
  });

  const handleViewIncrement = async (id: string) => {
    try {
      await fetch(`/api/gitcode/${id}`, {
        method: 'GET'
      });
      // Refresh data to get updated view count
      fetchGitCodes();
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <Code2 className="inline-block h-10 w-10 mr-3 text-primary" />
            GitCode Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Khám phá các dự án GitHub miễn phí được chia sẻ bởi cộng đồng MarketCode
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Bộ lọc & Tìm kiếm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên dự án, mô tả, hoặc tác giả..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={technologyFilter} onValueChange={setTechnologyFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Công nghệ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả công nghệ</SelectItem>
                    {allTechnologies.map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Stats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {loading ? 'Đang tải...' : `Tìm thấy ${filteredGitCodes.length} dự án`}
          </p>
        </div>

        {/* GitCode Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredGitCodes.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <Github className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Không tìm thấy dự án nào</h3>
                <p>Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGitCodes.map((gitcode: GitCodeItem) => (
              <Card key={gitcode.id} className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {gitcode.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {gitcode.description}
                    </p>
                    
                    {/* Author & Date */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {gitcode.User?.name || 'Anonymous'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(gitcode.createdAt), { 
                          addSuffix: true,
                          locale: vi 
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Technologies */}
                  {gitcode.technologies?.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {gitcode.technologies.slice(0, 4).map((tech: string) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {gitcode.technologies.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{gitcode.technologies.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {gitcode.tags?.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {gitcode.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {gitcode.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{gitcode.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  {gitcode.imageUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                      <Image 
                        src={gitcode.imageUrl} 
                        alt={gitcode.title}
                        width={300}
                        height={128}
                        className="w-full h-32 object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {gitcode.viewCount || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {gitcode.starCount || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {gitcode.likeCount || 0}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {gitcode.githubUrl && (
                      <Button
                        size="sm"
                        variant="default"
                        className="flex-1"
                        onClick={() => {
                          handleViewIncrement(gitcode.id);
                          window.open(gitcode.githubUrl, '_blank');
                        }}
                      >
                        <Github className="h-4 w-4 mr-1" />
                        GitHub
                      </Button>
                    )}
                    {gitcode.demoUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.open(gitcode.demoUrl, '_blank')}
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        Demo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
