'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Database, Mail, Users, UserCheck, UserX, MoreHorizontal, Eye, Edit, Trash2, Plus, Mail as MailIcon } from 'lucide-react';
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

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
}

const mockSubscribers: Subscriber[] = [
  { id: '1', email: 'john@example.com', isActive: true, subscribedAt: '2024-01-15T10:30:00Z' },
  { id: '2', email: 'jane@example.com', isActive: false, subscribedAt: '2024-01-14T16:20:00Z', unsubscribedAt: '2024-01-20T12:00:00Z' },
  { id: '3', email: 'bob@example.com', isActive: true, subscribedAt: '2024-01-13T14:15:00Z' },
];

export function NewsletterTable() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(mockSubscribers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSendNewsletterDialogOpen, setIsSendNewsletterDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterContent, setNewsletterContent] = useState('');

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewSubscriber = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsViewDialogOpen(true);
  };

  const handleEditSubscriber = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsEditDialogOpen(true);
  };

  const handleDeleteSubscriber = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleStatus = (subscriber: Subscriber) => {
    if (subscriber.isActive) {
      // Unsubscribe
      setSubscribers(subscribers.map(s => s.id === subscriber.id ? { ...s, isActive: false, unsubscribedAt: new Date().toISOString() } : s));
    } else {
      // Resubscribe
      setSubscribers(subscribers.map(s => s.id === subscriber.id ? { ...s, isActive: true, unsubscribedAt: undefined } : s));
    }
  };

  const handleAddSubscriber = () => {
    if (newEmail.trim()) {
      const newSubscriber: Subscriber = {
        id: Date.now().toString(),
        email: newEmail.trim(),
        isActive: true,
        subscribedAt: new Date().toISOString(),
      };
      setSubscribers([...subscribers, newSubscriber]);
      setNewEmail('');
      setIsAddDialogOpen(false);
    }
  };

  const handleSaveSubscriber = (updatedSubscriber: Subscriber) => {
    setSubscribers(subscribers.map(s => s.id === updatedSubscriber.id ? updatedSubscriber : s));
    setSelectedSubscriber(null);
  };

  const handleConfirmDelete = (subscriberToDelete: Subscriber) => {
    setSubscribers(subscribers.filter(s => s.id !== subscriberToDelete.id));
    setSelectedSubscriber(null);
  };

  const handleSendNewsletter = () => {
    // In a real app, you would send the newsletter via API
    console.log('Sending newsletter to active subscribers:', subscribers.filter(s => s.isActive).length);
    console.log('Subject:', newsletterSubject);
    console.log('Content:', newsletterContent);
    setIsSendNewsletterDialogOpen(false);
    setNewsletterSubject('');
    setNewsletterContent('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const stats = [
    { title: 'Total Subscribers', value: subscribers.length, icon: Users, bgColor: 'bg-stone-100', iconColor: 'text-stone-600' },
    { title: 'Active Subscribers', value: subscribers.filter(s => s.isActive).length, icon: UserCheck, bgColor: 'bg-stone-100', iconColor: 'text-stone-600' },
    { title: 'Unsubscribed', value: subscribers.filter(s => !s.isActive).length, icon: UserX, bgColor: 'bg-stone-100', iconColor: 'text-stone-600' },
    { title: 'This Month', value: 15, icon: Mail, bgColor: 'bg-stone-100', iconColor: 'text-stone-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Newsletter Management</h2>
          <p className="text-muted-foreground">Manage newsletter subscribers</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setIsSendNewsletterDialogOpen(true)}
            className="bg-stone-100 text-stone-700 hover:bg-stone-200"
          >
            <MailIcon className="h-4 w-4 mr-2" />
            Send Newsletter
          </Button>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subscriber
          </Button>
        </div>
      </div>

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

      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search subscribers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Subscribers Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead>Unsubscribed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">{subscriber.email}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={subscriber.isActive ? 'default' : 'destructive'} className={subscriber.isActive ? 'bg-green-100 text-green-800' : ''}>
                      {subscriber.isActive ? 'Active' : 'Unsubscribed'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{formatDate(subscriber.subscribedAt)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {subscriber.unsubscribedAt ? formatDate(subscriber.unsubscribedAt) : '-'}
                    </span>
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
                        <DropdownMenuItem onClick={() => handleViewSubscriber(subscriber)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditSubscriber(subscriber)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(subscriber)}>
                          {subscriber.isActive ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Unsubscribe
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Resubscribe
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteSubscriber(subscriber)}
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

      {/* View Subscriber Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscriber Details</DialogTitle>
            <DialogDescription>
              Detailed information about the subscriber
            </DialogDescription>
          </DialogHeader>
          {selectedSubscriber && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground font-medium">{selectedSubscriber.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge variant={selectedSubscriber.isActive ? 'default' : 'destructive'} className={selectedSubscriber.isActive ? 'bg-green-100 text-green-800' : ''}>
                  {selectedSubscriber.isActive ? 'Active' : 'Unsubscribed'}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subscribed Date</label>
                <p className="text-foreground">{formatDate(selectedSubscriber.subscribedAt)}</p>
              </div>
              {selectedSubscriber.unsubscribedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Unsubscribed Date</label>
                  <p className="text-foreground">{formatDate(selectedSubscriber.unsubscribedAt)}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subscriber Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscriber</DialogTitle>
            <DialogDescription>
              Update subscriber information
            </DialogDescription>
          </DialogHeader>
          {selectedSubscriber && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  defaultValue={selectedSubscriber.email}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status"
                  defaultValue={selectedSubscriber.isActive ? 'active' : 'inactive'}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (selectedSubscriber) {
                handleSaveSubscriber(selectedSubscriber);
              }
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subscriber Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subscriber</DialogTitle>
            <DialogDescription>
              Add a new email to the newsletter list
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newEmail">Email Address</Label>
              <Input 
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email address"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubscriber}>
              Add Subscriber
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Newsletter Dialog */}
      <Dialog open={isSendNewsletterDialogOpen} onOpenChange={setIsSendNewsletterDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Newsletter</DialogTitle>
            <DialogDescription>
              Send a newsletter to all active subscribers
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject"
                value={newsletterSubject}
                onChange={(e) => setNewsletterSubject(e.target.value)}
                placeholder="Newsletter subject"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <textarea 
                id="content"
                value={newsletterContent}
                onChange={(e) => setNewsletterContent(e.target.value)}
                placeholder="Newsletter content (HTML supported)"
                className="w-full mt-1 p-2 border rounded-md"
                rows={8}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              This will be sent to {subscribers.filter(s => s.isActive).length} active subscribers.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendNewsletterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNewsletter}>
              Send Newsletter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subscriber Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subscriber? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedSubscriber && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                <strong>Email:</strong> {selectedSubscriber.email}<br />
                <strong>Status:</strong> {selectedSubscriber.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              if (selectedSubscriber) {
                handleConfirmDelete(selectedSubscriber);
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
