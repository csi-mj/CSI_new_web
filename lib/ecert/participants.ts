/**
 * "Load from event participants" — reuses the existing participants API the
 * events admin section already uses (same endpoint, same shapes), so this
 * feature reads the same data the team manages day-to-day.
 */
import type { ParsedRow } from './normalize';

export interface EventParticipantLike {
  id: string;
  user_name?: string | null;
  user_email?: string | null;
  registration_status?: string | null;
  is_attended?: boolean | null;
  additional_info?: Record<string, unknown> | null;
}

/** Confirmed (and attended) participants of one event, shaped as recipient rows. */
export function participantsToRecipientRows(
  participants: EventParticipantLike[]
): ParsedRow[] {
  return participants
    .filter((p) => p.user_email)
    .map((p, i) => {
      const row_data: Record<string, string> = {
        ...(p.additional_info ?? {}),
        // canonical keys so variables bind the same way as sheet flows
        participant_name: p.user_name ?? '',
        participant_email: p.user_email ?? ''
      };
      if (p.is_attended) row_data.participant_attended = 'Yes';
      return {
        row_index: i + 1,
        name: p.user_name ?? p.user_email!.split('@')[0],
        email: String(p.user_email),
        row_data
      };
    });
}

export async function fetchEventParticipants(eventId: string): Promise<EventParticipantLike[]> {
  const res = await fetch(`/api/admin/events/${eventId}/participants`);
  if (!res.ok) throw new Error(`Could not load event participants (HTTP ${res.status})`);
  const json = await res.json();
  const list = json?.data?.participants ?? [];
  // Confirmed only — that's who should actually receive certificates
  return list.filter((p: EventParticipantLike) => p.registration_status === 'confirmed');
}