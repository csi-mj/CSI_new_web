'use client';

import type {
  Event,
  UpcomingEvent,
  OngoingEvent,
  CompletedEvent
} from '@/lib/types/events';
import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { iconColors } from '@/config/colors';

function formatDate(iso?: string | null) {
  if (!iso) return 'TBA';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
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

export default function EventCard({
  event,
  reverse = false
}: {
  event: Event;
  reverse?: boolean;
}) {

  const isUpcoming = event.status === 'upcoming';
  const isOngoing = event.status === 'ongoing';
  
  const upcoming = event as UpcomingEvent;
  const ongoing = event as OngoingEvent;

  const isRegistrationOpen = 
    (isUpcoming && upcoming.is_registration_open) || 
    (isOngoing && ongoing.registration_status === 'open');

  return (
    <Card
      id="cur"
      className={`group cursor-target relative flex flex-col md:flex-row ${reverse ? 'md:flex-row-reverse' : ''} hover:border-primary/50 gap-0 overflow-hidden rounded-2xl py-0 shadow-sm transition-all duration-300 hover:shadow-md`}
    >
      {/* Image Section (Left) */}
      <div className="relative min-h-[200px] overflow-hidden md:min-h-full md:w-[45%]">
        <img
          src={event.poster_url ?? '/default-poster.png'}
          alt={event.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content Section (Right) */}
      <CardContent className="flex flex-col space-y-3 p-4 pb-4 sm:p-5 sm:pb-5 md:w-[55%]">
        <div>
          {/* Header: Date & Category */}
          <div className="text-muted-foreground mb-2 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-mono">
              <Calendar className={`h-4 w-4 ${iconColors.blue}`} />
              {formatDate(event.event_date)}
            </span>
            {event.category && (
              <span className="text-primary border-primary/20 rounded border px-1.5 py-px text-[10px] font-bold tracking-wider uppercase">
                {event.category}
              </span>
            )}
          </div>

          {/* Title & Subtitle */}
          <h3 className="text-card-foreground mb-1.5 text-2xl leading-tight font-bold">
            {event.title}
          </h3>
        </div>

        {/* Time & Venue Grid */}
        <div className="border-border/50 grid grid-cols-2 gap-3 border-y py-3">
          <div className="flex items-center gap-2">
            <div className={`bg-muted/50 flex h-8 w-8 items-center justify-center rounded-full ${iconColors.rose}`}>
              <MapPin className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Venue
              </span>
              <span className="text-card-foreground max-w-[120px] truncate text-xs font-medium">
                {event.venue ?? 'TBA'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`bg-muted/50 flex h-8 w-8 items-center justify-center rounded-full ${iconColors.orange}`}>
              <Clock className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Time
              </span>
              <span className="text-card-foreground truncate text-xs font-medium">
                {event.time_range
                  ? event.time_range
                  : event.event_end_date
                    ? `${formatTime(event.event_date)} - ${formatTime(event.event_end_date)}`
                    : formatTime(event.event_date)}
              </span>
            </div>
          </div>
        </div>

        {/* Full Description */}
        {event.description && (
          <div className="text-muted-foreground line-clamp-6 text-sm">
            <p>{event.description}</p>
          </div>
        )}

        {/* Highlights */}
        {event.highlights && event.highlights.length > 0 && (
          <div className="bg-muted/50 border-border/50 mt-2 rounded-lg border p-3">
            <h5 className={`mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase ${iconColors.yellow}`}>
              <Sparkles className="h-3 w-3" /> Highlights
            </h5>
            <ul className="grid grid-cols-1 gap-1.5">
              {event.highlights.map((item, idx) => (
                <li
                  key={idx}
                  className="text-card-foreground/80 flex items-start gap-2 text-xs"
                >
                  <div className="bg-primary mt-1.5 h-[4px] min-w-[4px] rounded-full"></div>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 mt-auto">
          {isRegistrationOpen ? (
            <Button size="lg" className="w-full sm:w-auto group/btn" asChild>
              <Link href={`/events/${event.id}/register`}>
                Register Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          ) : (isUpcoming || isOngoing) ? (
            <Button size="lg" variant="secondary" disabled>
              Registration Closed
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
