import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { menuById } from '@/data/menu';
import { cn } from '@/lib/utils';
import { OCCASIONS } from '@/services/rules';
import { useReservation, type DetailsDraft } from '@/store/reservationStore';
import { useWishlist } from '@/store/wishlistStore';
import { detailsSchema } from './schema';
import { StepTitle } from './steps';


// ——— field primitives (shared with the contact and manage forms) ———
interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: (ids: { id: string; describedBy?: string }) => ReactNode;
  className?: string;
}

export function Field({ label, error, hint, required, children, className }: FieldProps) {
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
        {label}
        {required && (
          <span aria-hidden className="text-accent">
            {' '}
            *
          </span>
        )}
        {!required && <span className="normal-case tracking-normal text-muted/70"> (optional)</span>}
      </label>
      {children({ id, describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-2 flex items-center gap-2 text-xs text-status-full">
          <span aria-hidden>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={cn('field-input', className)} {...rest} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} className={cn('field-input min-h-[110px] resize-y', className)} {...rest} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, ...rest }, ref) {
  return <select ref={ref} className={cn('field-input cursor-pointer bg-obsidian', className)} {...rest} />;
});

// ——— Step 4 ———
export function DetailsStep({ formId, onValid }: { formId: string; onValid: () => void }) {
  const { details, setDetails } = useReservation();
  const wishIds = useWishlist((s) => s.ids);
  const wishNames = wishIds.map((id) => menuById.get(id)?.name).filter(Boolean);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DetailsDraft>({
    resolver: zodResolver(detailsSchema),
    defaultValues: details,
    mode: 'onTouched',
  });

  const submit = handleSubmit(
    (values) => {
      setDetails(values);
      onValid();
    },
    () => {
      // Move focus to the first invalid field.
      requestAnimationFrame(() => document.querySelector<HTMLElement>(`#${formId} [aria-invalid="true"]`)?.focus());
    },
  );

  return (
    <div>
      <StepTitle n={4} title="Who are we expecting?" hint="We use these details only to hold your demo request in this browser. Nothing is sent anywhere." />
      <form id={formId} onSubmit={submit} noValidate className="grid gap-8 sm:grid-cols-2">
        <Field label="Full name" required error={errors.name?.message} className="sm:col-span-2">
          {({ id, describedBy }) => (
            <Input id={id} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={describedBy} {...register('name')} />
          )}
        </Field>
        <Field label="Email" required error={errors.email?.message}>
          {({ id, describedBy }) => (
            <Input id={id} type="email" autoComplete="email" inputMode="email" aria-invalid={!!errors.email} aria-describedby={describedBy} {...register('email')} />
          )}
        </Field>
        <Field label="Phone" required error={errors.phone?.message} hint="Include your country code.">
          {({ id, describedBy }) => (
            <Input id={id} type="tel" autoComplete="tel" inputMode="tel" aria-invalid={!!errors.phone} aria-describedby={describedBy} {...register('phone')} />
          )}
        </Field>
        <Field label="Occasion" error={errors.occasion?.message}>
          {({ id, describedBy }) => (
            <Select id={id} aria-describedby={describedBy} {...register('occasion')}>
              <option value="">None in particular</option>
              {OCCASIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Allergies & dietary needs" error={errors.dietary?.message}>
          {({ id, describedBy }) => (
            <Input id={id} placeholder="e.g. no shellfish, one vegetarian" aria-invalid={!!errors.dietary} aria-describedby={describedBy} {...register('dietary')} />
          )}
        </Field>
        <Field label="Special requests" error={errors.requests?.message} className="sm:col-span-2" hint="Anniversaries, accessibility, a quiet table — tell us anything.">
          {({ id, describedBy }) => <Textarea id={id} aria-invalid={!!errors.requests} aria-describedby={describedBy} {...register('requests')} />}
        </Field>
        {wishNames.length > 0 && (
          <label className="flex cursor-pointer items-start gap-4 border border-line/20 p-5 sm:col-span-2">
            <input type="checkbox" className="mt-1 h-5 w-5 accent-[#C5A46D]" {...register('attachWishlist')} />
            <span>
              <span className="block text-sm text-ivory">Attach “My Evening” for the kitchen</span>
              <span className="mt-1 block text-xs text-muted">{wishNames.join(' · ')}</span>
            </span>
          </label>
        )}
      </form>
    </div>
  );
}
