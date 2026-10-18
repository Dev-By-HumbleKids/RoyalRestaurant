import { Box, Map as MapIcon } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { useFinePointer, useMediaQuery, usePrefersReducedMotion } from '@/hooks/useMedia';
import { useI18n } from '@/i18n';
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
 * Chooses the presentation: the lazy-loaded 3D scene on desktops and tablets, the 2D plan on phones (where it
 * reads better at that width). Visitors can switch at any time; the 2D plan is always the keyboard/screen-reader path.
 */
export function FloorPlan(props: FloorPlanProps) {
  const { t } = useI18n();
  const fine = useFinePointer();
  // Tablets, not phones turned sideways: landscape phones are too short for the 3D plan.
  const tablet = useMediaQuery('(pointer: coarse) and (min-width: 768px) and (min-height: 600px)');
  const reduced = usePrefersReducedMotion();
  const [can3D] = useState(webglAvailable);
  const [pref, setPref] = useState<'3d' | '2d' | null>(null);
  const view = pref ?? ((fine || tablet) && !reduced && can3D ? '3d' : '2d');

  return (
    <div className="relative">
      {can3D && (
        // Sits above the plan rather than over it, so it never hides a table or hotspot.
        <div className="mb-3 ml-auto flex w-max border border-line/30 bg-obsidian/80 text-[11px] font-semibold uppercase tracking-[0.14em]" role="group" aria-label={t.plan.viewAria}>
          {(
            [
              ['3d', t.plan.view3d, Box],
              ['2d', t.plan.view2d, MapIcon],
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
        <Suspense fallback={<div className="aspect-[4/3] w-full animate-pulse bg-espresso lg:aspect-[16/10]" aria-label={t.plan.loading} />}>
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
