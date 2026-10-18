import { ArrowUpRight } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Magnetic } from './Magnetic';

type Variant = 'primary' | 'outline' | 'ghost';

const base =
  'press group relative inline-flex min-h-[48px] items-center justify-center gap-3 overflow-hidden px-7 text-[12px] font-semibold uppercase tracking-[0.22em] transition-colors duration-500 ease-luxe disabled:cursor-not-allowed disabled:opacity-40';

const variants: Record<Variant, string> = {
  primary: 'bg-champagne text-obsidian hover:text-obsidian',
  outline: 'border border-line/40 text-fg hover:border-accent hover:text-obsidian',
  ghost: 'min-h-[44px] px-0 text-fg hover:text-accent',
};

/** A sweep of colour rises from the bottom on hover — the primary interaction of every CTA. */
function Sweep({ variant }: { variant: Variant }) {
  if (variant === 'ghost') return null;
  return (
    <span
      aria-hidden
      className={cn(
        'absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-luxe group-hover:scale-y-100 group-focus-visible:scale-y-100',
        variant === 'primary' ? 'bg-champagne-soft' : 'bg-champagne',
      )}
    />
  );
}

function Content({ children, icon, variant }: { children: ReactNode; icon?: boolean; variant: Variant }) {
  return (
    <>
      <Sweep variant={variant} />
      <span className={cn('relative inline-flex items-center gap-3', variant === 'ghost' && 'link-underline')}>{children}</span>
      {icon && (
        <ArrowUpRight
          aria-hidden
          className="relative h-4 w-4 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </>
  );
}

interface CommonProps {
  variant?: Variant;
  icon?: boolean;
  magnetic?: boolean;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & CommonProps>(function Button(
  { variant = 'primary', icon, magnetic, className, children, type = 'button', ...rest },
  ref,
) {
  const el = (
    <button ref={ref} type={type} className={cn(base, variants[variant], className)} {...rest}>
      <Content icon={icon} variant={variant}>
        {children}
      </Content>
    </button>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
});

export function ButtonLink({ variant = 'primary', icon, magnetic, className, children, ...rest }: LinkProps & CommonProps) {
  const el = (
    <Link className={cn(base, variants[variant], className)} {...rest}>
      <Content icon={icon} variant={variant}>
        {children}
      </Content>
    </Link>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
