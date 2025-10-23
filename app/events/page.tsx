"use client";

import React from 'react';

import { useState } from "react";
import { EventCard } from "./_components/EventCard";
import { EventDetailModal } from "./_components/EventDetailModal";
import { eventsData } from "./data/eventsData";
import { Event } from "./types/event";
import { Input } from "./_components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./_components/ui/select";
import { Search, Filter } from "lucide-react";
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';
import { ThemeProvider } from "./_components/theme-provider";



const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = ["all", ...Array.from(new Set(eventsData.map(event => event.category)))];

  const filteredEvents = eventsData.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

return (
    <ThemeProvider defaultTheme="dark" storageKey="events-theme">
    <div className="min-h-screen relative flex flex-col -mt-[64px] pt-[64px] dark:bg-black/40">
      <ShootingStars className="!fixed inset-0 -z-10" />
      <StarsBackground className="!fixed inset-0 -z-10" />
      {/* Hero Section */}
      <div className="relative flex-1">
        <div className="container mx-auto px-4 h-screen flex items-center justify-center relative">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-glow-pulse">
              Previous Events
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the amazing events organized by Computer Society of India - MJCET Chapter
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto pt-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-transparent border-border/50 focus:border-primary"
                />
              </div>
              <div className="relative md:w-48">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="pl-10 bg-transparent border-border/50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 py-24 min-h-screen">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-muted-foreground">No events found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => setSelectedEvent(event)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
    </ThemeProvider>
  );
};

export default EventsPage;
