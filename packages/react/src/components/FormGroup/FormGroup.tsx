'use client';

import { Fieldset } from '@base-ui/react/fieldset';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { FormGroupSizeContext } from '../../utils/form-group-size.js';

// Figma Form Group set (4011:1119): Headline (Title + Description) → Items slot
// → Action slot (an Action Bar). Size */Gap, Size */Items Gap (S = Global/Items
// Gap), Global/Headline Gap + Action Buttons Gap and — premade — Premade/Global
// Size */Padding, Radius, Border Weight are -- Molecule/Form Group/*. Title is
// Heading/H5 (S, M) or H4 (L), Description Body/SM/300 text/muted, both cap-trimmed.
// Size also sizes the content: fields and buttons inside take the group's S/M/L
// unless they set their own `size`, as the master's Base Inputs and Action Bar
// Buttons follow its Size. Premade = the Premades Form Group surface (bg/surface,
// border/default stroke at Border Weight none). The per-type premade tokens
// (Log in, Sign up, …) all alias Premade/Global, so React binds the Global ones.
const rootStyles = cva(['flex flex-col'], {
  variants: {
    size: {
      s: 'gap-(--form-group-size-s-gap)',
      m: 'gap-(--form-group-size-m-gap)',
      l: 'gap-(--form-group-size-l-gap)',
    },
    premade: {
      true:
        'rounded-(--form-group-premade-global-radius) border-solid border-(length:--form-group-premade-global-border-weight) ' +
        'border-[var(--border-default)] bg-[var(--bg-surface)]',
      false: '',
    },
  },
  compoundVariants: [
    // Figma strokes sit inside: the padding gives the stroke back.
    {
      premade: true,
      size: 's',
      class:
        'p-[calc(var(--form-group-premade-global-size-s-padding)-var(--form-group-premade-global-border-weight))]',
    },
    {
      premade: true,
      size: 'm',
      class:
        'p-[calc(var(--form-group-premade-global-size-m-padding)-var(--form-group-premade-global-border-weight))]',
    },
    {
      premade: true,
      size: 'l',
      class:
        'p-[calc(var(--form-group-premade-global-size-l-padding)-var(--form-group-premade-global-border-weight))]',
    },
  ],
  defaultVariants: { size: 'm', premade: false },
});

const titleStyles = cva(['text-[var(--text-primary)]'], {
  variants: {
    size: { s: 'type-h5', m: 'type-h5', l: 'type-h4' },
  },
  defaultVariants: { size: 'm' },
});

const itemsStyles = cva(['flex flex-col'], {
  variants: {
    size: {
      s: 'gap-(--form-group-global-items-gap)',
      m: 'gap-(--form-group-size-m-items-gap)',
      l: 'gap-(--form-group-size-l-items-gap)',
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
    <FormGroupSizeContext.Provider value={size ?? 'm'}>
      <Fieldset.Root className={cn(rootStyles({ size, premade }), className)} {...rest}>
        {headline || description ? (
          <div className="flex flex-col gap-(--form-group-global-headline-gap)">
            {headline ? (
              <Fieldset.Legend className={titleStyles({ size })}>{headline}</Fieldset.Legend>
            ) : null}
            {description ? (
              <p className="type-body-sm-300 text-[var(--text-muted)]">{description}</p>
            ) : null}
          </div>
        ) : null}
        <div className={itemsStyles({ size })}>{children}</div>
        {action ? (
          // Children fill the width, like the master's Action Bar (FILL).
          <div className="flex gap-(--form-group-global-action-buttons-gap) [&>*]:flex-1">
            {action}
          </div>
        ) : null}
      </Fieldset.Root>
    </FormGroupSizeContext.Provider>
  );
}
