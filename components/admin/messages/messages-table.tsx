'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, RefreshCw, Database } from 'lucide-react';
import { useMessages, Message } from '@/hooks/use-messages';
import { MessageStatsCards } from './message-stats-cards';
import { MessageActions } from './message-actions';
import { MessageDialogs } from './message-dialogs';

export function MessagesTable() {
  const {
    messages,
    loading,
    sendingReply,
    statistics,
    markAsRead,
    deleteMessage,
    sendReply,
    refresh
  } = useMessages();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const filteredMessages = searchTerm 
    ? messages.filter(message => 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : messages;

  const handleRefresh = async () => {
    await refresh();
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
    
    // Mark as read when viewing
    if (!message.isRead) {
      await markAsRead(message.id);
    }
  };

  const handleReplyMessage = (message: Message) => {
    setSelectedMessage(message);
    setReplyText('');
    setIsReplyDialogOpen(true);
  };

  const handleDeleteMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsDeleteDialogOpen(true);
  };

  const handleMarkAsRead = async (message: Message) => {
    if (!message.isRead) {
      await markAsRead(message.id);
    }
  };

  const handleSendReply = async () => {
    if (selectedMessage && replyText.trim()) {
      try {
        await sendReply(
          selectedMessage.id,
          selectedMessage.email,
          `Re: ${selectedMessage.subject}`,
          replyText
        );
        setIsReplyDialogOpen(false);
        setReplyText('');
      } catch (error) {
        // Error already handled in sendReply hook
        console.error('Send reply failed:', error);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedMessage) {
      await deleteMessage(selectedMessage.id);
      setIsDeleteDialogOpen(false);
      setSelectedMessage(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản lý tin nhắn</h2>
          <p className="text-muted-foreground">Quản lý tin nhắn và câu hỏi từ khách hàng</p>
        </div>
        <div className="flex items-center space-x-2">
          <div title="Làm mới dữ liệu">
            <RefreshCw 
              className={`h-4 w-4 ${loading ? 'animate-spin' : ''} text-muted-foreground cursor-pointer hover:text-foreground`} 
              onClick={handleRefresh} 
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <MessageStatsCards stats={statistics} />

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Tìm kiếm tin nhắn..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-10" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Cơ sở dữ liệu tin nhắn ({statistics.total} tổng cộng)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người gửi</TableHead>
                  <TableHead>Chủ đề</TableHead>
                  <TableHead>Tin nhắn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{message.name}</p>
                          <p className="text-sm text-muted-foreground">{message.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground">{message.subject}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground max-w-xs truncate">
                            {message.message}
                          </p>
                          {message.replyContent && (
                            <div className="border-l-2 border-blue-200 pl-2">
                              <p className="text-xs text-blue-600 font-medium">
                                Phản hồi: {message.replyContent.length > 50 
                                  ? `${message.replyContent.substring(0, 50)}...` 
                                  : message.replyContent}
                              </p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={message.isRead ? 'default' : 'secondary'} 
                          className={message.isRead ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-600'}
                        >
                          {message.isRead ? 'Đã đọc' : 'Chưa đọc'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(message.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <MessageActions
                          message={message}
                          onView={handleViewMessage}
                          onReply={handleReplyMessage}
                          onMarkAsRead={handleMarkAsRead}
                          onDelete={handleDeleteMessage}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'Không tìm thấy tin nhắn nào phù hợp với tìm kiếm của bạn.' : 'Không tìm thấy tin nhắn nào.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <MessageDialogs
        selectedMessage={selectedMessage}
        isViewDialogOpen={isViewDialogOpen}
        isReplyDialogOpen={isReplyDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        replyText={replyText}
        sendingReply={sendingReply}
        setReplyText={setReplyText}
        setIsViewDialogOpen={setIsViewDialogOpen}
        setIsReplyDialogOpen={setIsReplyDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        onSendReply={handleSendReply}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
