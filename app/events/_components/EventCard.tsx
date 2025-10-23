import { Calendar, Users } from "lucide-react";
import { Badge } from ".//ui/badge";
import { Event } from "../types/event";
import { GlareCard } from "./ui/glare-card";
import Image from "next/image";

interface EventCardProps {
  event: Event;
  onClick: () => void;
  index: number;
}

export const EventCard = ({ event, onClick, index }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div 
      className="group h-full animate-fade-in-up cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={onClick}
    >
      <GlareCard className="flex flex-col">
        {/* Image container */}
        <div className="relative h-48 overflow-hidden">
          <Image 
            src={event.image} 
            alt={event.title}
            width={800}
            height={400}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          <Badge className="absolute top-4 right-4 bg-primary/90 hover:bg-primary text-primary-foreground border-0">
            {event.category}
          </Badge>
        </div>

        {/* Content */}
        <div className="relative p-6 space-y-4 flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-accent" />
            <span>{formatDate(event.date)}</span>
          </div>

          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {event.title}
          </h3>

          <p className="text-muted-foreground line-clamp-2 flex-1">
            {event.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-secondary" />
              <span>{event.attendees} attendees</span>
            </div>
            <span className="text-primary font-medium group-hover:translate-x-1 transition-transform duration-300">
              View Details →
            </span>
          </div>
        </div>
      </GlareCard>
    </div>
  );
};