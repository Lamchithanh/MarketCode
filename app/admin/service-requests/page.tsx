'use client';

import { ServiceRequestTable } from '@/components/admin/service-requests/service-request-table';

export default function ServiceRequestsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <ServiceRequestTable />
    </div>
  );
}
