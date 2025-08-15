'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function DownloadsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Download Management</h2>
        <p className="text-muted-foreground">
          Manage and track product downloads
        </p>
      </div>
      <Button size="sm" className="bg-gradient-to-r from-stone-600 to-stone-700 hover:from-stone-700 hover:to-stone-800 text-white">
        <Download className="h-4 w-4 mr-2" />
        Add Download
      </Button>
    </div>
  );
}
