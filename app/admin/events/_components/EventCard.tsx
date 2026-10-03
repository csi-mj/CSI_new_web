import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { computeEventStatus } from '@/lib/eventStatus';
import { EventRow } from '../hooks/useAdminEvents';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const statusColors: Record<string, string> = {
  upcoming: 'bg-primary/20 text-primary hover:bg-primary/30',
  ongoing: 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30',
  completed: 'bg-muted text-muted-foreground hover:bg-muted/80',
  cancelled: 'bg-destructive/20 text-destructive hover:bg-destructive/30'
};

export function EventCard({
  event,
  onEdit,
  onToggleCancel,
  onDelete,
  onCreateForm,
  onViewParticipants,
  disabled,
  isDeleting,
  isUpdating
}: {
  event: EventRow;
  onEdit?: () => void;
  onToggleCancel?: () => void;
  onDelete?: () => void;
  onCreateForm?: () => void;
  onViewParticipants?: () => void;
  disabled?: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
}) {
  return (
    <Card className="flex flex-col overflow-hidden p-0 gap-0 transition-all hover:border-primary/50 cursor-target">
      {event.poster_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.poster_url}
          alt={event.title}
          className="aspect-[2/1] w-full object-cover transition-transform"
        />
      )}
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
          <Badge
            variant="secondary"
            className={`shrink-0 capitalize ${statusColors[computeEventStatus(event)]}`}
          >
            {computeEventStatus(event)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground text-sm line-clamp-1">
          {new Date(event.event_date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
          {event.venue ? ` · ${event.venue}` : ''}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-4 pt-0 mt-auto">
        <Button variant="outline" className="w-full" onClick={onViewParticipants} disabled={disabled}>
          View Participants
        </Button>
        {computeEventStatus(event) === 'upcoming' && (
          <Button variant="default" className="w-full" onClick={onCreateForm} disabled={disabled}>
            Manage Registration Form
          </Button>
        )}
        <div className="flex w-full items-center gap-2">
          <Button variant="outline" className="flex-1" onClick={onEdit} disabled={disabled}>
            Edit
          </Button>
          <Button variant="outline" className="flex-1" onClick={onToggleCancel} disabled={disabled}>
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : (event.status === 'cancelled' ? 'Restore' : 'Cancel')}
          </Button>
          <Button variant="destructive" className="flex-1" onClick={onDelete} disabled={disabled}>
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
