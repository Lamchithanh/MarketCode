"use client";

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Service } from '@/hooks/use-services';

// Form schema matching Service interface
const formSchema = z.object({
  name: z.string().min(1, 'Tên dịch vụ là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  price_from: z.string().min(1, 'Giá từ là bắt buộc'),
  price_text: z.string().min(1, 'Văn bản giá là bắt buộc'),
  duration: z.string().min(1, 'Thời gian là bắt buộc'),
  category: z.string().min(1, 'Danh mục là bắt buộc'),
  icon_name: z.string().min(1, 'Icon là bắt buộc'),
  display_order: z.string().min(1, 'Số thứ tự là bắt buộc'),
  popular: z.boolean(),
  is_active: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface ServiceFormProps {
  service?: Service | null;
  onSubmit: (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  loading?: boolean;
  totalServices?: number;
}

// Available categories
const categories = [
  'Thiết kế website',
  'Phát triển ứng dụng',
  'Marketing số',
  'Tối ưu SEO',
  'Bảo trì hệ thống',
  'Tư vấn công nghệ'
];

// Available icons
const icons = [
  'Globe', 'Smartphone', 'TrendingUp', 'Search', 
  'Settings', 'Lightbulb', 'Code', 'Database',
  'Shield', 'Zap', 'Target', 'Users'
];

// Function to generate slug from name
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export function ServiceForm({ service, onSubmit, onCancel, loading = false, totalServices = 0 }: ServiceFormProps) {
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(true);
  const suggestedDisplayOrder = service ? service.display_order : totalServices + 1;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service?.name || '',
      slug: service?.slug || '',
      description: service?.description || '',
      price_from: service?.price_from?.toString() || '',
      price_text: service?.price_text || '',
      duration: service?.duration || '',
      category: service?.category || '',
      icon_name: service?.icon_name || '',
      display_order: service?.display_order?.toString() || (totalServices + 1).toString(),
      popular: service?.popular || false,
      is_active: service?.is_active || true,
    },
  });

  const { watch, setValue } = form;
  const nameValue = watch('name');

  // Auto-generate slug from name
  useEffect(() => {
    if (isGeneratingSlug && nameValue && !service) {
      const slug = generateSlug(nameValue);
      setValue('slug', slug);
    }
  }, [nameValue, setValue, isGeneratingSlug, service]);

  const handleSubmit = (data: FormData) => {
    // Convert string numbers to actual numbers and add service_type and features
    const processedData = {
      ...data,
      price_from: parseFloat(data.price_from),
      display_order: parseInt(data.display_order),
      service_type: generateSlug(data.name), // Auto-generate service_type from name
      features: service?.features || [], // Use existing features or empty array
      meta_title: service?.meta_title,
      meta_description: service?.meta_description,
    };
    onSubmit(processedData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên dịch vụ *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tên dịch vụ" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input 
                            {...field} 
                            placeholder="slug-tu-dong-tao" 
                            onChange={(e) => {
                              field.onChange(e);
                              setIsGeneratingSlug(false);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (nameValue) {
                                setValue('slug', generateSlug(nameValue));
                              }
                            }}
                          >
                            Tự động
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá từ *</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="500000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Văn bản giá *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Từ 500,000đ" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời gian *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="3-5 ngày" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem 
                              key={cat} 
                              value={cat}
                            >
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="display_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số thứ tự *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          placeholder={service ? field.value : `Gợi ý: ${totalServices + 1}`}
                        />
                      </FormControl>
                      <FormMessage />
                      {!service && (
                        <p className="text-xs text-muted-foreground">
                          Gợi ý: {totalServices + 1} (dựa trên số dịch vụ hiện có)
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="icon_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {icons.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              {icon}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Nhập mô tả dịch vụ"
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="popular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Phổ biến</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Hiển thị dịch vụ này trong danh sách phổ biến
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Kích hoạt</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Kích hoạt dịch vụ này để hiển thị công khai
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang xử lý...' : service ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
