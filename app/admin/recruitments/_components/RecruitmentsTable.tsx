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
import { Clock, CheckCircle2, XCircle, Users, Briefcase, FileText, Calendar, Mail, GraduationCap, Building2, CalendarDays, ChevronDown, Trash2, Loader2 } from 'lucide-react';
import { iconColors, translucentBgColors, borderColors } from '@/config/colors';
import { ScheduleModal } from './ScheduleModal';
import { RecruitmentDetailsModal } from './RecruitmentDetailsModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

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
  onUpdate: (updates: Partial<Recruitment> & { id: string }) => void;
  isUpdating: boolean;
  onSchedule: (id: string, time: string, venue: string) => Promise<any>;
  isScheduling: boolean;
  onDelete?: (id: string) => void;
  isDeletingId?: string | null;
}

export function RecruitmentsTable({ recruitments, onUpdate, isUpdating, onSchedule, isScheduling, onDelete, isDeletingId }: RecruitmentsTableProps) {
  const [scheduleApplicant, setScheduleApplicant] = useState<Recruitment | null>(null);

  const stats = useMemo(() => ({
    total:       recruitments.length,
    core:        recruitments.filter(r => r.team === 'Core').length,
    execom:      recruitments.filter(r => r.team === 'Execom').length,
    shortlisted: recruitments.filter(r => r.status === 'shortlisted').length,
    selected:    recruitments.filter(r => r.status === 'selected').length,
  }), [recruitments]);

  const statItems = [
    { label: 'Total',       value: stats.total,       icon: Users,        color: iconColors.blue,   border: borderColors.blue   },
    { label: 'Core',        value: stats.core,        icon: Briefcase,    color: iconColors.orange, border: borderColors.orange },
    { label: 'Execom',      value: stats.execom,      icon: GraduationCap,color: iconColors.purple, border: borderColors.purple },
    { label: 'Shortlisted', value: stats.shortlisted, icon: Calendar,     color: iconColors.green,  border: borderColors.green  },
    { label: 'Selected',    value: stats.selected,    icon: CheckCircle2, color: iconColors.cyan,border: borderColors.cyan},
  ];

  const branchStats = useMemo(() => {
    const counts: Record<string, number> = {};
    recruitments.forEach(r => {
      if (r.branch) counts[r.branch] = (counts[r.branch] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [recruitments]);

  const yearStats = useMemo(() => {
    const counts: Record<string, number> = {};
    recruitments.forEach(r => {
      if (r.year) counts[r.year] = (counts[r.year] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [recruitments]);

  return (
    <div className="space-y-4">
      {/* Analytics Strip */}
      <div className="flex flex-wrap gap-2">
        {statItems.map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 ${border}`}>
            <Icon className={`h-4 w-4 shrink-0 ${color}`} />
            <span className={`text-lg font-bold leading-none ${color}`}>{value}</span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
          </div>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors ${borderColors.indigo}`}>
              <Building2 className={`h-4 w-4 shrink-0 ${iconColors.indigo}`} />
              <span className={`text-lg font-bold leading-none ${iconColors.indigo}`}>{branchStats.length}</span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">Branches <ChevronDown className="h-3 w-3" /></span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[12rem] max-w-sm">
            {branchStats.length === 0 ? (
              <DropdownMenuItem disabled>No branches found</DropdownMenuItem>
            ) : (
              branchStats.map(([branch, count]) => (
                <DropdownMenuItem key={branch} className="flex justify-between py-3 px-4 border-b border-border/50 last:border-0 rounded-none cursor-default gap-4">
                  <span className="text-sm font-medium whitespace-normal break-words leading-tight">{branch}</span>
                  <span className="font-bold text-muted-foreground">{count}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors ${borderColors.pink}`}>
              <CalendarDays className={`h-4 w-4 shrink-0 ${iconColors.pink}`} />
              <span className={`text-lg font-bold leading-none ${iconColors.pink}`}>{yearStats.length}</span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">Years <ChevronDown className="h-3 w-3" /></span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[10rem] max-w-sm">
            {yearStats.length === 0 ? (
              <DropdownMenuItem disabled>No years found</DropdownMenuItem>
            ) : (
              yearStats.map(([year, count]) => (
                <DropdownMenuItem key={year} className="flex justify-between py-3 px-4 border-b border-border/50 last:border-0 rounded-none cursor-default gap-4">
                  <span className="text-sm font-medium whitespace-normal break-words leading-tight">{year}</span>
                  <span className="font-bold text-muted-foreground">{count}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
            {recruitments.map((recruitment) => {
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
                    <Badge variant={recruitment.team === 'Core' ? 'default' : 'secondary'} className="text-xs">
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
            })}
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
