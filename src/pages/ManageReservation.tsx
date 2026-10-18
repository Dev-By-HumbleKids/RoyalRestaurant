import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CalendarPlus, Minus, Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Field, Input, Select } from '@/components/reservation/DetailsStep';
import { Button, ButtonLink } from '@/components/ui/Button';
import { tableById } from '@/data/tables';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { errorText, useI18n } from '@/i18n';
import { cn, maskEmail } from '@/lib/utils';
import { ease } from '@/motion/tokens';
import { reservationService, SlotUnavailableError } from '@/services';
import { dayClosedReason, slotsForDate, toKey } from '@/services/availability';
import { downloadIcs } from '@/services/ics';
import { RULES } from '@/services/rules';
import type { Reservation, ReservationStatus } from '@/types';

// Messages are dictionary keys (t.validation.*); `Field` translates them for display.
const lookupSchema = z.object({
  reference: z
    .string()
    .trim()
    .regex(/^RYL-[A-Z0-9]{4}$/i, 'reference'),
  email: z.string().trim().email('emailUsed'),
});
type Lookup = z.infer<typeof lookupSchema>;

const statusStyle: Record<ReservationStatus, string> = {
  requested: 'border-status-available/50 text-status-available',
  modified: 'border-status-limited/50 text-status-limited',
  cancelled: 'border-status-full/50 text-status-full',
};

