'use client';

import { useState } from 'react';
import { useMemberships } from './hooks/useMemberships';
import { MembershipsTable, MEMBERSHIP_STATUS_CONFIG } from './_components/MembershipsTable';
import { DataBoundary } from '@/components/ui/data-boundary';
import { Search, Users, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { iconColors } from '@/config/colors';
import { cn } from '@/lib/utils';

export default function MembershipsPage() {
  const { memberships, isLoading, isError, error, refetch, updateStatus, isUpdatingStatus } = useMemberships();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Client-side filtering
  const filteredMemberships = memberships.filter((m) => {
    // 1. Filter by status
    if (statusFilter !== 'all' && m.status !== statusFilter)
      return false;

    // 2. Filter by search query
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.contact && m.contact.toLowerCase().includes(q)) ||
      (m.roll_no && m.roll_no.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col gap-4 border-b pb-6">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CSI Memberships</h1>
            <p className="text-muted-foreground text-lg">Manage all CSI membership applications and statuses.</p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
         <div className="relative w-full sm:flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search by name, email, phone or roll no..."
              className="bg-card pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-[200px]">
            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val || 'all')}
            >
                <SelectTrigger className="bg-card h-10! w-full">
                <div className="flex items-center gap-2">
                  {statusFilter === 'all' ? (
                    <Filter className={cn("size-4", iconColors.rose)} />
                  ) : (
                    (() => {
                      const config = MEMBERSHIP_STATUS_CONFIG[statusFilter as keyof typeof MEMBERSHIP_STATUS_CONFIG];
                      if (!config) return null;
                      const Icon = config.icon;
                      return <Icon className={`h-4 w-4 ${config.color}`} />;
                    })()
                  )}
                  <SelectValue placeholder="Filter Status" />
                </div>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(MEMBERSHIP_STATUS_CONFIG).map(([status, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${config.color}`} />
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <DataBoundary
          isLoading={isLoading}
          isError={!!error}
          error={error as Error}
          onRetry={refetch}
          isEmpty={memberships.length === 0}
          emptyIcon={Users}
          emptyTitle="No memberships yet"
          emptyDescription="When people apply for membership, they will appear here."
        >
          <MembershipsTable 
            memberships={filteredMemberships} 
            onStatusChange={updateStatus}
            isUpdatingStatus={isUpdatingStatus}
          />
        </DataBoundary>
      </div>
    </div>
  );
}
