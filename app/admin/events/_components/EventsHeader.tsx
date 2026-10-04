import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function EventsHeader({
  onAddEvent,
  filter,
  setFilter,
  statuses
}: {
  onAddEvent: () => void;
  filter: string;
  setFilter: (s: string) => void;
  statuses: string[];
}) {
  return (
    <div className="sticky -top-6 z-20 -mx-4 -mt-6 mb-6 flex flex-col gap-4 border-b border-border bg-background p-4 md:-top-8 md:-mx-8 md:-mt-8 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Events
        </h1>
        <Button onClick={onAddEvent}>
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Button
            key={s}
            variant={filter === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(s)}
            className="capitalize rounded-full"
          >
            {s}
          </Button>
        ))}
      </div>
    </div>
  );
}
