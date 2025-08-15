'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Edit, Eye, Trash2, Database, Globe, Key, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SettingsHeader } from './settings-header';
import { SettingsStats } from './settings-stats';
import { SettingsSearch } from './settings-search';
import { SettingViewDialog } from './setting-view-dialog';
import { SettingEditDialog } from './setting-edit-dialog';
import { SettingDeleteDialog } from './setting-delete-dialog';

interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const mockSettings: Setting[] = [
  { id: '1', key: 'site_name', value: 'MarketCode', type: 'string', description: 'Website name', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
  { id: '2', key: 'site_description', value: 'Premium source code marketplace', type: 'string', description: 'Website description', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-10T00:00:00Z' },
  { id: '3', key: 'maintenance_mode', value: 'false', type: 'boolean', description: 'Enable maintenance mode', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-08T00:00:00Z' },
  { id: '4', key: 'max_upload_size', value: '10485760', type: 'number', description: 'Maximum file upload size in bytes', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-05T00:00:00Z' },
  { id: '5', key: 'two_factor_auth', value: 'true', type: 'boolean', description: 'Enable two-factor authentication', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-12T00:00:00Z' },
  { id: '6', key: 'session_timeout', value: '3600', type: 'number', description: 'Session timeout in seconds', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-14T00:00:00Z' },
];

export function SettingsManagement() {
  const [settings, setSettings] = useState<Setting[]>(mockSettings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredSettings = settings.filter(setting =>
    setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (setting.description && setting.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewSetting = (setting: Setting) => {
    setSelectedSetting(setting);
    setIsViewDialogOpen(true);
  };

  const handleEditSetting = (setting: Setting) => {
    setSelectedSetting(setting);
    setIsEditDialogOpen(true);
  };

  const handleDeleteSetting = (setting: Setting) => {
    setSelectedSetting(setting);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveSetting = (updatedSetting: Setting) => {
    setSettings(settings.map(s => s.id === updatedSetting.id ? updatedSetting : s));
    setSelectedSetting(null);
  };

  const handleConfirmDelete = (settingToDelete: Setting) => {
    setSettings(settings.filter(s => s.id !== settingToDelete.id));
    setSelectedSetting(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'boolean': return Bell;
      case 'number': return Key;
      default: return Globe;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SettingsHeader />

      {/* Stats Cards */}
      <SettingsStats settings={settings} />

      {/* Search */}
      <SettingsSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Settings Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Settings Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSettings.map((setting) => {
                const TypeIcon = getTypeIcon(setting.type);
                return (
                  <TableRow key={setting.id}>
                    <TableCell>
                      <p className="font-mono text-sm font-medium text-foreground">{setting.key}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-mono text-sm text-foreground max-w-xs truncate">{setting.value}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-4 w-4 text-stone-600" />
                        <Badge variant="outline" className="text-xs">{setting.type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">{setting.description || '-'}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{formatDate(setting.updatedAt)}</span>
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
                          <DropdownMenuItem onClick={() => handleViewSetting(setting)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditSetting(setting)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteSetting(setting)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Setting Dialog */}
      <SettingViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        setting={selectedSetting}
      />

      {/* Edit Setting Dialog */}
      <SettingEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        setting={selectedSetting}
        onSave={handleSaveSetting}
      />

      {/* Delete Setting Dialog */}
      <SettingDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        setting={selectedSetting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