export default function ManageReservation() {
  const [params] = useSearchParams();
  const { t } = useI18n();
  const m = t.manage;
  const [found, setFound] = useState<{ r: Reservation; email: string } | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Lookup>({ resolver: zodResolver(lookupSchema), defaultValues: { reference: params.get('ref') ?? '', email: '' } });

  const onLookup = handleSubmit(async ({ reference, email }) => {
    setLoading(true);
    setError(null);
    try {
      const r = await reservationService.findReservation(reference, email);
      setFound({ r, email });
    } catch (e) {
      setError(e);
      setFound(null);
    } finally {
      setLoading(false);
    }
  });

  return (
    <>
      <section className="bg-obsidian pb-12 pt-36 md:pt-44">
        <div className="container-x">
          <p className="eyebrow mb-6 flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-accent/60" />
            {m.eyebrow}
          </p>
          <motion.h1 className="display-xl text-ivory" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>
            {m.title[0]}
            <em className="text-champagne">{m.title[1]}</em>
          </motion.h1>
          <p className="lede mt-6 max-w-xl">{m.lede}</p>
        </div>
      </section>

      <section className="bg-obsidian pb-28">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12">
          <form onSubmit={onLookup} noValidate className="space-y-8 border-t border-line/15 pt-10 lg:col-span-4" aria-label={m.findAria}>
            <Field label={m.reference} required error={errors.reference?.message} hint={m.referenceHint}>
              {({ id, describedBy }) => (
                <Input id={id} autoCapitalize="characters" aria-invalid={!!errors.reference} aria-describedby={describedBy} className="uppercase tracking-[0.1em]" {...register('reference')} />
              )}
            </Field>
            <Field label={m.email} required error={errors.email?.message}>
              {({ id, describedBy }) => <Input id={id} type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describedBy} {...register('email')} />}
            </Field>
            <Button type="submit" disabled={loading} aria-busy={loading} icon={!loading} className="w-full">
              {loading ? m.searching : m.find}
            </Button>
            {error !== null && (
              <p role="alert" className="flex gap-3 border border-status-full/40 p-4 text-sm text-fg/85">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-status-full" aria-hidden />
                {errorText(t, error)}
              </p>
            )}
          </form>

          <div className="lg:col-span-7 lg:col-start-6" aria-live="polite">
            <AnimatePresence mode="wait">
              {found ? (
                <ReservationCard key={found.r.reference} reservation={found.r} email={found.email} onChange={(r) => setFound({ r, email: found.email })} />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-[320px] flex-col items-center justify-center border border-dashed border-line/20 p-10 text-center"
                >
                  <p className="font-display text-3xl font-light text-ivory">{m.emptyTitle}</p>
                  <p className="mt-3 max-w-sm text-sm text-muted">{m.emptyBody}</p>
                  <ButtonLink to="/reservations" variant="outline" icon className="mt-8">
                    {m.reserve}
                  </ButtonLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}

type Message = { tone: 'ok' } | { tone: 'error'; err: unknown; alternatives?: string[] };

function ReservationCard({ reservation: r, email, onChange }: { reservation: Reservation; email: string; onChange: (r: Reservation) => void }) {
  const { t, c, fmt } = useI18n();
  const m = t.manage;
  const [editing, setEditing] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [draft, setDraft] = useState({ date: r.date, time: r.time, partySize: r.partySize });
  const cancelled = r.status === 'cancelled';
  const table = tableById.get(r.tableId);
  const short = c.area(r.area).short;

  const dateOptions = Array.from({ length: RULES.maxDaysAhead + 1 }, (_, i) => toKey(addDays(new Date(), i))).filter((d) => !dayClosedReason(d));
  const timeOptions = slotsForDate(draft.date).map((s) => s.time);

  const save = async (patch = draft) => {
    setBusy(true);
    setMessage(null);
    try {
      const updated = await reservationService.updateReservation(r.reference, email, patch);
      onChange(updated);
      setEditing(false);
      setMessage({ tone: 'ok' });
    } catch (e) {
      setMessage({ tone: 'error', err: e, alternatives: e instanceof SlotUnavailableError ? e.alternatives : undefined });
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    setBusy(true);
    try {
      onChange(await reservationService.cancelReservation(r.reference, email));
      setConfirmCancel(false);
    } catch (e) {
      setMessage({ tone: 'error', err: e });
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }} className="border border-line/20 bg-espresso">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line/15 p-6 sm:p-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{m.reference}</p>
          <p className="font-display text-3xl tracking-[0.08em] text-champagne">{r.reference}</p>
        </div>
        <span className={cn('border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]', statusStyle[r.status])}>{m.status[r.status]}</span>
      </header>

      <dl className="grid grid-cols-2 gap-px bg-line/15 sm:grid-cols-3">
        {[
          [m.fields.date, fmt.shortDate(r.date)],
          [m.fields.time, r.time],
          [m.fields.guests, String(r.partySize)],
          [m.fields.seating, table?.label.startsWith(short) ? table.label : `${short} · ${table?.label ?? ''}`],
          [m.fields.guest, r.guest.name],
          [m.fields.email, maskEmail(r.guest.email)],
        ].map(([k, v]) => (
          <div key={k} className="bg-espresso p-5">
            <dt className="text-[11px] uppercase tracking-[0.18em] text-muted">{k}</dt>
            <dd className={cn('mt-1 break-words text-ivory [overflow-wrap:anywhere]', cancelled && 'line-through decoration-status-full/60')}>{v}</dd>
          </div>
        ))}
      </dl>

      {message && (
        <div
          role={message.tone === 'error' ? 'alert' : 'status'}
          className={cn('mx-6 mt-6 border p-4 text-sm sm:mx-8', message.tone === 'ok' ? 'border-status-available/40' : 'border-status-full/40')}
        >
          {message.tone === 'ok' ? m.updated : errorText(t, message.err)}
          {message.tone === 'error' && message.alternatives && message.alternatives.length > 0 && (
            <span className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted">{m.try}</span>
              {message.alternatives.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, time: slot }))}
                  className="min-h-[36px] border border-champagne/60 px-3 text-champagne tabular hover:bg-champagne hover:text-obsidian"
                >
                  {slot}
                </button>
              ))}
            </span>
          )}
        </div>
      )}

      <AnimatePresence initial={false}>
        {editing && !cancelled && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="overflow-hidden"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
            aria-label={m.changeAria}
          >
            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3 sm:p-8">
              <Field label={m.fields.date} required>
                {({ id }) => (
                  <Select
                    id={id}
                    value={draft.date}
                    onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value, time: slotsForDate(e.target.value).some((s) => s.time === d.time) ? d.time : '19:00' }))}
                  >
                    {dateOptions.map((d) => (
                      <option key={d} value={d}>
                        {fmt.shortDateNoYear(d)}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field label={m.fields.time} required>
                {({ id }) => (
                  <Select id={id} value={draft.time} onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))}>
                    {timeOptions.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{m.fields.guests}</span>
                <div className="mt-2 flex items-center">
                  <button
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, partySize: Math.max(1, d.partySize - 1) }))}
                    className="grid h-11 w-11 place-items-center border border-line/30"
                    aria-label={t.reservations.date.fewer}
                  >
                    <Minus className="h-4 w-4" aria-hidden />
                  </button>
                  <output className="w-12 text-center font-display text-2xl tabular" aria-live="polite">
                    {draft.partySize}
                  </output>
                  <button
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, partySize: Math.min(RULES.maxPartyOnline, d.partySize + 1) }))}
                    className="grid h-11 w-11 place-items-center border border-line/30"
                    aria-label={t.reservations.date.more}
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 px-6 pb-6 sm:px-8 sm:pb-8">
              <Button type="submit" disabled={busy} aria-busy={busy}>
                {busy ? m.checking : m.save}
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)} className="!px-4">
                {m.discard}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {!editing && (
        <div className="flex flex-wrap gap-3 p-6 sm:p-8">
          {!cancelled ? (
            <>
              <Button onClick={() => setEditing(true)} variant="outline">
                {m.change}
              </Button>
              <Button onClick={() => downloadIcs(r)} variant="outline">
                <CalendarPlus className="relative h-4 w-4" aria-hidden />
                {m.calendar}
              </Button>
              <Button onClick={() => setConfirmCancel(true)} variant="ghost" className="!px-4 !text-status-full">
                {m.cancel}
              </Button>
            </>
          ) : (
            <ButtonLink to="/reservations" icon>
              {m.newRes}
            </ButtonLink>
          )}
        </div>
      )}

      <AnimatePresence>
        {confirmCancel && <CancelDialog busy={busy} onConfirm={cancel} onClose={() => setConfirmCancel(false)} reference={r.reference} />}
      </AnimatePresence>
    </motion.article>
  );
}

function CancelDialog({ busy, onConfirm, onClose, reference }: { busy: boolean; onConfirm: () => void; onClose: () => void; reference: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const m = t.manage;
  useFocusTrap(ref, true, onClose);
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4">
      <motion.div className="absolute inset-0 bg-obsidian/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} aria-hidden />
      <motion.div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="cancel-title"
        aria-describedby="cancel-desc"
        className="relative w-full max-w-md border border-line/25 bg-espresso p-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.4, ease }}
      >
        <h2 id="cancel-title" className="display-md text-ivory">
          {m.cancelTitle(reference)}
        </h2>
        <p id="cancel-desc" className="mt-4 text-sm leading-relaxed text-muted">
          {m.cancelBody}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={onConfirm} disabled={busy} className="!bg-status-full !text-obsidian">
            {busy ? m.cancelling : m.yesCancel}
          </Button>
          <Button variant="outline" onClick={onClose} data-autofocus>
            {m.keep}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
