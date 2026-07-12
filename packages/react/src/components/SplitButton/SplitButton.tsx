'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { Menu } from '@base-ui/react/menu';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { statusBg, statusOutline, statusText, statusToneCompounds } from '../../utils/tone.js';

// The container carries the variant/tone fill (mirroring Button); the two parts
// inside are transparent and share it. Divider heights match
// -- Atoms/Buttons/Split Button/{S,M,L,XL}/Divider Height.
const containerStyles = cva(
  [
    'relative isolate inline-flex items-stretch overflow-hidden',
    'rounded-[var(--radius-l)]',
    'transition',
  ],
  {
    variants: {
      variant: {
        primary: 'text-[var(--text-on-accent)]',
        secondary: 'border bg-[var(--bg-surface)] text-[var(--text-primary)]',
        ghost: 'bg-transparent text-[var(--text-primary)]',
      },
      tone: { default: '', danger: '', success: '', warning: '' },
    },
    compoundVariants: [
      { variant: 'primary', tone: 'default', class: 'bg-[var(--accent-default)]' },
      ...statusToneCompounds('primary', statusBg),
      {
        variant: 'secondary',
        tone: 'default',
        class: 'border-[var(--border-accent)] text-[var(--accent-default)]',
      },
      ...statusToneCompounds('secondary', statusOutline),
      { variant: 'ghost', tone: 'default', class: 'text-[var(--accent-default)]' },
      ...statusToneCompounds('ghost', statusText),
    ],
    defaultVariants: { variant: 'primary', tone: 'default' },
  },
);

// Shared part styling: transparent with its own hover state-layer overlay.
const partStyles = cva(
  [
    'relative inline-flex items-center justify-center',
    'font-bold whitespace-nowrap',
    'transition',
    "before:pointer-events-none before:absolute before:inset-0 before:bg-[var(--overlay-state-layer)] before:opacity-0 before:transition-opacity before:content-['']",
    'hover:before:opacity-[var(--opacity-hover)] active:before:opacity-[var(--opacity-pressed)]',
    focusRing,
    'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        s: 'h-[var(--size-32)] gap-[var(--spacing-08)] text-xs [&_svg]:size-[var(--size-20)]',
        m: 'h-[var(--size-40)] gap-[var(--spacing-08)] text-sm [&_svg]:size-[var(--size-20)]',
        l: 'h-[var(--size-48)] gap-[var(--spacing-08)] text-base [&_svg]:size-[var(--size-24)]',
        xl: 'h-[var(--size-56)] gap-[var(--spacing-16)] text-lg [&_svg]:size-[var(--size-28)]',
      },
      part: {
        main: 'px-[var(--spacing-12)]',
        trigger: 'px-[var(--spacing-08)]',
      },
    },
    defaultVariants: { size: 'm', part: 'main' },
  },
);

const dividerStyles = cva(['w-px shrink-0 self-center bg-current opacity-30'], {
  variants: {
    size: {
      s: 'h-[var(--size-24)]',
      m: 'h-[var(--size-32)]',
      l: 'h-[var(--size-40)]',
      xl: 'h-[var(--size-48)]',
    },
  },
  defaultVariants: { size: 'm' },
});

const popupStyles =
  'min-w-[var(--size-160)] rounded-[var(--radius-md)] border border-[var(--border-muted)] ' +
  'bg-[var(--bg-surface)] p-[var(--spacing-04)] shadow-[var(--effect-shadow-down-md)] ' +
  'text-[var(--text-primary)] outline-none';

const itemStyles =
  'flex cursor-default items-center gap-[var(--spacing-08)] rounded-[var(--radius-sm)] ' +
  'px-[var(--spacing-08)] py-[var(--spacing-06)] text-sm outline-none ' +
  'data-[highlighted]:bg-[var(--bg-subtle)] [&_svg]:size-[var(--size-20)]';

export interface SplitMenuItem {
  label: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SplitButtonProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onClick'>,
    VariantProps<typeof containerStyles> {
  /** Primary action label. */
  children?: ReactNode;
  /** Primary action handler. */
  onClick?: () => void;
  leftIcon?: ReactNode;
  /** Dropdown items shown from the trigger. */
  items: SplitMenuItem[];
  size?: 's' | 'm' | 'l' | 'xl';
  /** Accessible label for the dropdown trigger. */
  triggerLabel?: string;
  disabled?: boolean;
}

export function SplitButton({
  variant,
  tone,
  size = 'm',
  className,
  children,
  onClick,
  leftIcon,
  items,
  triggerLabel = 'More actions',
  disabled,
  ...rest
}: SplitButtonProps) {
  return (
    <div className={cn(containerStyles({ variant, tone }), className)} {...rest}>
      <BaseButton
        className={cn(partStyles({ size, part: 'main' }))}
        onClick={onClick}
        disabled={disabled}
      >
        {leftIcon}
        {children}
      </BaseButton>
      <span className={dividerStyles({ size })} aria-hidden />
      <Menu.Root>
        <Menu.Trigger
          className={cn(partStyles({ size, part: 'trigger' }))}
          aria-label={triggerLabel}
          disabled={disabled}
          render={<BaseButton />}
        >
          <ChevronDown />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={4} align="end">
            <Menu.Popup className={popupStyles}>
              {items.map((item, i) => (
                <Menu.Item
                  // biome-ignore lint/suspicious/noArrayIndexKey: menu is a static, ordered list
                  key={i}
                  className={itemStyles}
                  disabled={item.disabled}
                  onClick={item.onClick}
                >
                  {item.icon}
                  {item.label}
                </Menu.Item>
              ))}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
