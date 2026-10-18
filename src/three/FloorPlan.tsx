import { Box, Map as MapIcon } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMedia';
import { cn } from '@/lib/utils';
import { FloorPlan2D } from './FloorPlan2D';
import type { FloorPlanProps } from './planTypes';

const FloorPlanScene = lazy(() => import('./FloorPlanScene'));

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Chooses the presentation: the lazy-loaded 3D scene on capable desktops, the 2D plan everywhere else.
 * Visitors can switch at any time; the 2D plan is always the keyboard/screen-reader path.
 */
export function FloorPlan(props: FloorPlanProps) {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const [can3D] = useState(webglAvailable);
  const [pref, setPref] = useState<'3d' | '2d' | null>(null);
  const view = pref ?? (fine && !reduced && can3D ? '3d' : '2d');

  return (
    <div className="relative">
      {can3D && (
        // Sits above the plan rather than over it, so it never hides a table or hotspot.
        <div className="mb-3 ml-auto flex w-max border border-line/30 bg-obsidian/80 text-[11px] font-semibold uppercase tracking-[0.14em]" role="group" aria-label="Floor plan view">
          {(
            [
              ['3d', '3D', Box],
              ['2d', 'Plan', MapIcon],
            ] as const
          ).map(([v, label, Icon]) => (
            <button
              key={v}
              type="button"
              onClick={() => setPref(v)}
              aria-pressed={view === v}
              className={cn('flex h-10 items-center gap-2 px-3 transition-colors', view === v ? 'bg-champagne text-obsidian' : 'text-fg/70 hover:text-fg')}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      )}
      {view === '3d' ? (
        <Suspense fallback={<div className="aspect-[4/3] w-full animate-pulse bg-espresso lg:aspect-[16/10]" aria-label="Loading 3D floor plan" />}>
          <FloorPlanScene {...props} />
        </Suspense>
      ) : (
        <div className="border border-line/15 bg-[#14120F] p-3 sm:p-5">
          <FloorPlan2D {...props} />
        </div>
      )}
    </div>
  );
}
