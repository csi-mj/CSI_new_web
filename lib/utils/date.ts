/**
 * Formats a date range cleanly for events.
 * Handles single-day, multi-day in same month, multi-day across months, and across years.
 * Examples:
 * - Single day: "Oct 21, 2026"
 * - Same month: "Oct 21 – 24, 2026"
 * - Different month: "Oct 30 – Nov 2, 2026"
 * - Different year: "Dec 30, 2026 – Jan 2, 2027"
 */
export function formatEventDateRange(
  startIso?: string | null,
  endIso?: string | null
): string {
  if (!startIso) return 'TBA';
  try {
    const start = new Date(startIso);
    if (isNaN(start.getTime())) return startIso;

    if (!endIso) {
      return start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    const end = new Date(endIso);
    if (isNaN(end.getTime())) {
      return start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    const isSameDay =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate();

    // 1. Single day event
    if (isSameDay) {
      return start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    // 2. Multi-day within same month & year: "Oct 21 – 24, 2026"
    if (
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth()
    ) {
      const month = start.toLocaleDateString('en-US', { month: 'short' });
      return `${month} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
    }

    // 3. Multi-day spanning different months in same year: "Oct 30 – Nov 2, 2026"
    if (start.getFullYear() === end.getFullYear()) {
      const startStr = start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      const endStr = end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      return `${startStr} – ${endStr}, ${start.getFullYear()}`;
    }

    // 4. Multi-day across different years: "Dec 30, 2026 – Jan 2, 2027"
    const startFull = start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const endFull = end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return `${startFull} – ${endFull}`;
  } catch {
    return startIso;
  }
}

/**
 * Formats event time or time range.
 * If start and end dates are on different days (multi-day event), displays start time "onwards"
 * rather than showing confusing same-day end time.
 */
export function formatEventTimeRange(
  startIso?: string | null,
  endIso?: string | null,
  customTimeRange?: string | null
): string {
  if (customTimeRange) return customTimeRange;
  if (!startIso) return '';

  try {
    const start = new Date(startIso);
    if (isNaN(start.getTime())) return '';

    const startTimeStr = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });

    if (!endIso) return startTimeStr;

    const end = new Date(endIso);
    if (isNaN(end.getTime())) return startTimeStr;

    const isSameDay =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate();

    if (isSameDay) {
      const endTimeStr = end.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });
      if (startTimeStr === endTimeStr) return startTimeStr;
      return `${startTimeStr} - ${endTimeStr}`;
    }

    // Multi-day event: End date is on another day
    return `${startTimeStr} onwards`;
  } catch {
    return '';
  }
}
