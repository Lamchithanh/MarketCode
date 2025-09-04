'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_text: string;
  price_from: number;
  duration: string;
  category: string;
  service_type: string;
  features: string[];
  icon_name: string;
  popular: boolean;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceStats {
  total: number;
  active: number;
  inactive: number;
  popular: number;
  categories: number;
}

interface UseServicesReturn {
  services: Service[];
  stats: ServiceStats;
  loading: boolean;
  updating: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createService: (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<Service>;
  updateService: (serviceId: string, updates: Partial<Service>) => Promise<Service>;
  deleteService: (serviceId: string) => Promise<boolean>;
}

export function useServices(): UseServicesReturn {
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<ServiceStats>({
    total: 0,
    active: 0,
    inactive: 0,
    popular: 0,
    categories: 0
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const data = await response.json();
      
      if (data.services) {
        setServices(data.services);
        setStats(data.statistics || {
          total: 0,
          active: 0,
          inactive: 0,
          popular: 0,
          categories: 0
        });
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Không thể tải danh sách dịch vụ');
      toast.error('Không thể tải danh sách dịch vụ');
    } finally {
      setLoading(false);
    }
  }, []);

  const createService = async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    setUpdating(true);
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        throw new Error('Failed to create service');
      }

      const { service } = await response.json();
      
      // Refresh services data to show new service immediately
      await fetchServices();
      
      toast.success('Đã tạo dịch vụ mới thành công');
      return service;
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Không thể tạo dịch vụ mới');
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const updateService = async (serviceId: string, updates: Partial<Service>) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update service');
      }

      const { service } = await response.json();
      
      // Refresh services data to show changes immediately
      await fetchServices();
      
      toast.success('Đã cập nhật dịch vụ thành công');
      return service;
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Không thể cập nhật dịch vụ');
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const deleteService = async (serviceId: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete service');
      }

      // Refresh services data to remove deleted service immediately
      await fetchServices();

      toast.success('Đã xóa dịch vụ thành công');
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Không thể xóa dịch vụ');
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  // Setup realtime subscription
  useEffect(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
    }

    channelRef.current = supabase
      .channel('services-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Service'
        },
        async (payload) => {
          console.log('Service change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast.success('Đã thêm dịch vụ mới!');
          } else if (payload.eventType === 'UPDATE') {
            toast.success('Dịch vụ đã được cập nhật!');
          } else if (payload.eventType === 'DELETE') {
            toast.success('Dịch vụ đã được xóa!');
          }
          
          // Refetch services to update the list
          await fetchServices();
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [fetchServices]);

  // Initial fetch
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    stats,
    loading,
    updating,
    error,
    refetch: fetchServices,
    createService,
    updateService,
    deleteService,
  };
}
