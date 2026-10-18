import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Confirmation } from '@/components/reservation/Confirmation';
import { DetailsStep } from '@/components/reservation/DetailsStep';
import { Stepper } from '@/components/reservation/Stepper';
import { DateStep, StepTitle, TableStep, TimeStep } from '@/components/reservation/steps';
import { Button } from '@/components/ui/Button';
import { site } from '@/data/site';
import { tableById } from '@/data/tables';
import { errorText, useI18n, type Content } from '@/i18n';
import { ease } from '@/motion/tokens';
import { reservationService, SlotUnavailableError } from '@/services';
import { useReservation, type Step } from '@/store/reservationStore';
import { useWishlist } from '@/store/wishlistStore';
import type { DiningArea } from '@/types';

const FORM_ID = 'details-form';

export default function Reservations() {
  const store = useReservation();
  const { step, partySize, date, time, area, tableId, details, confirmed } = store;
  const wishIds = useWishlist((s) => s.ids);
  const { t, c, fmt } = useI18n();
  const r = t.reservations;
  const [submitting, setSubmitting] = useState(false);
  // Keep the error itself (a code), so its text follows a language switch.
  const [error, setError] = useState<{ err: unknown; alternatives?: string[] } | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const maxReached = !date ? 0 : !time ? 1 : !details.name ? 3 : 4;
  const canContinue = [!!date, !!time, true, true, true][step];

  // Bring the new step into view and move focus to its heading for screen-reader users.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const y = (top.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 100;
    if (window.scrollY > y) window.scrollTo({ top: y, behavior: 'smooth' });
    const timer = setTimeout(() => document.querySelector<HTMLElement>('[data-step-heading]')?.focus({ preventScroll: true }), 450);
    return () => clearTimeout(timer);
  }, [step, confirmed]);

  const go = (s: Step) => {
    setError(null);
    store.setStep(s);
  };
  const next = () => step < 4 && go((step + 1) as Step);
  const back = () => step > 0 && go((step - 1) as Step);

  const submit = async () => {
    if (submitting || !date || !time) return;
    setSubmitting(true);
    setError(null);
    try {
      // Dish names are the same in both languages, so the kitchen note is stable.
      const wishlist = details.attachWishlist ? wishIds.map((id) => c.menuById.get(id)?.name ?? id) : undefined;
      const reservation = await reservationService.createReservation({
        date,
        time,
        partySize,
        area: area ?? undefined,
        tableId: tableId ?? undefined,
        guest: { name: details.name.trim(), email: details.email.trim(), phone: details.phone.trim() },
        occasion: details.occasion || undefined,
        dietary: details.dietary || undefined,
        requests: details.requests || undefined,
        wishlist: wishlist?.length ? wishlist : undefined,
      });
      store.confirm(reservation);
    } catch (e) {
      setError({ err: e, alternatives: e instanceof SlotUnavailableError ? e.alternatives : undefined });
    } finally {
      setSubmitting(false);
    }
  };

  const chooseAlternative = (slot: string) => {
    store.setTime(slot);
    go(2);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-obsidian pb-10 pt-36 md:pt-44">
        <div aria-hidden className="deco-fan pointer-events-none absolute -top-40 right-[-10%] h-[620px] w-[900px] rotate-180 opacity-40" />
        <div className="container-x relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <motion.p className="eyebrow mb-6 flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <span aria-hidden className="h-px w-10 bg-accent/60" />
              {r.eyebrow}
            </motion.p>
            <motion.h1 className="display-xl text-ivory" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.2 }}>
              {r.title[0]}
              <em className="text-champagne">{r.title[1]}</em>
            </motion.h1>
          </div>
          <div className="max-w-sm space-y-3 text-sm text-muted">
            <p className="flex gap-3 border-l-2 border-champagne/60 pl-4">{r.demoNote}</p>
            <p>
              {r.already}{' '}
              <Link to="/reservations/manage" className="link-underline text-accent">
                {r.manageLink}
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-obsidian pb-28" aria-label={r.formAria}>
        <div ref={top} className="container-x">
          {confirmed ? (
            <div className="border-t border-line/15 pt-16">
              <Confirmation reservation={confirmed} onNew={() => store.reset()} />
            </div>
          ) : (
            <>
              <div className="border-y border-line/15 py-6">
                <Stepper step={step} maxReached={maxReached} onStep={go} />
              </div>

              <div className="mt-12 grid gap-12 lg:grid-cols-12">
                <div className="min-w-0 lg:col-span-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.45, ease }}
                    >
                      {step === 0 && <DateStep />}
                      {step === 1 && <TimeStep />}
                      {step === 2 && <TableStep />}
                      {step === 3 && <DetailsStep formId={FORM_ID} onValid={next} />}
                      {step === 4 && <Review onEdit={go} />}
                    </motion.div>
                  </AnimatePresence>

                  {error && (
                    <div role="alert" className="mt-8 border border-status-full/50 bg-status-full/10 p-5">
                      <p className="flex items-start gap-3 text-sm text-ivory">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-status-full" aria-hidden />
                        {errorText(t, error.err)}
                      </p>
                      {error.alternatives && error.alternatives.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 pl-7">
                          <span className="text-xs text-muted">{r.nearby}</span>
                          {error.alternatives.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => chooseAlternative(slot)}
                              className="min-h-[40px] border border-champagne/60 px-4 text-sm text-champagne tabular hover:bg-champagne hover:text-obsidian"
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-12 flex items-center justify-between gap-4 border-t border-line/15 pt-8">
                    <Button variant="ghost" onClick={back} disabled={step === 0} className="!px-0">
                      <ArrowLeft className="relative h-4 w-4" aria-hidden />
                      {t.common.back}
                    </Button>
                    {step < 3 && (
                      <Button onClick={next} disabled={!canContinue} icon>
                        {r.continueTo(r.steps[step + 1])}
                      </Button>
                    )}
                    {step === 3 && (
                      <Button type="submit" form={FORM_ID} icon>
                        {r.reviewRequest}
                      </Button>
                    )}
                    {step === 4 && (
                      <Button onClick={submit} disabled={submitting} aria-busy={submitting} icon={!submitting}>
                        {submitting ? (
                          <span className="flex items-center gap-3">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-obsidian/30 border-t-obsidian" aria-hidden />
                            {r.sending}
                          </span>
                        ) : (
                          r.send
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <aside className="lg:col-span-4" aria-label={r.yourEvening}>
                  <div className="sticky top-28 border border-line/20 bg-espresso p-6">
                    <p className="eyebrow mb-5">{r.yourEvening}</p>
                    <dl className="divide-y divide-line/10 text-sm">
                      <SummaryRow label={r.summary.guests} value={t.common.guests(partySize)} onEdit={() => go(0)} />
                      <SummaryRow label={r.summary.date} value={date ? fmt.shortWeekdayMonth(date) : '—'} onEdit={() => go(0)} />
                      <SummaryRow label={r.summary.time} value={time ?? '—'} onEdit={date ? () => go(1) : undefined} />
                      <SummaryRow
                        label={r.summary.seating}
                        value={area ? seatingLabel(c, area, tableId) : time ? r.summary.noPreference : '—'}
                        onEdit={time ? () => go(2) : undefined}
                      />
                    </dl>
                    <div className="mt-6 space-y-2 border-t border-line/15 pt-5 text-xs leading-relaxed text-muted">
                      <p>{r.held}</p>
                      <p>
                        {r.questions} {site.phone} · {site.email}
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function seatingLabel(c: Content, area: DiningArea, tableId: string | null) {
  const short = c.area(area).short;
  const label = tableId ? tableById.get(tableId)?.label : undefined;
  if (!label) return short;
  return label.startsWith(short) ? label : `${short} · ${label}`;
}

function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-muted">{label}</dt>
      <dd className="flex items-center gap-3 text-right text-ivory">
        {value}
        {onEdit && value !== '—' && (
          <button type="button" onClick={onEdit} className="link-underline text-[10px] uppercase tracking-[0.16em] text-accent">
            {t.common.edit}
            <span className="sr-only"> {label}</span>
          </button>
        )}
      </dd>
    </div>
  );
}

function Review({ onEdit }: { onEdit: (s: Step) => void }) {
  const { partySize, date, time, area, tableId, details } = useReservation();
  const wishIds = useWishlist((s) => s.ids);
  const { t, c, fmt } = useI18n();
  const rv = t.reservations.review;
  if (!date || !time) return null;
  const rows: [string, string, Step][] = [
    [rv.when, rv.whenValue(fmt.longDate(date), time), 0],
    [rv.guests, String(partySize), 0],
    [rv.seating, area ? `${c.area(area).label}${tableId ? ` · ${tableById.get(tableId)?.label}` : ''}` : rv.noPref, 2],
    [rv.name, details.name, 3],
    [rv.email, details.email, 3],
    [rv.phone, details.phone, 3],
  ];
  if (details.occasion) rows.push([rv.occasion, t.reservations.occasions[details.occasion] ?? details.occasion, 3]);
  if (details.dietary) rows.push([rv.dietary, details.dietary, 3]);
  if (details.requests) rows.push([rv.requests, details.requests, 3]);
  if (details.attachWishlist && wishIds.length) rows.push([rv.myEvening, wishIds.map((id) => c.menuById.get(id)?.name).join(', '), 3]);

  return (
    <div>
      <StepTitle n={5} title={rv.title} hint={rv.hint} />
      <dl className="divide-y divide-line/15 border-y border-line/15">
        {rows.map(([k, v, s]) => (
          <div key={k} className="grid gap-1 py-4 sm:grid-cols-[160px_1fr_auto] sm:items-baseline sm:gap-6">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{k}</dt>
            <dd className="break-words text-ivory">{v}</dd>
            <dd>
              <button type="button" onClick={() => onEdit(s)} className="link-underline text-[10px] uppercase tracking-[0.16em] text-accent">
                {t.common.edit}
                <span className="sr-only"> {k}</span>
              </button>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-xs leading-relaxed text-muted">{rv.consent}</p>
    </div>
  );
}
