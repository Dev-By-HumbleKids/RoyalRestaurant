import { Ban, CircleCheck, CircleDot, CircleSlash } from 'lucide-react';
import type { SlotStatus } from '@/types';

export const statusMeta: Record<SlotStatus, { label: string; Icon: typeof CircleCheck; color: string; dot: string }> = {
  available: { label: 'Available', Icon: CircleCheck, color: 'text-status-available', dot: 'bg-status-available' },
  limited: { label: 'Limited', Icon: CircleDot, color: 'text-status-limited', dot: 'bg-status-limited' },
  full: { label: 'Fully booked', Icon: Ban, color: 'text-status-full', dot: 'bg-status-full' },
  closed: { label: 'Closed', Icon: CircleSlash, color: 'text-muted', dot: 'bg-muted/40' },
};
