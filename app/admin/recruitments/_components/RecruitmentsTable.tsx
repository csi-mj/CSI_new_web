'use client';

import { useMemo, useState } from 'react';
import type { Recruitment } from '@/lib/types/recruitments';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, XCircle, Users, Briefcase, FileText, Calendar, Mail, GraduationCap, Building2, CalendarDays, ChevronDown, Trash2, Loader2, Check, RotateCcw } from 'lucide-react';
import { iconColors, translucentBgColors, borderColors } from '@/config/colors';
import { ScheduleModal } from './ScheduleModal';
import { RecruitmentDetailsModal } from './RecruitmentDetailsModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const RECRUITMENT_STATUS_CONFIG = {
  pending:     { icon: Clock,        color: iconColors.yellow, label: 'Pending' },
  shortlisted: { icon: CheckCircle2, color: iconColors.blue,   label: 'Shortlisted' },
  interviewed: { icon: Users,        color: iconColors.purple, label: 'Interviewed' },
  selected:    { icon: CheckCircle2, color: iconColors.green,  label: 'Selected' },
  rejected:    { icon: XCircle,      color: iconColors.rose,   label: 'Rejected' },
} as const;

interface RecruitmentsTableProps {
  recruitments: Recruitment[];
  rawRecruitments?: Recruitment[];
  onUpdate: (updates: Partial<Recruitment> & { id: string }) => void;
  isUpdating: boolean;
  onSchedule: (id: string, time: string, venue: string) => Promise<any>;
  isScheduling: boolean;
  onDelete?: (id: string) => void;
  isDeletingId?: string | null;
  // Interactive Filter Props
  statFilter?: 'core' | 'execom' | 'shortlisted' | 'selected' | null;
  branchFilter?: string | null;
  yearFilter?: string | null;
  domainFilter?: string | null;
  onToggleStatFilter?: (key: 'core' | 'execom' | 'shortlisted' | 'selected') => void;
  onToggleBranchFilter?: (branch: string) => void;
  onToggleYearFilter?: (year: string) => void;
  onToggleDomainFilter?: (domain: string) => void;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  activeFilterCount?: number;
}

