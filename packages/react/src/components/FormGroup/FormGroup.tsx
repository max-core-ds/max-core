'use client';

import { Fieldset } from '@base-ui/react/fieldset';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Per-size outer Gap and Items Gap, plus Headline/Action gaps and (in premade
// mode) padding/radius, match -- Molecule/Form Group/*.
const rootStyles = cva(['flex flex-col'], {
  variants: {
    size: {
      s: 'gap-[var(--spacing-20)]',
      m: 'gap-[var(--spacing-24)]',
      l: 'gap-[var(--spacing-28)]',
    },
    premade: {
      true: 'rounded-[var(--radius-md)] bg-[var(--bg-surface)]',
      false: '',
    },
  },
  compoundVariants: [
    { premade: true, size: 's', class: 'p-[var(--spacing-16)]' },
    { premade: true, size: 'm', class: 'p-[var(--spacing-24)]' },
    { premade: true, size: 'l', class: 'p-[var(--spacing-24)]' },
  ],
  defaultVariants: { size: 'm', premade: false },
});

const itemsStyles = cva(['flex flex-col'], {
  variants: {
    size: {
      s: 'gap-[var(--spacing-12)]',
      m: 'gap-[var(--spacing-16)]',
      l: 'gap-[var(--spacing-20)]',
    },
  },
  defaultVariants: { size: 'm' },
});

export interface FormGroupProps
  extends Omit<ComponentPropsWithoutRef<typeof Fieldset.Root>, 'className'>,
    VariantProps<typeof rootStyles> {
  headline?: ReactNode;
  description?: ReactNode;
  /** Action buttons rendered at the bottom. */
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function FormGroup({
  size,
  premade,
  headline,
  description,
  action,
  children,
  className,
  ...rest
}: FormGroupProps) {
  return (
    <Fieldset.Root className={cn(rootStyles({ size, premade }), className)} {...rest}>
      {headline || description ? (
        <div className="flex flex-col gap-[var(--spacing-12)]">
          {headline ? (
            <Fieldset.Legend className="text-2xl font-bold text-[var(--text-primary)]">
              {headline}
            </Fieldset.Legend>
          ) : null}
          {description ? (
            <p className="text-sm font-light text-[var(--text-secondary)]">{description}</p>
          ) : null}
        </div>
      ) : null}
      <div className={itemsStyles({ size })}>{children}</div>
      {action ? <div className="flex gap-[var(--spacing-08)]">{action}</div> : null}
    </Fieldset.Root>
  );
}
