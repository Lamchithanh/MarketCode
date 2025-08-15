'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface SettingEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setting: Setting | null;
  onSave: (updatedSetting: Setting) => void;
}

export function SettingEditDialog({ open, onOpenChange, setting, onSave }: SettingEditDialogProps) {
  if (!setting) return null;

  const handleSave = () => {
    // In a real app, you would collect form data here
    onSave(setting);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Setting</DialogTitle>
          <DialogDescription>
            Update setting information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="key">Key</Label>
            <Input 
              id="key"
              defaultValue={setting.key}
              className="mt-1"
              disabled
            />
          </div>
          <div>
            <Label htmlFor="value">Value</Label>
            <Input 
              id="value"
              defaultValue={setting.value}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select defaultValue={setting.type}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="number">Number</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description"
              defaultValue={setting.description || ''}
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
