import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Calendar, Users, UserCircle, Sparkles } from "lucide-react";
import { Event } from "../types/event";
import Image from "next/image";

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventDetailModal = ({ event, isOpen, onClose }: EventDetailModalProps) => {
  if (!event) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border/50 animate-scale-in">
        <DialogHeader>
          <div className="relative h-64 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-lg">
            <Image 
              src={event.image} 
              alt={event.title}
              width={1200}
              height={400}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            <Badge className="absolute top-4 right-4 bg-primary/90 text-primary-foreground border-0">
              {event.category}
            </Badge>
          </div>
          <DialogTitle className="text-3xl font-bold text-foreground">
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-5 h-5 text-accent" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5 text-secondary" />
              <span>{event.attendees} attendees</span>
            </div>
          </div>

          {/* Full Description */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">About the Event</h3>
            <p className="text-muted-foreground leading-relaxed">
              {event.fullDescription}
            </p>
          </div>

          {/* Speakers */}
          {event.speakers && event.speakers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-primary" />
                Speakers
              </h3>
              <ul className="space-y-2">
                {event.speakers.map((speaker, index) => (
                  <li key={index} className="text-muted-foreground pl-4 border-l-2 border-primary/30">
                    {speaker}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Event Highlights
              </h3>
              <ul className="space-y-2">
                {event.highlights.map((highlight, index) => (
                  <li key={index} className="text-muted-foreground pl-4 border-l-2 border-accent/30 hover:border-accent/60 transition-colors duration-300">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};