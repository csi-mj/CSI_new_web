'use client';

import { useMemo } from 'react';
import { Participant } from '../hooks/useParticipants';
import { ParticipantDetailsModal } from './ParticipantDetailsModal';
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
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Hourglass, XCircle, Mail, Loader2, Banknote, Users, ScanLine, Award, Building2, CalendarDays, ChevronDown, Trash2, Check, RotateCcw } from 'lucide-react';
import { iconColors, translucentBgColors, borderColors } from '@/config/colors';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
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

export const STATUS_CONFIG = {
  pending: { icon: Clock, color: iconColors.yellow, label: 'Pending' },
  confirmed: { icon: CheckCircle2, color: iconColors.green, label: 'Confirmed' },
  waitlisted: { icon: Hourglass, color: iconColors.blue, label: 'Waitlisted' },
  rejected: { icon: XCircle, color: iconColors.red, label: 'Rejected' },
};

interface ParticipantsTableProps {
  participants: Participant[];
  rawParticipants?: Participant[];
  onStatusChange: (registrationId: string, newStatus: Participant['registration_status']) => void;
  onAttendanceChange: (registrationId: string, isAttended: boolean) => void;
  onSendTicket: (participantId: string) => void;
  sendingTicketId: string | null;
  onDelete?: (registrationId: string) => void;
  isDeletingId?: string | null;
  // Interactive Filter Props
  statFilter?: 'attended' | 'confirmed' | 'csi' | 'cash' | null;
  collegeFilter?: string | null;
  branchFilter?: string | null;
  yearFilter?: string | null;
  onToggleStatFilter?: (key: 'attended' | 'confirmed' | 'csi' | 'cash') => void;
  onToggleCollegeFilter?: (college: string) => void;
  onToggleBranchFilter?: (branch: string) => void;
  onToggleYearFilter?: (year: string) => void;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  activeFilterCount?: number;
}

