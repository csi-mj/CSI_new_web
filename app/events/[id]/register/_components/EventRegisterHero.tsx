import React from 'react';
import { Calendar, MapPin, Ticket, Clock } from 'lucide-react';
import { iconColors } from '@/config/colors';
import type { Event } from '@/lib/types/events';
import { Badge } from '@/components/ui/badge';

export default function EventRegisterHero({ event }: { event: Event }) {
  return (
    <div className="relative flex min-h-[40vh] w-full flex-col justify-end md:min-h-[50vh] -mt-24">
      {/* Background Poster */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${event.poster_url ?? '/default-poster.png'})`
        }}
      />

      {/* Deep Gradient Overlay for text readability */}
      <div className="from-background via-background/80 to-background/20 absolute inset-0 bg-gradient-to-t" />
      <div className="bg-background/80 absolute inset-0" />

      {/* Event Details Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-12 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          
          {/* Left Side: Title & Description (8 columns) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
            <h1 className="text-primary text-4xl leading-tight font-black md:text-5xl lg:text-6xl">
              {event.title}
            </h1>
            
            {event.description && (
              <p className="text-muted-foreground max-w-3xl line-clamp-3 leading-relaxed md:line-clamp-none md:text-lg">
                {event.description}
              </p>
            )}
          </div>

          {/* Right Side: Details Stack (4 columns) */}
          <div className="lg:col-span-5 xl:col-span-4 grid grid-cols-2 gap-3 w-full lg:max-w-md ml-auto">
            
            {/* Date */}
            <div className="text-base md:text-lg lg:text-xl py-3 flex items-center justify-start gap-3 w-full">
              <Calendar className={`h-5 w-5 shrink-0 ${iconColors.blue}`} />
              <span className="font-medium truncate">
                {new Date(event.event_date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>

            {/* Time */}
            <div className="text-base md:text-lg lg:text-xl py-3 flex items-center justify-start gap-3 w-full">
              <Clock className={`h-5 w-5 shrink-0 ${iconColors.orange}`} />
              <span className="font-medium truncate">
                {event.time_range ? event.time_range : (
                  <>
                    {new Date(event.event_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </>
                )}
              </span>
            </div>

            {/* Venue */}
            {event.venue && (
              <div className="text-base md:text-lg lg:text-xl py-3 flex items-center justify-start gap-3 w-full">
                <MapPin className={`h-5 w-5 shrink-0 ${iconColors.rose}`} />
                <span className="font-medium truncate">{event.venue}</span>
              </div>
            )}

            {/* Entry Fee */}
            {event.is_paid && event.entry_fee && (
              <div className="text-base md:text-lg lg:text-xl py-3 flex items-center justify-start gap-3 w-full">
                <Ticket className={`h-5 w-5 shrink-0 ${iconColors.yellow}`} />
                <span className="font-bold truncate">₹{event.entry_fee} Entry</span>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
