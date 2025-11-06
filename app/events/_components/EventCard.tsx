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
    <article
      className={`group flex flex-col md:flex-row ${
        reverse ? "md:flex-row-reverse" : ""
      } border border-gray-800 bg-zinc-950 hover:border-gray-700 transition-colors duration-200 rounded-xl sm:rounded-2xl overflow-hidden`}
    >
      {/* Image - No Zoom, Just Grayscale Effect */}
      <div className="md:w-2/5 relative overflow-hidden">
        <img
          src={event.poster_url ?? "/default-poster.png"}
          alt={event.title}
          className="w-full h-56 sm:h-72 md:h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
        />
        
        {/* Status Badge */}
        {isOngoing && (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-red-600 text-white text-xs font-bold uppercase px-3 py-1.5 tracking-wider">
            Live
          </div>
        )}
        {isUpcoming && upcoming.is_registration_open && (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white text-black text-xs font-bold uppercase px-3 py-1.5 tracking-wider">
            Open
          </div>
        )}
        {isCompleted && (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gray-800 text-gray-400 text-xs font-bold uppercase px-3 py-1.5 tracking-wider">
            Ended
          </div>
        )}
      </div>

      {/* Content */}
      <div className="md:w-3/5 p-5 sm:p-8 flex flex-col justify-between">
        <div>
          {/* Category */}
          {event.category && (
            <span className="inline-block text-xs text-red-600 font-semibold uppercase tracking-wider mb-2">
              {event.category}
            </span>
          )}

          {/* Title */}
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight leading-tight">
            {event.title}
          </h3>
          
          {/* Description */}
          {event.description && (
            <p className="text-gray-400 mb-4 sm:mb-6 line-clamp-3 leading-relaxed text-sm sm:text-base">
              {event.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-red-600">●</span>
              <span>{formatDate(event.event_date)} {formatTime(event.event_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-600">●</span>
              <span>{event.venue ?? "TBA"}</span>
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              {event.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-gray-500 border border-gray-800 px-2.5 sm:px-3 py-1 uppercase tracking-wider rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-900">
          {/* Status Info */}
          <div className="text-xs sm:text-sm text-gray-500">
            {isUpcoming && upcoming.is_registration_open && (
              <span className="font-medium text-gray-400">
                {upcoming.spots_remaining ?? "—"} spots remaining
              </span>
            )}
            {isOngoing && ongoing.hours_remaining != null && (
              <span className="font-medium text-red-600">
                {ongoing.hours_remaining}h remaining
              </span>
            )}
            {isCompleted && completed.days_since_completed != null && (
              <span>Ended {completed.days_since_completed} days ago</span>
            )}
            {typeof event.current_participants === "number" && (
              <div className="mt-1">
                {event.current_participants}
                {event.max_participants && `/${event.max_participants}`} registered
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="w-full sm:w-auto">
            {isUpcoming && upcoming.is_registration_open ? (
              <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 font-semibold uppercase text-xs sm:text-sm tracking-wider transition-colors rounded-lg">
                Register
              </button>
            ) : (
              <a
                href={`/events/${event.id}`}
                className="block sm:inline-block text-center w-full sm:w-auto border border-gray-700 hover:border-white text-white px-6 sm:px-8 py-3 font-medium uppercase text-xs sm:text-sm tracking-wider transition-colors rounded-lg"
              >
                Details
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
