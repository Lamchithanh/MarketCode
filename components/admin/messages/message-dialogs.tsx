'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Message } from '@/hooks/use-messages';

interface MessageDialogsProps {
  selectedMessage: Message | null;
  isViewDialogOpen: boolean;
  isReplyDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  replyText: string;
  sendingReply: boolean;
  setReplyText: (text: string) => void;
  setIsViewDialogOpen: (open: boolean) => void;
  setIsReplyDialogOpen: (open: boolean) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  onSendReply: () => void;
  onConfirmDelete: () => void;
}

export function MessageDialogs({
  selectedMessage,
  isViewDialogOpen,
  isReplyDialogOpen,
  isDeleteDialogOpen,
  replyText,
  sendingReply,
  setReplyText,
  setIsViewDialogOpen,
  setIsReplyDialogOpen,
  setIsDeleteDialogOpen,
  onSendReply,
  onConfirmDelete,
}: MessageDialogsProps) {
  const [replySubject, setReplySubject] = useState('');

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
    <>
      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết tin nhắn</DialogTitle>
            <DialogDescription>Thông tin chi tiết về tin nhắn</DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tên người gửi</label>
                  <p className="text-foreground font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">{selectedMessage.email}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Chủ đề</label>
                  <p className="text-foreground font-medium">{selectedMessage.subject}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Tin nhắn</label>
                  <div className="bg-muted p-3 rounded mt-1">
                    <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                  <div className="mt-1">
                    <Badge 
                      variant={selectedMessage.isRead ? 'default' : 'secondary'} 
                      className={selectedMessage.isRead ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-600'}
                    >
                      {selectedMessage.isRead ? 'Đã đọc' : 'Chưa đọc'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ngày</label>
                  <p className="text-foreground">{formatDate(selectedMessage.createdAt)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Đóng
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false);
                if (selectedMessage) {
                  setReplySubject(`Re: ${selectedMessage.subject}`);
                  setIsReplyDialogOpen(true);
                }
              }}
            >
              Phản hồi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Message Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phản hồi tin nhắn</DialogTitle>
            <DialogDescription>Gửi phản hồi đến khách hàng</DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="to">Đến</Label>
                <Input id="to" value={selectedMessage.email} className="mt-1" disabled />
              </div>
              <div>
                <Label htmlFor="subject">Chủ đề</Label>
                <Input
                  id="subject"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="reply">Nội dung phản hồi</Label>
                <Textarea
                  id="reply"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Nhập nội dung phản hồi của bạn tại đây..."
                  className="mt-1"
                  rows={5}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsReplyDialogOpen(false)}
              disabled={sendingReply}
            >
              Hủy
            </Button>
            <Button 
              onClick={onSendReply} 
              disabled={!replyText.trim() || sendingReply}
              className="min-w-[120px]"
            >
              {sendingReply ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang gửi...
                </>
              ) : (
                'Gửi phản hồi'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Message Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tin nhắn này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                <strong>Từ:</strong> {selectedMessage.name} ({selectedMessage.email})
                <br />
                <strong>Chủ đề:</strong> {selectedMessage.subject}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={onConfirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
