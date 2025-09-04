'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, Reply, CheckCircle, Trash2, MoreHorizontal } from 'lucide-react';
import { Message } from '@/hooks/use-messages';

interface MessageActionsProps {
  message: Message;
  onView: (message: Message) => void;
  onReply: (message: Message) => void;
  onMarkAsRead: (message: Message) => void;
  onDelete: (message: Message) => void;
}

export function MessageActions({
  message,
  onView,
  onReply,
  onMarkAsRead,
  onDelete,
}: MessageActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Mở menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onView(message)}>
          <Eye className="mr-2 h-4 w-4" />
          Xem chi tiết
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onReply(message)}>
          <Reply className="mr-2 h-4 w-4" />
          Phản hồi
        </DropdownMenuItem>
        {!message.isRead && (
          <DropdownMenuItem onClick={() => onMarkAsRead(message)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Đánh dấu đã đọc
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(message)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
