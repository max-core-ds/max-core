'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ReactNode, useState } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { elevatePress, stateLayer } from '../../utils/state-layer.js';

// Circular floating action button. Main sizes/icon sizes and the speed-dial
// menu dimensions match -- Atoms/Buttons/Fab/*.
const mainStyles = cva(
  [
    'relative isolate inline-flex items-center justify-center',
    'rounded-[var(--radius-full)]',
    'bg-[var(--accent-default)] text-[var(--text-on-accent)]',
    'shadow-[var(--effect-shadow-down-md)]',
    'transition',
    stateLayer,
    elevatePress,
    focusRing,
    'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        s: 'size-[var(--size-40)] [&_svg]:size-[var(--size-20)]',
        m: 'size-[var(--size-56)] [&_svg]:size-[var(--size-32)]',
        xl: 'size-[var(--size-64)] [&_svg]:size-[var(--size-32)]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

// Speed-dial action button — fixed Item Size / Item Icon Size.
const itemStyles = cn(
  'relative isolate inline-flex size-[var(--size-40)] items-center justify-center',
  'rounded-[var(--radius-full)] bg-[var(--bg-surface)] text-[var(--text-primary)]',
  'shadow-[var(--effect-shadow-down-sm)] [&_svg]:size-[var(--size-20)]',
  'transition',
  stateLayer,
  focusRing,
);

const labelStyles =
  'rounded-[var(--radius-md)] bg-[var(--bg-surface)] px-[var(--spacing-08)] py-[var(--spacing-04)] ' +
  'text-sm font-bold text-[var(--text-primary)] shadow-[var(--effect-shadow-down-sm)]';

export interface FabAction {
  label: ReactNode;
  icon: ReactNode;
  onClick?: () => void;
}

export interface FabProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'onClick'>,
    VariantProps<typeof mainStyles> {
  /** Main button icon. */
  icon: ReactNode;
  'aria-label': string;
  /** Main click handler (used when there are no speed-dial actions). */
  onClick?: () => void;
  /** Optional speed-dial actions; when present the main button toggles them. */
  actions?: FabAction[];
}

export function Fab({ size = 'm', className, icon, onClick, actions, ...rest }: FabProps) {
  const [open, setOpen] = useState(false);
  const hasMenu = Boolean(actions && actions.length > 0);

  return (
    // Expandable Gap (main ↔ list) and List Gap (between items) are both 16.
    <div className="relative inline-flex flex-col-reverse items-end gap-[var(--spacing-16)]">
      <BaseButton
        className={cn(mainStyles({ size }), className)}
        onClick={hasMenu ? () => setOpen((v) => !v) : onClick}
        aria-expanded={hasMenu ? open : undefined}
        {...rest}
      >
        {icon}
      </BaseButton>
      {hasMenu && open ? (
        <ul className="flex flex-col-reverse gap-[var(--spacing-16)]">
          {actions?.map((action, i) => (
            // Item Gap (label ↔ button) = 8.
            // biome-ignore lint/suspicious/noArrayIndexKey: actions are a static, ordered list
            <li key={i} className="flex items-center justify-end gap-[var(--spacing-08)]">
              <span className={labelStyles}>{action.label}</span>
              <BaseButton
                className={itemStyles}
                onClick={() => {
                  action.onClick?.();
                  setOpen(false);
                }}
              >
                {action.icon}
              </BaseButton>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
