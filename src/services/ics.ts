import { addMinutes, format, parseISO } from 'date-fns';
import { site } from '@/data/site';
import type { Reservation } from '@/types';
import { RULES } from './rules';

const stamp = (d: Date) => format(d, "yyyyMMdd'T'HHmmss");
const escape = (s: string) => s.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');

/** Builds an RFC 5545 calendar file. Times are written in the restaurant's (fictional) local time. */
export function buildIcs(r: Reservation): string {
  const [h, m] = r.time.split(':').map(Number);
  const start = parseISO(r.date);
  start.setHours(h, m, 0, 0);
  const end = addMinutes(start, RULES.durationMinutes);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ROYAL Portfolio Demo//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${r.reference}@royal.example`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART;TZID=Asia/Yangon:${stamp(start)}`,
    `DTEND;TZID=Asia/Yangon:${stamp(end)}`,
    `SUMMARY:${escape(`ROYAL — table for ${r.partySize} (demo)`)}`,
    `LOCATION:${escape(`${site.address.line1}, ${site.address.line2}, ${site.address.city} (fictional)`)}`,
    `DESCRIPTION:${escape(`Reference ${r.reference}. Portfolio demo — this is not a real reservation.`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}

export function downloadIcs(r: Reservation) {
  const blob = new Blob([buildIcs(r)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `royal-${r.reference}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
