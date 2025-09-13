'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface ServiceRequest {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_type: 'custom-development' | 'project-customization' | 'maintenance' | 'ui-redesign' | 'performance-optimization' | 'consultation';
  service_name: string;
  title: string;
  description: string;
  budget_range?: string;
  timeline?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requirements?: Record<string, unknown>;
  technical_specs?: Record<string, unknown>;
  status: 'pending' | 'reviewing' | 'quoted' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to?: string;
  quoted_price?: number;
  quoted_duration?: string;
  quote_notes?: string;
  quoted_at?: string;
  quoted_by?: string;
  admin_notes?: string;
  client_feedback?: string;
  last_contact_at?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface ServiceRequestStats {
  total: number;
  pending: number;
  reviewing: number;
  quoted: number;
  approved: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  this_week: number;
  total_revenue: number;
}

export interface ServiceRequestsResponse {
  requests: ServiceRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  statistics: ServiceRequestStats;
}

export function useServiceRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [statistics, setStatistics] = useState<ServiceRequestStats>({
    total: 0,
    pending: 0,
    reviewing: 0,
    quoted: 0,
    approved: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    this_week: 0,
    total_revenue: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const channelRef = useRef<RealtimeChannel | null>(null);

  const fetchRequests = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    service_type?: string;
    priority?: string;
  }) => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.search) searchParams.append('search', params.search);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.service_type) searchParams.append('service_type', params.service_type);
      if (params?.priority) searchParams.append('priority', params.priority);

      const response = await fetch(`/api/service-requests?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch service requests');
      }

      const data: ServiceRequestsResponse = await response.json();
      
      setRequests(data.requests);
      setStatistics(data.statistics);
      setPagination(data.pagination);

      return data;
    } catch (error) {
      console.error('Error fetching service requests:', error);
      toast.error('Không thể tải yêu cầu dịch vụ');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRequestStatus = async (
    requestId: string, 
    status: ServiceRequest['status'], 
    adminNotes?: string
  ) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/service-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, admin_notes: adminNotes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update service request status');
      }

      const { request: updatedRequest } = await response.json();
      
      toast.success('Đã cập nhật trạng thái yêu cầu');
      return updatedRequest;
    } catch (error) {
      console.error('Error updating service request status:', error);
      toast.error('Không thể cập nhật trạng thái');
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const assignRequest = async (requestId: string, assignedTo?: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/service-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assigned_to: assignedTo }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign service request');
      }

      const { request: updatedRequest } = await response.json();
      
      toast.success('Đã phân công yêu cầu');
      return updatedRequest;
    } catch (error) {
      console.error('Error assigning service request:', error);
      toast.error('Không thể phân công yêu cầu');
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const addQuote = async (
    requestId: string,
    quotedPrice: number,
    quotedDuration: string,
    quoteNotes?: string
  ) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/service-requests/${requestId}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoted_price: quotedPrice,
          quoted_duration: quotedDuration,
          quote_notes: quoteNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send quote');
      }

      const result = await response.json();
      
      toast.success('Đã gửi báo giá thành công!');
      
      // Refresh the data to get updated status
      await fetchRequests();
      
      return result;
    } catch (error) {
      console.error('Error sending quote:', error);
      toast.error('Không thể gửi báo giá');
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const deleteRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/service-requests/${requestId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete service request');
      }

      toast.success('Đã xóa yêu cầu dịch vụ');
      return true;
    } catch (error) {
      console.error('Error deleting service request:', error);
      toast.error('Không thể xóa yêu cầu');
      throw error;
    }
  };

  // Setup realtime subscription
  useEffect(() => {
    console.log('🔄 Setting up ServiceRequest realtime subscription...');
    
    // Cleanup previous subscription
    if (channelRef.current) {
      channelRef.current.unsubscribe();
    }

    const channel = supabase
      .channel('servicerequest_realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ServiceRequest'
      }, (payload) => {
        console.log('🛠️ ServiceRequest change detected:', payload);
        
        if (payload.eventType === 'INSERT') {
          const newRequest = payload.new as ServiceRequest;
          
          setRequests(prev => {
            // Check if request already exists
            if (prev.some(r => r.id === newRequest.id)) {
              return prev;
            }
            return [newRequest, ...prev];
          });

          // Update statistics
          setStatistics(prev => ({
            ...prev,
            total: prev.total + 1,
            pending: prev.pending + 1
          }));

          toast.success('Có yêu cầu dịch vụ mới!', {
            description: `${newRequest.name}: ${newRequest.title}`
          });
        }
        
        if (payload.eventType === 'UPDATE') {
          const updatedRequest = payload.new as ServiceRequest;
          const oldRequest = payload.old as ServiceRequest;
          
          setRequests(prev => prev.map(request => 
            request.id === updatedRequest.id ? updatedRequest : request
          ));

          // Update statistics if status changed
          if (oldRequest.status !== updatedRequest.status) {
            setStatistics(prev => {
              const newStats = { ...prev };
              // Decrease old status count
              if (oldRequest.status in newStats) {
                (newStats as Record<string, number>)[oldRequest.status] = Math.max(0, (newStats as Record<string, number>)[oldRequest.status] - 1);
              }
              // Increase new status count
              if (updatedRequest.status in newStats) {
                (newStats as Record<string, number>)[updatedRequest.status] = (newStats as Record<string, number>)[updatedRequest.status] + 1;
              }
              return newStats;
            });
          }
        }
        
        if (payload.eventType === 'DELETE') {
          const deletedRequest = payload.old as ServiceRequest;
          
          setRequests(prev => prev.filter(request => request.id !== deletedRequest.id));
          
          // Update statistics
          setStatistics(prev => {
            const newStats = { ...prev };
            newStats.total = prev.total - 1;
            if (deletedRequest.status in newStats) {
              (newStats as Record<string, number>)[deletedRequest.status] = Math.max(0, (newStats as Record<string, number>)[deletedRequest.status] - 1);
            }
            return newStats;
          });
        }
      })
      .subscribe((status) => {
        console.log('📡 ServiceRequest subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ ServiceRequest realtime subscription ACTIVE');
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('🔴 Cleaning up ServiceRequest realtime subscription');
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, []);

  // Initial load
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading,
    updating,
    statistics,
    pagination,
    fetchRequests,
    updateRequestStatus,
    assignRequest,
    addQuote,
    deleteRequest,
    refresh: () => fetchRequests(),
  };
}
