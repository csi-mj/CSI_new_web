'use client';

import type {
  Event,
  UpcomingEvent,
  OngoingEvent,
  CompletedEvent
} from '@/lib/types/events';
import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { iconColors } from '@/config/colors';
import { formatEventDateRange, formatEventTimeRange } from '@/lib/utils/date';

export default function EventCard({
  event,
  reverse = false
}: {
  event: Event;
  reverse?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isUpcoming = event.status === 'upcoming';
  const isOngoing = event.status === 'ongoing';
  
  const upcoming = event as UpcomingEvent;
  const ongoing = event as OngoingEvent;

  const isRegistrationOpen = 
    (isUpcoming && upcoming.is_registration_open) || 
    (isOngoing && ongoing.registration_status === 'open');

  const hasHighlights = Boolean(event.highlights && event.highlights.length > 0);

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
              {formatEventDateRange(event.event_date, event.event_end_date)}
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
                {formatEventTimeRange(event.event_date, event.event_end_date, event.time_range)}
              </span>
            </div>
          </div>
        </div>

        {/* Full Description */}
        {event.description && (
          <div className="flex flex-1 flex-col items-start gap-1">
            <p
              className={`text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap ${
                !isExpanded
                  ? hasHighlights
                    ? 'line-clamp-4'
                    : 'line-clamp-none md:line-clamp-10'
                  : ''
              }`}
            >
              {event.description}
            </p>
            {event.description.length > (hasHighlights ? 200 : 400) && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs underline font-bold text-primary hover:underline mt-0.5 cursor-pointer"
              >
                {isExpanded ? 'Read less' : 'Read more'}
              </button>
            )}
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
