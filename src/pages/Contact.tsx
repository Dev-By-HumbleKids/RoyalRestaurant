import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { QuarterMap } from '@/components/contact/QuarterMap';
import { Field, Input, Select, Textarea } from '@/components/reservation/DetailsStep';
import { Button, ButtonLink } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/data/site';
import { renderLines, useI18n } from '@/i18n';
import { sleep } from '@/lib/utils';
import { Reveal } from '@/motion/Reveal';
import { ease } from '@/motion/tokens';
import { generateReference } from '@/services/reference';

const EVENT_TYPES = ['Private dinner', 'Celebration', 'Corporate dinner', 'Wedding reception', 'Full buy-out'] as const;
const ROOMS = ['Salon Noir (up to 12)', 'Cellar Room (up to 10)', 'Full buy-out (up to 90)', 'Not sure yet'] as const;
const BUDGETS = ['Ks 7.2M – 15M', 'Ks 15M – 30M', 'Ks 30M – 75M', 'Ks 75M+'] as const;

const today = format(new Date(), 'yyyy-MM-dd');

// Messages are dictionary keys (t.validation.*); `Field` translates them for display.
const inquirySchema = z.object({
  name: z.string().trim().min(2, 'inquiryName'),
  email: z.string().trim().email('email'),
  phone: z.string().trim().regex(/^\+?[0-9\s().-]{7,20}$/, 'inquiryPhone'),
  eventType: z.enum(EVENT_TYPES, { errorMap: () => ({ message: 'occasion' }) }),
  date: z
    .string()
    .min(1, 'date')
    .refine((d) => d >= today, 'dateFuture'),
  guests: z.coerce.number({ invalid_type_error: 'number' }).int().min(9, 'guestsMin').max(90, 'guestsMax'),
  room: z.enum(ROOMS),
  budget: z.enum(BUDGETS),
  message: z.string().max(800, 'max800'),
});
type Inquiry = z.infer<typeof inquirySchema>;

function InquiryForm() {
  const { t } = useI18n();
  const f = t.contact.form;
  const [sent, setSent] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inquiry>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { room: 'Not sure yet', budget: 'Ks 15M – 30M', message: '', guests: 12 } as Partial<Inquiry>,
    mode: 'onTouched',
  });

  const submit = handleSubmit(
    async () => {
      await sleep(900);
      setSent(generateReference().replace('RYL', 'INQ'));
    },
    () => requestAnimationFrame(() => document.querySelector<HTMLElement>('#inquiry [aria-invalid="true"]')?.focus()),
  );

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease }}
          className="border border-line/25 bg-espresso p-8 sm:p-10"
        >
          <p className="eyebrow">{t.contact.sent.received(sent)}</p>
          <h3 className="display-md mt-4 text-ivory">{t.contact.sent.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {t.contact.sent.bodyBefore}
            <strong className="text-fg">{t.contact.sent.bodyStrong}</strong>
            {t.contact.sent.bodyAfter}
          </p>
          <Button
            variant="outline"
            className="mt-8"
            onClick={() => {
              reset();
              setSent(null);
            }}
          >
            {t.contact.sent.another}
          </Button>
        </motion.div>
      ) : (
        <motion.form key="form" id="inquiry" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-8 sm:grid-cols-2">
          <Field label={f.name} required error={errors.name?.message}>
            {({ id, describedBy }) => <Input id={id} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={describedBy} {...register('name')} />}
          </Field>
          <Field label={f.email} required error={errors.email?.message}>
            {({ id, describedBy }) => <Input id={id} type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describedBy} {...register('email')} />}
          </Field>
          <Field label={f.phone} required error={errors.phone?.message}>
            {({ id, describedBy }) => <Input id={id} type="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={describedBy} {...register('phone')} />}
          </Field>
          <Field label={f.occasion} required error={errors.eventType?.message}>
            {({ id, describedBy }) => (
              <Select id={id} aria-invalid={!!errors.eventType} aria-describedby={describedBy} defaultValue="" {...register('eventType')}>
                <option value="" disabled>
                  {f.choose}
                </option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t.contact.eventTypes[type]}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label={f.date} required error={errors.date?.message}>
            {({ id, describedBy }) => (
              <Input id={id} type="date" min={today} aria-invalid={!!errors.date} aria-describedby={describedBy} className="[color-scheme:dark]" {...register('date')} />
            )}
          </Field>
          <Field label={f.guests} required error={errors.guests?.message} hint={f.guestsHint}>
            {({ id, describedBy }) => (
              <Input id={id} type="number" inputMode="numeric" min={9} max={90} aria-invalid={!!errors.guests} aria-describedby={describedBy} {...register('guests')} />
            )}
          </Field>
          <Field label={f.room} required>
            {({ id }) => (
              <Select id={id} {...register('room')}>
                {ROOMS.map((r) => (
                  <option key={r} value={r}>
                    {t.contact.rooms[r]}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label={f.budget} required>
            {({ id }) => (
              <Select id={id} {...register('budget')}>
                {BUDGETS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </Select>
            )}
          </Field>
          <Field label={f.message} error={errors.message?.message} className="sm:col-span-2">
            {({ id, describedBy }) => <Textarea id={id} aria-invalid={!!errors.message} aria-describedby={describedBy} {...register('message')} />}
          </Field>
          <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
            <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} icon={!isSubmitting}>
              {isSubmitting ? f.sending : f.send}
            </Button>
            <p className="text-xs text-muted">{f.note}</p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export default function Contact() {
  const { t, c } = useI18n();
  const ct = t.contact;

  return (
    <>
      <PageHero image="i-bar-warm" eyebrow={ct.hero.eyebrow} lines={renderLines(ct.hero.lines)} lede={ct.hero.lede} />

      <section className="section-y bg-obsidian" aria-labelledby="visit-title">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="visit-title" eyebrow={ct.visit.eyebrow} lines={renderLines(ct.visit.lines)} size="md" />
            <Reveal delay={0.1}>
              <address className="mt-10 space-y-1 font-display text-2xl not-italic text-ivory">
                <p>{c.site.address.line1}</p>
                <p>
                  {c.site.address.line2}, {c.site.address.city}
                </p>
              </address>
              <dl className="mt-10 divide-y divide-line/15 border-y border-line/15 text-sm">
                {c.site.hours.map((h) => (
                  <div key={h.days} className="grid gap-1 py-4 sm:grid-cols-[160px_1fr]">
                    <dt className="text-muted">{h.days}</dt>
                    <dd className="text-ivory">{h.times}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href={site.phoneHref} className="inline-flex min-h-[48px] items-center gap-3 border border-line/30 px-5 text-sm transition-colors hover:border-accent">
                  <Phone className="h-4 w-4 text-accent" aria-hidden /> {site.phone}
                </a>
                <a href={`mailto:${site.email}`} className="inline-flex min-h-[48px] items-center gap-3 border border-line/30 px-5 text-sm transition-colors hover:border-accent">
                  <Mail className="h-4 w-4 text-accent" aria-hidden /> {site.email}
                </a>
              </div>
              <ButtonLink to="/reservations" icon className="mt-6">
                {t.common.reserveTable}
              </ButtonLink>
              <p className="mt-8 text-xs leading-relaxed text-muted">{ct.dress}</p>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7" delay={0.15}>
            <QuarterMap />
          </Reveal>
        </div>
      </section>

      <section id="private-dining" className="section-y scroll-mt-10 bg-espresso" aria-labelledby="pd-title">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="pd-title" eyebrow={ct.pd.eyebrow} lines={renderLines(ct.pd.lines)} lede={ct.pd.lede} size="md" />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <InquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
