'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  replyContent?: string;
  repliedAt?: string;
  repliedBy?: string;
}

export interface MessageStats {
  total: number;
  unread: number;
  read: number;
  thisWeek: number;
}

export interface MessagesResponse {
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  statistics: MessageStats;
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [statistics, setStatistics] = useState<MessageStats>({
    total: 0,
    unread: 0,
    read: 0,
    thisWeek: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const channelRef = useRef<RealtimeChannel | null>(null);

  const fetchMessages = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'read' | 'unread' | string;
  }) => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.search) searchParams.append('search', params.search);
      if (params?.status) searchParams.append('status', params.status);

      const response = await fetch(`/api/messages?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data: MessagesResponse = await response.json();
      
      setMessages(data.messages);
      setStatistics(data.statistics);
      setPagination(data.pagination);

      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Không thể tải tin nhắn');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }

      const { message: updatedMessage } = await response.json();
      return updatedMessage;
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Không thể đánh dấu tin nhắn là đã đọc');
      throw error;
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      toast.success('Đã xóa tin nhắn thành công');
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Không thể xóa tin nhắn');
      throw error;
    }
  };

  const sendReply = async (messageId: string, email: string, subject: string, message: string) => {
    setSendingReply(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('/api/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          recipientEmail: email,
          subject,
          replyMessage: message
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Không thể gửi email phản hồi');
      }

      toast.success('Email phản hồi đã được gửi thành công!');
      return data;
    } catch (error) {
      console.error('Error sending reply email:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        toast.error('Timeout: Email phản hồi mất quá lâu để gửi');
      } else {
        toast.error(error instanceof Error ? error.message : 'Không thể gửi email phản hồi');
      }
      throw error;
    } finally {
      setSendingReply(false);
    }
  };

  // Setup realtime subscription
  useEffect(() => {
    console.log('🔄 Setting up ContactMessage realtime subscription...');
    
    // Cleanup previous subscription
    if (channelRef.current) {
      channelRef.current.unsubscribe();
    }

    const channel = supabase
      .channel('contactmessage_realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ContactMessage'
      }, (payload) => {
        console.log('📧 ContactMessage change detected:', payload);
        
        if (payload.eventType === 'INSERT') {
          const newMessage = payload.new as Message;
          
          setMessages(prev => {
            // Check if message already exists
            if (prev.some(m => m.id === newMessage.id)) {
              return prev;
            }
            return [newMessage, ...prev];
          });

          // Update statistics
          setStatistics(prev => ({
            ...prev,
            total: prev.total + 1,
            unread: prev.unread + 1
          }));

          toast.success('Có tin nhắn mới từ khách hàng!', {
            description: `${newMessage.name}: ${newMessage.subject}`
          });
        }
        
        if (payload.eventType === 'UPDATE') {
          const updatedMessage = payload.new as Message;
          const oldMessage = payload.old as Message;
          
          setMessages(prev => prev.map(message => 
            message.id === updatedMessage.id ? updatedMessage : message
          ));

          // Update statistics if read status changed
          if (oldMessage.isRead !== updatedMessage.isRead) {
            setStatistics(prev => ({
              ...prev,
              unread: updatedMessage.isRead ? prev.unread - 1 : prev.unread + 1,
              read: updatedMessage.isRead ? prev.read + 1 : prev.read - 1
            }));
          }
        }
        
        if (payload.eventType === 'DELETE') {
          const deletedMessage = payload.old as Message;
          
          setMessages(prev => prev.filter(message => message.id !== deletedMessage.id));
          
          // Update statistics
          setStatistics(prev => ({
            ...prev,
            total: prev.total - 1,
            [deletedMessage.isRead ? 'read' : 'unread']: prev[deletedMessage.isRead ? 'read' : 'unread'] - 1
          }));
        }
      })
      .subscribe((status) => {
        console.log('📡 ContactMessage subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ ContactMessage realtime subscription ACTIVE');
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('🔴 Cleaning up ContactMessage realtime subscription');
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, []);

  // Initial load
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    sendingReply,
    statistics,
    pagination,
    fetchMessages,
    markAsRead,
    deleteMessage,
    sendReply,
    refresh: () => fetchMessages(),
  };
}
