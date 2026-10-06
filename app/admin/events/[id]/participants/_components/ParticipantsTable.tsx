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
import { CheckCircle2, Clock, Hourglass, XCircle, Mail, Loader2, Banknote, Users, ScanLine, Award, Building2, CalendarDays, ChevronDown, Trash2 } from 'lucide-react';
import { iconColors, translucentBgColors, borderColors } from '@/config/colors';
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

export const STATUS_CONFIG = {
  pending: { icon: Clock, color: iconColors.yellow, label: 'Pending' },
  confirmed: { icon: CheckCircle2, color: iconColors.green, label: 'Confirmed' },
  waitlisted: { icon: Hourglass, color: iconColors.blue, label: 'Waitlisted' },
  rejected: { icon: XCircle, color: iconColors.red, label: 'Rejected' },
};

interface ParticipantsTableProps {
  participants: Participant[];
  onStatusChange: (registrationId: string, newStatus: Participant['registration_status']) => void;
  onAttendanceChange: (registrationId: string, isAttended: boolean) => void;
  onSendTicket: (participantId: string) => void;
  sendingTicketId: string | null;
  onDelete?: (registrationId: string) => void;
  isDeletingId?: string | null;
}

export function ParticipantsTable({ participants, onStatusChange, onAttendanceChange, onSendTicket, sendingTicketId, onDelete, isDeletingId }: ParticipantsTableProps) {
  const stats = useMemo(() => ({
    total:     participants.length,
    confirmed: participants.filter(p => p.registration_status === 'confirmed').length,
    cash:      participants.filter(p => p.payment_mode === 'cash').length,
    attended:  participants.filter(p => p.is_attended).length,
    csi:       participants.filter(p => p.is_csi_member).length,
  }), [participants]);

  const statItems = [
    { label: 'Total',     value: stats.total,      icon: Users,       color: iconColors.blue,   border: borderColors.blue   },
    { label: 'Attended',  value: stats.attended,   icon: ScanLine,    color: iconColors.green,  border: borderColors.green  },
    { label: 'Confirmed', value: stats.confirmed,  icon: CheckCircle2,color: iconColors.green,  border: borderColors.green  },
    { label: 'CSI Members', value: stats.csi,      icon: Award,       color: iconColors.purple, border: borderColors.purple },
    { label: 'Cash',      value: stats.cash,       icon: Banknote,    color: iconColors.yellow, border: borderColors.yellow },
  ];

  const collegeStats = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      if (p.user_college) counts[p.user_college] = (counts[p.user_college] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [participants]);

  const branchStats = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
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
  }, [participants]);

  const yearStats = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      if (p.user_year) counts[p.user_year] = (counts[p.user_year] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [participants]);

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

        {collegeStats.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors ${borderColors.indigo}`}>
                <Building2 className={`h-4 w-4 shrink-0 ${iconColors.indigo}`} />
                <span className={`text-lg font-bold leading-none ${iconColors.indigo}`}>{collegeStats.length}</span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">Colleges <ChevronDown className="h-3 w-3" /></span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[12rem] max-w-sm">
              {collegeStats.map(([college, count]) => (
                <DropdownMenuItem key={college} className="flex justify-between py-3 px-4 border-b border-border/50 last:border-0 rounded-none cursor-default gap-4">
                  <span className="text-sm font-medium whitespace-normal break-words leading-tight">{college}</span>
                  <span className="font-bold text-muted-foreground">{count}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {branchStats.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors ${borderColors.cyan}`}>
                <Building2 className={`h-4 w-4 shrink-0 ${iconColors.cyan}`} />
                <span className={`text-lg font-bold leading-none ${iconColors.cyan}`}>{branchStats.length}</span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">Branches <ChevronDown className="h-3 w-3" /></span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[12rem] max-w-sm">
              {branchStats.map(([branch, count]) => (
                <DropdownMenuItem key={branch} className="flex justify-between py-3 px-4 border-b border-border/50 last:border-0 rounded-none cursor-default gap-4">
                  <span className="text-sm font-medium whitespace-normal break-words leading-tight">{branch}</span>
                  <span className="font-bold text-muted-foreground">{count}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {yearStats.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors ${borderColors.pink}`}>
                <CalendarDays className={`h-4 w-4 shrink-0 ${iconColors.pink}`} />
                <span className={`text-lg font-bold leading-none ${iconColors.pink}`}>{yearStats.length}</span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">Years <ChevronDown className="h-3 w-3" /></span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[10rem] max-w-sm">
              {yearStats.map(([year, count]) => (
                <DropdownMenuItem key={year} className="flex justify-between py-3 px-4 border-b border-border/50 last:border-0 rounded-none cursor-default gap-4">
                  <span className="text-sm font-medium whitespace-normal break-words leading-tight">{year}</span>
                  <span className="font-bold text-muted-foreground">{count}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
