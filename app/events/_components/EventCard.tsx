"use client";

import type { Event, UpcomingEvent, OngoingEvent, CompletedEvent } from "@/lib/types/events";
import React from "react";

function formatDate(iso?: string | null) {
  if (!iso) return "TBA";
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
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return "";
  }
}

export default function EventCard({ event, reverse = false }: { event: Event; reverse?: boolean }) {
  const isUpcoming = event.status === "upcoming";
  const isOngoing = event.status === "ongoing";
  const isCompleted = event.status === "completed";

  const upcoming = event as UpcomingEvent;
  const ongoing = event as OngoingEvent;
  const completed = event as CompletedEvent;

  return (
    <article id='cur' className={`group cursor-target relative flex flex-col md:flex-row ${reverse ? "md:flex-row-reverse" : ""} bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300 shadow-sm hover:shadow-md`}>

      {/* Image Section (Left) */}
      <div className="md:w-[45%] relative overflow-hidden min-h-[200px] md:min-h-full">
        <img
          src={event.poster_url ?? "/default-poster.png"}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-zinc-950/10"></div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {isOngoing && (
            <span className="bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm backdrop-blur-md">
              Live
            </span>
          )}
        </div>
      </div>

      {/* Content Section (Right) */}
      <div className="md:w-[55%] p-4 sm:p-5 flex flex-col space-y-3">

        <div>
          {/* Header: Date & Category */}
          <div className="flex items-center gap-3 text-xs text-zinc-500 mb-2">
            <span className="font-mono text-zinc-400 flex items-center gap-1.5">
              <span className="text-zinc-600">🗓</span>
              {formatDate(event.event_date)}
            </span>
            {event.category && (
              <span className="text-red-500/90 font-bold uppercase tracking-wider text-[10px] border border-red-500/20 px-1.5 py-px rounded">
                {event.category}
              </span>
            )}
          </div>

          {/* Title & Subtitle */}
          <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-red-500 transition-colors mb-1.5">
            {event.title}
          </h3>
          {/* {event.subtitle && (
            <p className="text-sm text-zinc-400 italic font-serif">
              {event.subtitle}
            </p>
          )} */}
        </div>

        {/* Time & Venue Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-zinc-900/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-sm">📍</div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-zinc-600 font-bold tracking-wider">Venue</span>
              <span className="text-xs text-zinc-300 font-medium max-w-[120px]">{event.venue ?? "TBA"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-sm">🕒</div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-zinc-600 font-bold tracking-wider">Time</span>
              <span className="text-xs text-zinc-300 font-medium">
                {event.time_range ? event.time_range : formatTime(event.event_date)}
              </span>
            </div>
          </div>
        </div>

        {/* Full Description */}
        {event.description && (
          <div className="text-zinc-400 text-sm">
            <p>{event.description}</p>
          </div>
        )}

        {/* Highlights */}
        {event.highlights && event.highlights.length > 0 && (
          <div className="bg-zinc-900/30 rounded-lg p-3 border border-zinc-900 mt-2">
            <h5 className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>✨</span> Highlights
            </h5>
            <ul className="grid grid-cols-1 gap-1.5">
              {event.highlights.map((item, idx) => (
                <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                  <div className="min-w-[4px] h-[4px] rounded-full bg-red-500 mt-1.5 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 mt-auto">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 px-2 py-0.5 rounded-full border border-zinc-900 bg-zinc-950/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

      </div>
    </article>
  );
}
