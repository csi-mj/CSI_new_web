'use client';

import { useMemo } from 'react';

import { MembershipDetailsModal } from './MembershipDetailsModal';
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
import { CheckCircle2, Clock, XCircle, Banknote, ExternalLink, Users, Building2, CalendarDays, ChevronDown, Trash2, Loader2 } from 'lucide-react';
import { iconColors, translucentBgColors, borderColors } from '@/config/colors';
import type { CsiMembership } from '@/lib/types/memberships';
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
import { Button } from '@/components/ui/button';

export const MEMBERSHIP_STATUS_CONFIG = {
  pending: { icon: Clock, color: iconColors.yellow, label: 'Pending' },
  verified: { icon: CheckCircle2, color: iconColors.green, label: 'Verified' },
  rejected: { icon: XCircle, color: iconColors.red, label: 'Rejected' },
};

interface MembershipsTableProps {
  memberships: CsiMembership[];
  onStatusChange: (membershipId: string, newStatus: CsiMembership['status']) => void;
  isUpdatingStatus: boolean;
  onDelete?: (membershipId: string) => void;
  isDeletingId?: string | null;
}

export function MembershipsTable({ memberships, onStatusChange, isUpdatingStatus, onDelete, isDeletingId }: MembershipsTableProps) {
  const stats = useMemo(() => ({
    total:    memberships.length,
    pending:  memberships.filter(m => m.status === 'pending').length,
    verified: memberships.filter(m => m.status === 'verified').length,
    rejected: memberships.filter(m => m.status === 'rejected').length,
  }), [memberships]);

  const statItems = [
    { label: 'Total',    value: stats.total,    icon: Users,        color: iconColors.blue,   border: borderColors.blue   },
    { label: 'Verified', value: stats.verified, icon: CheckCircle2, color: iconColors.green,  border: borderColors.green  },
    { label: 'Pending',  value: stats.pending,  icon: Clock,        color: iconColors.yellow, border: borderColors.yellow },
    { label: 'Rejected', value: stats.rejected, icon: XCircle,      color: iconColors.red,    border: borderColors.red    },
  ];

  const branchStats = useMemo(() => {
    const counts: Record<string, number> = {};
    memberships.forEach(m => {
      if (m.branch) counts[m.branch] = (counts[m.branch] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [memberships]);

  const yearStats = useMemo(() => {
    const counts: Record<string, number> = {};
    memberships.forEach(m => {
      if (m.year) counts[m.year] = (counts[m.year] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [memberships]);

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
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Roll No</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead className="text-center">Year</TableHead>
            <TableHead className="text-center">Details</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberships.map((membership) => {
            const CurrentIcon = MEMBERSHIP_STATUS_CONFIG[membership.status].icon;
            
            return (
              <TableRow key={membership.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col gap-1">
                    <span>{membership.name}</span>
                    {membership.payment_mode === 'cash' && (
                      <Badge variant="outline" className={`w-fit text-[10px] ${borderColors.yellow} ${translucentBgColors.yellow} ${iconColors.yellow} flex items-center gap-1 px-1.5 py-0 h-4`} title="Paying in Cash">
                        <Banknote className="w-3 h-3" /> Cash
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{membership.email}</TableCell>
                <TableCell>{membership.contact || '-'}</TableCell>
                <TableCell>{membership.roll_no || '-'}</TableCell>
                <TableCell>{membership.branch || '-'}</TableCell>
                <TableCell className="text-center">{membership.year || '-'}</TableCell>
                
                <TableCell className="text-center">
                  <MembershipDetailsModal membership={membership} />
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Select
                      defaultValue={membership.status}
                      onValueChange={(val) => onStatusChange(membership.id, val as CsiMembership['status'])}
                      disabled={isUpdatingStatus}
                    >
                     <SelectTrigger className="h-10! w-[130px]">
                        <div className="flex items-center gap-2">
                          <CurrentIcon className={`w-4 h-4 ${MEMBERSHIP_STATUS_CONFIG[membership.status].color}`} />
                          <span className="text-xs font-semibold">
                            {MEMBERSHIP_STATUS_CONFIG[membership.status].label}
                          </span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(MEMBERSHIP_STATUS_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <config.icon className={`w-4 h-4 ${config.color}`} />
                              <span className="text-sm">{config.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {onDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive hover:bg-destructive/10" disabled={isDeletingId === membership.id}>
                            {isDeletingId === membership.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete <strong>{membership.name}</strong>'s membership record.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(membership.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
