'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { Recruitment } from '@/lib/types/recruitments';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: Recruitment | null;
  onSchedule: (id: string, time: string, venue: string) => void;
  isScheduling: boolean;
}

export function ScheduleModal({
  isOpen,
  onClose,
  applicant,
  onSchedule,
  isScheduling
}: ScheduleModalProps) {
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('Room 304, Main Block');

  useEffect(() => {
    if (applicant) {
      if (applicant.interview_time) {
        // datetime-local input requires YYYY-MM-DDThh:mm format
        const date = new Date(applicant.interview_time);
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0,16);
        setTime(localISOTime);
      } else {
        setTime('');
      }
      
      if (applicant.interview_venue) {
        setVenue(applicant.interview_venue);
      } else {
        setVenue('Room 304, Main Block');
      }
    }
  }, [applicant]);

  if (!applicant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time || !venue) return;

    // Convert local datetime-local string to ISO string for backend
    const isoTime = new Date(time).toISOString();
    onSchedule(applicant.id, isoTime, venue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            This will automatically send an email to{' '}
            <strong>{applicant.name}</strong> ({applicant.email}) with these
            details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="datetime">Date & Time</Label>
            <Input
              id="datetime"
              type="datetime-local"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue / Meeting Link</Label>
            <Input
              id="venue"
              type="text"
              required
              placeholder="e.g. Room 304 or Google Meet link"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isScheduling}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isScheduling || !time || !venue}>
              {isScheduling ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Email...
                </span>
              ) : (
                'Schedule & Send Email'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
