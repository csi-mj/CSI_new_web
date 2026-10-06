'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useParticipants } from './hooks/useParticipants';
import {
  ParticipantsTable,
  STATUS_CONFIG
} from './_components/ParticipantsTable';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Search, Filter, QrCode } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/admin/_components/ui';
import { DataBoundary } from '@/components/ui/data-boundary';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { iconColors, bgColors } from '@/config/colors';
import { cn } from '@/lib/utils';

export default function ParticipantsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch event details to show the title
  const { data: eventData } = useQuery({
    queryKey: ['admin-event', eventId],
    queryFn: () => api(`/api/events/${eventId}`, 'GET'),
    enabled: !!eventId
  });

  const { participants, isLoading, error, updateStatus, updateAttendance, sendTicket, sendingTicketId, deleteParticipant, isDeletingId } =
    useParticipants(eventId);

  const eventTitle = eventData?.data?.title || 'Loading Event...';

  const filteredParticipants = participants.filter((p) => {
    // 1. Filter by status
    if (statusFilter !== 'all' && p.registration_status !== statusFilter)
      return false;

    // 2. Filter by search query
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.user_name.toLowerCase().includes(q) ||
      p.user_email.toLowerCase().includes(q) ||
      (p.user_phone && p.user_phone.includes(q))
    );
  });

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col gap-4 border-b pb-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/admin/events')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Participants</h1>
              <p className="text-muted-foreground text-lg">{eventTitle}</p>
            </div>
          </div>
          
          <Button onClick={() => router.push(`/admin/events/${eventId}/scanner`)} className={cn("gap-2 hover:opacity-90", bgColors.blue)}>
            <QrCode className="h-4 w-4" />
            Scan Ticket
          </Button>
        </div>

        <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
          <div className="relative w-full sm:flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search by name, email, phone..."
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
                    <Filter className={cn("size-4",iconColors.rose)} />
                  ) : (
                    (() => {
                      const config = STATUS_CONFIG[statusFilter as keyof typeof STATUS_CONFIG];
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
          </div>
        </div>
      </div>

      <div className="flex-1">
        <DataBoundary
          isLoading={isLoading}
          isError={!!error}
          error={error as Error}
          isEmpty={participants.length === 0}
          emptyIcon={Users}
          emptyTitle="No participants yet"
          emptyDescription="When people register for this event, they will appear here."
        >
          <ParticipantsTable
            participants={filteredParticipants}
            onStatusChange={updateStatus}
            onAttendanceChange={updateAttendance}
            onSendTicket={sendTicket}
            sendingTicketId={sendingTicketId}
            onDelete={deleteParticipant}
            isDeletingId={isDeletingId}
          />
        </DataBoundary>
      </div>
    </div>
  );
}
