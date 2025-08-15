'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, RefreshCw, Database, Mail, MessageSquare, Eye, CheckCircle, MoreHorizontal, Edit, Trash2, Reply } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com', 
    subject: 'Question about React Template',
    message: 'Hi, I have a question about your React admin template. I would like to know if it supports TypeScript and what features are included. Also, is there documentation available?',
    isRead: false,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    subject: 'Support Request',
    message: 'I need help with the installation process. I followed the README but I\'m getting an error when running npm install. Can you provide step-by-step guidance?',
    isRead: true,
    createdAt: '2024-01-14T16:20:00Z',
  },
];

export function MessagesTable() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
    // Mark as read when viewing
    if (!message.isRead) {
      setMessages(messages.map(m => m.id === message.id ? { ...m, isRead: true } : m));
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

  const handleMarkAsRead = (message: Message) => {
    setMessages(messages.map(m => m.id === message.id ? { ...m, isRead: true } : m));
  };

  const handleSendReply = () => {
    // In a real app, you would send the reply via API
    console.log('Sending reply to:', selectedMessage?.email, 'Message:', replyText);
    setIsReplyDialogOpen(false);
    setReplyText('');
  };

  const handleConfirmDelete = (messageToDelete: Message) => {
    setMessages(messages.filter(m => m.id !== messageToDelete.id));
    setSelectedMessage(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = [
    { title: 'Total Messages', value: messages.length, icon: MessageSquare, bgColor: 'bg-stone-100', iconColor: 'text-stone-600' },
    { title: 'Unread Messages', value: messages.filter(m => !m.isRead).length, icon: Mail, bgColor: 'bg-stone-100', iconColor: 'text-stone-600' },
    { title: 'Read Messages', value: messages.filter(m => m.isRead).length, icon: CheckCircle, bgColor: 'bg-stone-100', iconColor: 'text-stone-600' },
    { title: 'This Week', value: 5, icon: Eye, bgColor: 'bg-stone-100', iconColor: 'text-stone-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Message Management</h2>
          <p className="text-muted-foreground">Manage customer messages and inquiries</p>
        </div>
        <div className="flex items-center space-x-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''} text-muted-foreground cursor-pointer hover:text-foreground`} onClick={handleRefresh} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-stone-600">Updated recently</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search messages..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Messages Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((message) => (
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
                    <p className="text-sm text-muted-foreground max-w-xs truncate">{message.message}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={message.isRead ? 'default' : 'secondary'} className={message.isRead ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'}>
                      {message.isRead ? 'Read' : 'Unread'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{formatDate(message.createdAt)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewMessage(message)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReplyMessage(message)}>
                          <Reply className="mr-2 h-4 w-4" />
                          Reply
                        </DropdownMenuItem>
                        {!message.isRead && (
                          <DropdownMenuItem onClick={() => handleMarkAsRead(message)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Read
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteMessage(message)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Detailed information about the message
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sender Name</label>
                  <p className="text-foreground font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">{selectedMessage.email}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Subject</label>
                  <p className="text-foreground font-medium">{selectedMessage.subject}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Message</label>
                  <div className="bg-muted p-3 rounded mt-1">
                    <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge variant={selectedMessage.isRead ? 'default' : 'secondary'} className={selectedMessage.isRead ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'}>
                    {selectedMessage.isRead ? 'Read' : 'Unread'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p className="text-foreground">{formatDate(selectedMessage.createdAt)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              if (selectedMessage) {
                handleReplyMessage(selectedMessage);
              }
            }}>
              Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Message Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
            <DialogDescription>
              Send a reply to the customer
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="to">To</Label>
                <Input 
                  id="to"
                  value={selectedMessage.email}
                  className="mt-1"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject"
                  defaultValue={`Re: ${selectedMessage.subject}`}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="reply">Reply Message</Label>
                <Textarea 
                  id="reply"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="mt-1"
                  rows={5}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReply}>
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Message Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                <strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})<br />
                <strong>Subject:</strong> {selectedMessage.subject}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              if (selectedMessage) {
                handleConfirmDelete(selectedMessage);
              }
            }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