export function RecruitmentsTable({
  recruitments,
  rawRecruitments,
  onUpdate,
  isUpdating,
  onSchedule,
  isScheduling,
  onDelete,
  isDeletingId,
  statFilter,
  branchFilter,
  yearFilter,
  domainFilter,
  onToggleStatFilter,
  onToggleBranchFilter,
  onToggleYearFilter,
  onToggleDomainFilter,
  onResetFilters,
  hasActiveFilters,
  activeFilterCount,
}: RecruitmentsTableProps) {
  const [scheduleApplicant, setScheduleApplicant] = useState<Recruitment | null>(null);

  // Use raw (total) recruitments to compute overall metrics
  const totalBase = rawRecruitments || recruitments;

  const stats = useMemo(() => ({
    total:       totalBase.length,
    core:        totalBase.filter(r => r.team?.toLowerCase() === 'core').length,
    execom:      totalBase.filter(r => r.team?.toLowerCase() === 'execom').length,
    shortlisted: totalBase.filter(r => r.status?.toLowerCase() === 'shortlisted').length,
    selected:    totalBase.filter(r => r.status?.toLowerCase() === 'selected').length,
  }), [totalBase]);

  const statItems: Array<{
    key: 'total' | 'core' | 'execom' | 'shortlisted' | 'selected';
    label: string;
    value: number;
    icon: any;
    color: string;
    border: string;
  }> = [
    { key: 'total',       label: 'Total',       value: stats.total,       icon: Users,        color: iconColors.blue,   border: borderColors.blue   },
    { key: 'core',        label: 'Core',        value: stats.core,        icon: Briefcase,    color: iconColors.orange, border: borderColors.orange },
    { key: 'execom',      label: 'Execom',      value: stats.execom,      icon: GraduationCap,color: iconColors.purple, border: borderColors.purple },
    { key: 'shortlisted', label: 'Shortlisted', value: stats.shortlisted, icon: Calendar,     color: iconColors.green,  border: borderColors.green  },
    { key: 'selected',    label: 'Selected',    value: stats.selected,    icon: CheckCircle2, color: iconColors.cyan,   border: borderColors.cyan   },
  ];

  const branchStats = useMemo(() => {
    const counts: Record<string, number> = {};
    totalBase.forEach(r => {
      if (r.branch) counts[r.branch] = (counts[r.branch] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [totalBase]);

  const yearStats = useMemo(() => {
    const counts: Record<string, number> = {};
    totalBase.forEach(r => {
      if (r.year) counts[r.year] = (counts[r.year] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [totalBase]);

  const domainStats = useMemo(() => {
    const counts: Record<string, number> = {};
    totalBase.forEach(r => {
      if (r.portfolio_1) counts[r.portfolio_1] = (counts[r.portfolio_1] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [totalBase]);

  return (
    <div className="space-y-4">
      {/* Analytics Strip */}
      <div className="flex flex-wrap items-center gap-2">
        {statItems.map(({ key, label, value, icon: Icon, color, border }) => {
          const isClickable = key !== 'total';
          const isActive = statFilter === key;

          return (
            <button
              key={label}
              type="button"
              disabled={!isClickable}
              onClick={() => {
                if (isClickable && onToggleStatFilter) {
                  onToggleStatFilter(key as 'core' | 'execom' | 'shortlisted' | 'selected');
                }
              }}
              className={`group flex items-center gap-2.5 rounded-lg border px-4 py-2.5 transition-all text-left ${
                isClickable ? 'cursor-pointer hover:bg-muted/50 select-none' : 'cursor-default'
              } ${
                isActive
                  ? `bg-muted/80 ring-2 ring-primary/60 shadow-md ${border}`
                  : border
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${color}`} />
              <span className={`text-lg font-bold leading-none ${color}`}>{value}</span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                {label}
                {isActive && <Check className="h-3.5 w-3.5 text-primary animate-in fade-in zoom-in-75" />}
              </span>
            </button>
          );
        })}

        {/* Branches Dropdown Filter */}
        {branchStats.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 cursor-pointer hover:bg-muted/50 transition-all select-none ${
                  branchFilter
                    ? `bg-muted/80 ring-2 ring-primary/60 shadow-md ${borderColors.indigo}`
                    : borderColors.indigo
                }`}
              >
                <Building2 className={`h-4 w-4 shrink-0 ${iconColors.indigo}`} />
                <span className={`text-lg font-bold leading-none ${iconColors.indigo}`}>
                  {branchFilter ? 1 : branchStats.length}
                </span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  {branchFilter ? `Branch: ${branchFilter}` : 'Branches'}
                  <ChevronDown className="h-3 w-3" />
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[14rem] max-w-xs max-h-72 overflow-y-auto">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                Filter by Branch
              </DropdownMenuLabel>
              {branchFilter && (
                <>
                  <DropdownMenuItem
                    onClick={() => onToggleBranchFilter?.(branchFilter)}
                    className="text-xs font-medium text-destructive cursor-pointer"
                  >
                    Clear Branch Filter
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {branchStats.map(([branch, count]) => {
                const isSelected = branchFilter === branch;
                return (
                  <DropdownMenuItem
                    key={branch}
                    onClick={() => onToggleBranchFilter?.(branch)}
                    className={`flex justify-between py-2.5 px-3 border-b border-border/40 last:border-0 cursor-pointer gap-4 transition-colors ${
                      isSelected ? 'bg-primary/10 font-semibold' : ''
                    }`}
                  >
                    <span className="text-sm flex items-center gap-2 whitespace-normal break-words leading-tight">
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      {branch}
                    </span>
                    <span className="font-bold text-muted-foreground text-xs shrink-0">{count}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Years Dropdown Filter */}
        {yearStats.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 cursor-pointer hover:bg-muted/50 transition-all select-none ${
                  yearFilter
                    ? `bg-muted/80 ring-2 ring-primary/60 shadow-md ${borderColors.pink}`
                    : borderColors.pink
                }`}
              >
                <CalendarDays className={`h-4 w-4 shrink-0 ${iconColors.pink}`} />
                <span className={`text-lg font-bold leading-none ${iconColors.pink}`}>
                  {yearFilter ? 1 : yearStats.length}
                </span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  {yearFilter ? `Year: ${yearFilter}` : 'Years'}
                  <ChevronDown className="h-3 w-3" />
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[12rem] max-w-xs max-h-72 overflow-y-auto">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                Filter by Year
              </DropdownMenuLabel>
              {yearFilter && (
                <>
                  <DropdownMenuItem
                    onClick={() => onToggleYearFilter?.(yearFilter)}
                    className="text-xs font-medium text-destructive cursor-pointer"
                  >
                    Clear Year Filter
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {yearStats.map(([year, count]) => {
                const isSelected = yearFilter === year;
                return (
                  <DropdownMenuItem
                    key={year}
                    onClick={() => onToggleYearFilter?.(year)}
                    className={`flex justify-between py-2.5 px-3 border-b border-border/40 last:border-0 cursor-pointer gap-4 transition-colors ${
                      isSelected ? 'bg-primary/10 font-semibold' : ''
                    }`}
                  >
                    <span className="text-sm flex items-center gap-2 whitespace-normal break-words leading-tight">
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      {year}
                    </span>
                    <span className="font-bold text-muted-foreground text-xs shrink-0">{count}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Domains Dropdown Filter */}
        {domainStats.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 cursor-pointer hover:bg-muted/50 transition-all select-none ${
                  domainFilter
                    ? `bg-muted/80 ring-2 ring-primary/60 shadow-md ${borderColors.teal}`
                    : borderColors.teal
                }`}
              >
                <Briefcase className={`h-4 w-4 shrink-0 ${iconColors.teal}`} />
                <span className={`text-lg font-bold leading-none ${iconColors.teal}`}>
                  {domainFilter ? 1 : domainStats.length}
                </span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  {domainFilter ? `Domain: ${domainFilter}` : 'Domains'}
                  <ChevronDown className="h-3 w-3" />
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[14rem] max-w-xs max-h-72 overflow-y-auto">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                Filter by Domain
              </DropdownMenuLabel>
              {domainFilter && (
                <>
                  <DropdownMenuItem
                    onClick={() => onToggleDomainFilter?.(domainFilter)}
                    className="text-xs font-medium text-destructive cursor-pointer"
                  >
                    Clear Domain Filter
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {domainStats.map(([domain, count]) => {
                const isSelected = domainFilter === domain;
                return (
                  <DropdownMenuItem
                    key={domain}
                    onClick={() => onToggleDomainFilter?.(domain)}
                    className={`flex justify-between py-2.5 px-3 border-b border-border/40 last:border-0 cursor-pointer gap-4 transition-colors ${
                      isSelected ? 'bg-primary/10 font-semibold' : ''
                    }`}
                  >
                    <span className="text-sm flex items-center gap-2 whitespace-normal break-words leading-tight">
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      {domain}
                    </span>
                    <span className="font-bold text-muted-foreground text-xs shrink-0">{count}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Reset All Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Filters ({activeFilterCount})</span>
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-card/50 p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Top Domain</TableHead>
              <TableHead className="text-center">Details</TableHead>
              <TableHead className="text-center">Interview</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recruitments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No applicants match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              recruitments.map((recruitment) => {
              const CurrentIcon = RECRUITMENT_STATUS_CONFIG[recruitment.status].icon;
              
              return (
                <TableRow key={recruitment.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{recruitment.name}</span>
                      <span className="text-xs text-muted-foreground">{recruitment.email} • {recruitment.roll_no}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant={recruitment.team?.toLowerCase() === 'core' ? 'default' : 'secondary'} className="text-xs uppercase">
                      {recruitment.team}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">{recruitment.portfolio_1}</span>
                      {recruitment.portfolio_2 && (
                        <span className="text-xs text-muted-foreground opacity-75">2nd: {recruitment.portfolio_2}</span>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <RecruitmentDetailsModal recruitment={recruitment} />
                  </TableCell>

                  <TableCell className="text-center">
                    {recruitment.interview_time ? (
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold">{new Date(recruitment.interview_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                        {recruitment.is_email_sent && (
                          <Button
                            variant="outline"
                            size="sm"
                            className=""
                            onClick={() => setScheduleApplicant(recruitment)}
                          >
                            <Mail className={`w-3.5 h-3.5 mr-2 ${iconColors.green}`} />
                            Resend Email
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button variant="secondary" size="sm" onClick={() => {
                        setScheduleApplicant(recruitment);
                      }}>
                        Schedule
                      </Button>
                    )}
                  </TableCell>

                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Select
                        value={recruitment.status}
                        onValueChange={(val) => onUpdate({ id: recruitment.id, status: val as any })}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-[140px] ml-auto h-8 text-xs">
                          <div className="flex items-center gap-2">
                            <CurrentIcon className={`h-3 w-3 ${RECRUITMENT_STATUS_CONFIG[recruitment.status].color}`} />
                            <span>{RECRUITMENT_STATUS_CONFIG[recruitment.status].label}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent align="end">
                          {Object.entries(RECRUITMENT_STATUS_CONFIG).map(([status, config]) => {
                            const Icon = config.icon;
                            return (
                              <SelectItem key={status} value={status}>
                                <div className="flex items-center gap-2 text-xs">
                                  <Icon className={`h-3 w-3 ${config.color}`} />
                                  <span>{config.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      {onDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" disabled={isDeletingId === recruitment.id}>
                              {isDeletingId === recruitment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete <strong>{recruitment.name}</strong>'s recruitment application.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete(recruitment.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
          </TableBody>
        </Table>
      </div>

      <ScheduleModal 
        isOpen={!!scheduleApplicant}
        onClose={() => setScheduleApplicant(null)}
        applicant={scheduleApplicant}
        onSchedule={async (id, time, venue) => {
          try {
            await onSchedule(id, time, venue);
            setScheduleApplicant(null);
          } catch (e) {
            // Error is handled by sonner in the hook
          }
        }}
        isScheduling={isScheduling}
      />
    </div>
  );
}
