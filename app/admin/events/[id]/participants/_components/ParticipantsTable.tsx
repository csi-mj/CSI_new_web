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
import { CheckCircle2, Clock, Hourglass, XCircle, Mail, Loader2, Banknote, Users, ScanLine, Award } from 'lucide-react';
import { iconColors, translucentBgColors, borderColors } from '@/config/colors';

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
}

export function ParticipantsTable({ participants, onStatusChange, onAttendanceChange, onSendTicket, sendingTicketId }: ParticipantsTableProps) {
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
                  <Select
                    value={participant.registration_status}
                    onValueChange={(val: any) => {
                      if (val) onStatusChange(participant.id, val as Participant['registration_status']);
                    }}
                  >
                    <SelectTrigger className="h-10!">
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
