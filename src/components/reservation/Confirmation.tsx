import { motion } from 'framer-motion';
import { CalendarPlus, RotateCcw } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { tableById } from '@/data/tables';
import { useI18n } from '@/i18n';
import { downloadIcs } from '@/services/ics';
import { maskEmail } from '@/lib/utils';
import { ease } from '@/motion/tokens';
import type { Reservation } from '@/types';

const PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const angle = (i / 22) * Math.PI * 2;
  const dist = 120 + (i % 4) * 34;
  return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist * 0.7, size: 3 + (i % 3) * 2, delay: (i % 5) * 0.03 };
});


/** The cinematic close of the flow: champagne burst, reference, QR (reference only — no personal data). */
export function Confirmation({ reservation, onNew }: { reservation: Reservation; onNew: () => void }) {
  const [qr, setQr] = useState<string | null>(null);
  const { t, c, fmt } = useI18n();
  const cf = t.reservations.confirm;
  const r = reservation;
  const short = c.area(r.area).short;
  const table = tableById.get(r.tableId);

  useEffect(() => {
    QRCode.toDataURL(r.reference, { margin: 1, width: 240, color: { dark: '#11110F', light: '#F4EFE6' } }).then(setQr, () => setQr(null));
  }, [r.reference]);

  return (
    <div className="relative" role="status" aria-live="polite">
      <div className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2" aria-hidden>
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute block rounded-full bg-champagne"
            style={{ width: p.size, height: p.size }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: [0, 1, 0.6] }}
            transition={{ duration: 1.6, ease, delay: 0.25 + p.delay }}
          />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="text-center">
        <svg viewBox="0 0 120 150" className="mx-auto h-28 w-24 text-champagne" aria-hidden>
          <motion.path d="M8 148V60a52 52 0 0 1 104 0v88" fill="none" stroke="currentColor" strokeWidth="1.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease }} />
          <motion.path d="M40 92l14 14 28-30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease, delay: 0.9 }} />
        </svg>
        <p className="eyebrow mt-6">{cf.received}</p>
        <h2 className="display-lg mt-4 text-ivory" tabIndex={-1} data-step-heading>
          {cf.title(r.guest.name.split(' ')[0])}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted">
          {cf.bodyBefore}
          <strong className="font-semibold text-fg">{cf.bodyStrong}</strong>
          {cf.bodyAfter}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.3 }}
        className="mx-auto mt-12 grid max-w-3xl overflow-hidden border border-line/25 bg-espresso sm:grid-cols-[1fr_220px]"
      >
        <dl className="grid grid-cols-2 gap-px bg-line/15">
          {[
            [cf.reference, r.reference],
            [cf.status, cf.statusValue],
            [cf.date, fmt.shortDate(r.date)],
            [cf.time, r.time],
            [cf.guests, String(r.partySize)],
            [cf.seating, table && table.label.startsWith(short) ? table.label : `${short}${table ? ` · ${table.label}` : ''}`],
          ].map(([k, v]) => (
            <div key={k} className="bg-espresso p-5">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-muted">{k}</dt>
              <dd className={k === cf.reference ? 'mt-1 font-display text-2xl tracking-[0.08em] text-champagne' : 'mt-1 text-ivory'}>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col items-center justify-center gap-3 border-t border-line/15 p-6 sm:border-l sm:border-t-0">
          {qr ? <img src={qr} alt={cf.qrAlt(r.reference)} className="h-36 w-36" /> : <div className="h-36 w-36 animate-pulse bg-charcoal" />}
          <p className="text-center text-[10px] uppercase tracking-[0.18em] text-muted">{cf.qrNote}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-10 flex flex-wrap justify-center gap-3"
      >
        <Button onClick={() => downloadIcs(r)} icon={false}>
          <CalendarPlus className="relative h-4 w-4" aria-hidden />
          {cf.addToCalendar}
        </Button>
        <ButtonLink to={`/reservations/manage?ref=${r.reference}`} variant="outline">
          {cf.manage}
        </ButtonLink>
        <Button variant="ghost" onClick={onNew} className="!px-4">
          <RotateCcw className="relative h-4 w-4" aria-hidden />
          {cf.newRes}
        </Button>
      </motion.div>
      <p className="mt-8 text-center text-xs text-muted">
        {cf.shownFor(maskEmail(r.guest.email), c.address())}
      </p>
    </div>
  );
}
