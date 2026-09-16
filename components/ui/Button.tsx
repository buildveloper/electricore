import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'quiet';
type Size = 'md' | 'lg';

// btn-electric supplies the ripple sheen and the one-shot pulse ring.
const base =
  'btn-electric inline-flex items-center justify-center gap-2 rounded-control font-semibold ' +
  'transition-[background-color,border-color,color,transform] duration-200 ' +
  'active:translate-y-px disabled:pointer-events-none disabled:opacity-55';

const variants: Record<Variant, string> = {
  primary:
    'bg-copper text-on-accent hover:bg-[color-mix(in_oklab,var(--copper)_84%,var(--ink))]',
  secondary:
    'border border-rule-strong text-ink hover:border-blue hover:text-blue bg-transparent',
  quiet: 'text-blue hover:text-ink underline-offset-4 hover:underline',
};

const sizes: Record<Size, string> = {
  md: 'px-5 py-3 text-[0.9375rem]',
  lg: 'px-6 py-3.5 text-base',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined;
  };

type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    href: string;
  };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', size = 'md', className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  // The label is layered above the pulse sheen and must stay inert to hovers.
  const label = (
    <span className="relative z-[1] inline-flex items-center gap-2">{children}</span>
  );

  if (props.href !== undefined) {
    const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    return (
      <a className={classes} {...rest}>
        {label}
      </a>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {label}
    </button>
  );
}
