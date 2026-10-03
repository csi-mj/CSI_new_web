'use client';

import type { Event, UpcomingEvent } from '@/lib/types/events';
import React from 'react';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { iconColors } from '@/config/colors';

function formatDate(iso?: string | null) {
  if (!iso) return 'TBA';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return iso;
  }
}

function formatTime(iso?: string | null) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
}

export default function HeroEventCard({ event }: { event: Event }) {
  const isUpcoming = event.status === 'upcoming';
  const upcoming = event as UpcomingEvent;

  return (
    <Card className="group border-border/50 bg-card hover:border-primary/50 relative mb-10 flex w-full flex-col gap-0 overflow-hidden rounded-3xl py-0 shadow-lg transition-all duration-500 lg:flex-row">
      {/* Image Section (Left / Top) */}
      <div className="relative min-h-[300px] w-full overflow-hidden lg:min-h-[500px] lg:w-[55%]">
        <img
          src={event.poster_url ?? '/default-poster.png'}
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="from-background via-background/20 lg:via-background/50 lg:to-background absolute inset-0 bg-gradient-to-t to-transparent lg:bg-gradient-to-r lg:from-transparent"></div>

        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-primary/90 text-primary-foreground animate-pulse rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-lg backdrop-blur-md">
            Next Event
          </span>
        </div>
      </div>

      {/* Content Section (Right / Bottom) */}
      <CardContent className="relative z-10 flex w-full flex-col justify-center space-y-6 p-6 md:p-10 lg:w-[45%] lg:pb-10">
        <div>
          <div className="text-muted-foreground mb-3 flex items-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-2 font-mono">
              <Calendar className={`h-5 w-5 ${iconColors.blue}`} />
              {formatDate(event.event_date)}
            </span>
            {event.category && (
              <span className="text-primary border-primary/20 bg-primary/5 rounded border px-2 py-0.5 text-xs font-bold tracking-widest uppercase">
                {event.category}
              </span>
            )}
          </div>

          <h2 className="text-card-foreground mb-4 text-3xl leading-tight font-black tracking-tight md:text-5xl">
            {event.title}
          </h2>

          {event.description && (
            <p className="text-muted-foreground line-clamp-3 text-base leading-relaxed md:text-lg">
              {event.description}
            </p>
          )}
        </div>

        {/* Time & Venue Grid */}
        <div className="border-border/50 grid grid-cols-2 gap-4 border-y py-5">
          <div className="flex items-center gap-3">
            <div
              className={`bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconColors.rose}`}
            >
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase md:text-xs">
                Venue
              </span>
              <span className="text-card-foreground truncate text-sm font-semibold">
                {event.venue ?? 'TBA'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconColors.orange}`}
            >
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase md:text-xs">
                Time
              </span>
              <span className="text-card-foreground truncate text-sm font-semibold">
                {event.time_range
                  ? event.time_range
                  : event.event_end_date
                    ? `${formatTime(event.event_date)} - ${formatTime(event.event_end_date)}`
                    : formatTime(event.event_date)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row">
          {isUpcoming && upcoming.is_registration_open ? (
            <Button
              size="lg"
              className="group/btn h-12 w-full rounded-full px-8 text-base font-bold sm:w-auto"
            >
              Register Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          ) : isUpcoming ? (
            <Button
              size="lg"
              variant="secondary"
              className="h-12 w-full rounded-full px-8 text-base font-bold sm:w-auto"
              disabled
            >
              Registration Closed
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-full px-8 text-base font-bold sm:w-auto"
            >
              View Details
            </Button>
          )}

          {event.highlights && event.highlights.length > 0 && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <Sparkles className={`h-4 w-4 ${iconColors.yellow}`} />
              {event.highlights.length} Highlights
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
