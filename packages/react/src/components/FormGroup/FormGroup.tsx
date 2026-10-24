'use client';

import { Fieldset } from '@base-ui/react/fieldset';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Figma Form Group set (4011:1119): Headline (Title + Description) → Items slot
// → Action slot (an Action Bar). Per-size outer Gap and Items Gap, plus
// Headline/Action gaps and (in premade mode) padding/radius, match
// -- Molecule/Form Group/*. Title is Heading/H5 (S, M) or H4 (L), Description
// Body/SM/300 text/muted. Premade = the Premades Form Group surface (bg/surface,
// no border, radius md). Its Size L padding is 40 in Figma, but that token
// isn't in the export yet, so L keeps M's 24 until the re-export.
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

const titleStyles = cva(
  ['font-bold leading-[1.2] tracking-[-0.005em] text-[var(--text-primary)]'],
  {
    variants: {
      size: { s: 'text-2xl', m: 'text-2xl', l: 'text-3xl' },
    },
    defaultVariants: { size: 'm' },
  },
);

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
  /** Action slot at the bottom — typically an `ActionBar` of Buttons. */
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
            <Fieldset.Legend className={titleStyles({ size })}>{headline}</Fieldset.Legend>
          ) : null}
          {description ? (
            <p className="text-sm font-light text-[var(--text-muted)]">{description}</p>
          ) : null}
        </div>
      ) : null}
      <div className={itemsStyles({ size })}>{children}</div>
      {action ? (
        // Children fill the width, like the master's Action Bar (FILL).
        <div className="flex gap-[var(--spacing-08)] [&>*]:flex-1">{action}</div>
      ) : null}
    </Fieldset.Root>
  );
}