export function ParticipantsTable({
  participants,
  rawParticipants,
  onStatusChange,
  onAttendanceChange,
  onSendTicket,
  sendingTicketId,
  onDelete,
  isDeletingId,
  statFilter,
  collegeFilter,
  branchFilter,
  yearFilter,
  onToggleStatFilter,
  onToggleCollegeFilter,
  onToggleBranchFilter,
  onToggleYearFilter,
  onResetFilters,
  hasActiveFilters,
  activeFilterCount,
}: ParticipantsTableProps) {
  // Use raw (total) participants to compute overall metrics
  const totalBase = rawParticipants || participants;

  const stats = useMemo(() => ({
    total:     totalBase.length,
    confirmed: totalBase.filter(p => p.registration_status === 'confirmed').length,
    cash:      totalBase.filter(p => p.payment_mode === 'cash').length,
    attended:  totalBase.filter(p => p.is_attended).length,
    csi:       totalBase.filter(p => p.is_csi_member).length,
  }), [totalBase]);

  const statItems: Array<{
    key: 'total' | 'attended' | 'confirmed' | 'csi' | 'cash';
    label: string;
    value: number;
    icon: any;
    color: string;
    border: string;
  }> = [
    { key: 'total',     label: 'Total',     value: stats.total,      icon: Users,       color: iconColors.blue,   border: borderColors.blue   },
    { key: 'attended',  label: 'Attended',  value: stats.attended,   icon: ScanLine,    color: iconColors.green,  border: borderColors.green  },
    { key: 'confirmed', label: 'Confirmed', value: stats.confirmed,  icon: CheckCircle2,color: iconColors.green,  border: borderColors.green  },
    { key: 'csi',       label: 'CSI Members', value: stats.csi,      icon: Award,       color: iconColors.purple, border: borderColors.purple },
    { key: 'cash',      label: 'Cash',      value: stats.cash,       icon: Banknote,    color: iconColors.yellow, border: borderColors.yellow },
  ];

  const collegeStats = useMemo(() => {
    const counts: Record<string, number> = {};
    totalBase.forEach(p => {
      if (p.user_college) counts[p.user_college] = (counts[p.user_college] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [totalBase]);

  const branchStats = useMemo(() => {
    const counts: Record<string, number> = {};
    totalBase.forEach(p => {
      if (p.additional_info && typeof p.additional_info === 'object') {
        const branchKey = Object.keys(p.additional_info).find(key => key.toLowerCase().includes('branch'));
        if (branchKey) {
          const branch = p.additional_info[branchKey];
          if (branch && typeof branch === 'string') {
            counts[branch] = (counts[branch] || 0) + 1;
          }
        }
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [totalBase]);

  const yearStats = useMemo(() => {
    const counts: Record<string, number> = {};
    totalBase.forEach(p => {
      if (p.user_year) counts[p.user_year] = (counts[p.user_year] || 0) + 1;
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
                  onToggleStatFilter(key as 'attended' | 'confirmed' | 'csi' | 'cash');
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

        {/* Colleges Dropdown Filter */}
        {collegeStats.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 cursor-pointer hover:bg-muted/50 transition-all select-none ${
                  collegeFilter
                    ? `bg-muted/80 ring-2 ring-primary/60 shadow-md ${borderColors.indigo}`
                    : borderColors.indigo
                }`}
              >
                <Building2 className={`h-4 w-4 shrink-0 ${iconColors.indigo}`} />
                <span className={`text-lg font-bold leading-none ${iconColors.indigo}`}>
                  {collegeFilter ? 1 : collegeStats.length}
                </span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  {collegeFilter ? `College: ${collegeFilter}` : 'Colleges'}
                  <ChevronDown className="h-3 w-3" />
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[14rem] max-w-xs max-h-72 overflow-y-auto">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                Filter by College
              </DropdownMenuLabel>
              {collegeFilter && (
                <>
                  <DropdownMenuItem
                    onClick={() => onToggleCollegeFilter?.(collegeFilter)}
                    className="text-xs font-medium text-destructive cursor-pointer"
                  >
                    Clear College Filter
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {collegeStats.map(([college, count]) => {
                const isSelected = collegeFilter === college;
                return (
                  <DropdownMenuItem
                    key={college}
                    onClick={() => onToggleCollegeFilter?.(college)}
                    className={`flex justify-between py-2.5 px-3 border-b border-border/40 last:border-0 cursor-pointer gap-4 transition-colors ${
                      isSelected ? 'bg-primary/10 font-semibold' : ''
                    }`}
                  >
                    <span className="text-sm flex items-center gap-2 whitespace-normal break-words leading-tight">
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      {college}
                    </span>
                    <span className="font-bold text-muted-foreground text-xs shrink-0">{count}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Branches Dropdown Filter */}
        {branchStats.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 cursor-pointer hover:bg-muted/50 transition-all select-none ${
                  branchFilter
                    ? `bg-muted/80 ring-2 ring-primary/60 shadow-md ${borderColors.cyan}`
                    : borderColors.cyan
                }`}
              >
                <Building2 className={`h-4 w-4 shrink-0 ${iconColors.cyan}`} />
                <span className={`text-lg font-bold leading-none ${iconColors.cyan}`}>
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

        {/* Reset All Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto"
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
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-center">Attended</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Details</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => {
            const CurrentIcon = STATUS_CONFIG[participant.registration_status].icon;
            
            return (
              <TableRow key={participant.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  {participant.user_name}
                  {participant.is_csi_member && (
                    <Badge variant="secondary" className="text-xs">CSI</Badge>
                  )}
                  {participant.payment_mode === 'cash' && (
                    <Badge variant="outline" className={`text-xs ${borderColors.yellow} ${translucentBgColors.yellow} ${iconColors.yellow} flex items-center gap-1`} title="Paying in Cash">
                      <Banknote className="w-3 h-3" /> Cash
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{participant.user_email}</TableCell>
                <TableCell>{participant.user_phone || '-'}</TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={!!participant.is_attended}
                    disabled={participant.registration_status !== 'confirmed'}
                    title={
                      participant.registration_status !== 'confirmed'
                        ? 'Cannot mark attendance for unconfirmed participant'
                        : 'Toggle Attendance'
                    }
                    onCheckedChange={(checked) => onAttendanceChange(participant.id, checked)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  {(() => {
                    const isSending = sendingTicketId === participant.id;
                    const isSent = participant.ticket_sent;
                    
                    return (
                      <Button
                        variant="outline"
                        size="sm"
                        className={`flex items-center gap-2 w-full justify-center ${isSent ? `${translucentBgColors.green} ${iconColors.green}` : ''}`}
                        title={
                          participant.registration_status !== 'confirmed'
                            ? 'Cannot send ticket to unconfirmed participant'
                            : isSent ? 'Ticket already sent! Click to resend.' : 'Send Ticket Email'
                        }
                        disabled={participant.registration_status !== 'confirmed' || isSending}
                        onClick={() => onSendTicket(participant.id)}
                      >
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : isSent ? (
                          <CheckCircle2 className={`h-4 w-4 ${iconColors.green}`} />
                        ) : (
                          <Mail className={`h-4 w-4 ${participant.registration_status === 'confirmed' ? iconColors.blue : 'text-muted-foreground'}`} />
                        )}
                        <span className={isSent ? iconColors.green : ''}>{isSent ? 'Send Again' : 'Send'}</span>
                      </Button>
                    );
                  })()}
                </TableCell>
                <TableCell className="text-center">
                  <ParticipantDetailsModal participant={participant} />
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Select
                      value={participant.registration_status}
                      onValueChange={(val: any) => {
                        if (val) onStatusChange(participant.id, val as Participant['registration_status']);
                      }}
                    >
                      <SelectTrigger className="h-10! w-[140px]">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const config = STATUS_CONFIG[participant.registration_status];
                            if (!config) return null;
                            const Icon = config.icon;
                            return <Icon className={`h-4 w-4 ${config.color}`} />;
                          })()}
                          <SelectValue placeholder="Update Status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
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

                    {onDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive hover:bg-destructive/10" disabled={isDeletingId === participant.id}>
                            {isDeletingId === participant.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete <strong>{participant.user_name}</strong>'s registration from this event.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(participant.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
          })}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}
