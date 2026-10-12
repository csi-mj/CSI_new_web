'use client';

import { useRecruitments } from './hooks/useRecruitments';
import { useRecruitmentFilters } from './hooks/useRecruitmentFilters';
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
  const filterControls = useRecruitmentFilters(recruitments);

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
              value={filterControls.searchQuery}
              onChange={(e) => filterControls.setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-[150px]">
            <Select value={filterControls.teamFilter} onValueChange={(val) => filterControls.setTeamFilter(val || 'all')}>
              <SelectTrigger className="bg-card h-10 w-full">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="execom">Execom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-[200px]">
            <Select
              value={filterControls.statusFilter}
              onValueChange={(val) => filterControls.setStatusFilter(val || 'all')}
            >
              <SelectTrigger className="bg-card h-10 w-full">
                <div className="flex items-center gap-2">
                  {filterControls.statusFilter === 'all' ? (
                    <Filter className={cn("size-4", iconColors.rose)} />
                  ) : (
                    (() => {
                      const config = RECRUITMENT_STATUS_CONFIG[filterControls.statusFilter as keyof typeof RECRUITMENT_STATUS_CONFIG];
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
            recruitments={filterControls.filteredRecruitments} 
            rawRecruitments={recruitments}
            onUpdate={updateRecruitment}
            isUpdating={isUpdating}
            onSchedule={scheduleInterview}
            isScheduling={isScheduling}
            onDelete={deleteRecruitment}
            isDeletingId={isDeletingId}
            statFilter={filterControls.statFilter}
            branchFilter={filterControls.branchFilter}
            yearFilter={filterControls.yearFilter}
            domainFilter={filterControls.domainFilter}
            onToggleStatFilter={filterControls.toggleStatFilter}
            onToggleBranchFilter={filterControls.toggleBranchFilter}
            onToggleYearFilter={filterControls.toggleYearFilter}
            onToggleDomainFilter={filterControls.toggleDomainFilter}
            onResetFilters={filterControls.resetFilters}
            hasActiveFilters={filterControls.hasActiveFilters}
            activeFilterCount={filterControls.activeFilterCount}
          />
        </DataBoundary>
      </div>
    </div>
  );
}
