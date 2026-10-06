'use client';

import { useState } from 'react';
import { useRecruitments } from './hooks/useRecruitments';
import { RecruitmentsTable, RECRUITMENT_STATUS_CONFIG } from './_components/RecruitmentsTable';
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

export default function RecruitmentsPage() {
  const { recruitments, isLoading, isError, error, refetch, updateRecruitment, isUpdating, scheduleInterview, isScheduling, deleteRecruitment, isDeletingId } = useRecruitments();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');

  // Client-side filtering
  const filteredRecruitments = recruitments.filter((r) => {
    // 1. Filter by status
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;

    // 2. Filter by team (Execom/Core)
    if (teamFilter !== 'all' && r.team !== teamFilter) return false;

    // 3. Filter by search query
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.phone && r.phone.toLowerCase().includes(q)) ||
      (r.roll_no && r.roll_no.toLowerCase().includes(q)) ||
      (r.portfolio_1 && r.portfolio_1.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col gap-4 border-b pb-6">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recruitments</h1>
            <p className="text-muted-foreground text-lg">Manage Core and Execom applications, shortlists, and interviews.</p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
          <div className="relative w-full sm:flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search by name, email, roll no, or domain..."
              className="bg-card pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-[150px]">
            <Select value={teamFilter} onValueChange={(val) => setTeamFilter(val || 'all')}>
              <SelectTrigger className="bg-card h-10 w-full">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="Core">Core</SelectItem>
                <SelectItem value="Execom">Execom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-[200px]">
            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val || 'all')}
            >
              <SelectTrigger className="bg-card h-10 w-full">
                <div className="flex items-center gap-2">
                  {statusFilter === 'all' ? (
                    <Filter className={cn("size-4", iconColors.rose)} />
                  ) : (
                    (() => {
                      const config = RECRUITMENT_STATUS_CONFIG[statusFilter as keyof typeof RECRUITMENT_STATUS_CONFIG];
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
                {Object.entries(RECRUITMENT_STATUS_CONFIG).map(([status, config]) => {
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
          isEmpty={recruitments.length === 0}
          emptyIcon={Users}
          emptyTitle="No applications yet"
          emptyDescription="When students apply for Core or Execom, they will appear here."
        >
          <RecruitmentsTable 
            recruitments={filteredRecruitments} 
            onUpdate={updateRecruitment}
            isUpdating={isUpdating}
            onSchedule={scheduleInterview}
            isScheduling={isScheduling}
            onDelete={deleteRecruitment}
            isDeletingId={isDeletingId}
          />
        </DataBoundary>
      </div>
    </div>
  );
}
