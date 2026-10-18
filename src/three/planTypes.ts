import type { Space } from '@/data/spaces';
import type { RestaurantTable } from '@/types';

export type TableState = 'free' | 'booked' | 'unsuitable' | 'idle';

export interface PlanTable {
  table: RestaurantTable;
  state: TableState;
}

export interface FloorPlanProps {
  mode: 'select' | 'explore';
  tables: PlanTable[];
  selectedId?: string | null;
  onSelectTable?: (id: string) => void;
  spaces?: Space[];
  activeSpaceId?: string | null;
  onSelectSpace?: (id: string) => void;
}
