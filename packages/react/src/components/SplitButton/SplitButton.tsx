'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { Menu } from '@base-ui/react/menu';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ReactNode, useRef } from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { useFormGroupSize } from '../../utils/form-group-size.js';
import { statusBg, statusOutline, statusText, statusToneCompounds } from '../../utils/tone.js';
import { type DropdownItem, DropdownMenu } from '../Dropdown/Dropdown.js';

// The container carries the variant/tone fill (mirroring Button); the two parts
// inside are transparent and share it. Divider heights match
// -- Atoms/Buttons/Split Button/{S,M,L,XL}/Divider Height.
// Deliberate superset: Figma's Split Button only has Type = Primary/Secondary;
// `ghost` and the status tones reuse Button's mapping.
// No overflow-hidden: it would clip each part's outset focus ring — the parts
// round their own outer corners instead.
const containerStyles = cva(
  ['relative isolate inline-flex items-stretch', 'rounded-[var(--radius-l)]', 'transition'],
  {
    variants: {
      variant: {
        primary: 'text-[var(--text-on-accent)]',
        secondary: 'border bg-transparent text-[var(--text-primary)]',
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
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[var(--overlay-state-layer)] before:opacity-0 before:transition-opacity before:content-['']",
    'hover:before:opacity-[var(--opacity-hover)] active:before:opacity-[var(--opacity-pressed)]',
    focusRing,
    // Lift the focused part so its ring paints over the sibling part.
    'focus-visible:z-10',
    'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      // Main button rounds its left corners, the trigger its right ones.
      part: {
        main: 'rounded-l-[var(--radius-l)]',
        trigger: 'rounded-r-[var(--radius-l)]',
      },
      // Height, Icon Size and Padding X per -- Atoms/Buttons/Split Button/{S,M,L,XL}.
      // Padding X (06/10/12/14) is a single per-size token shared by both parts.
      // Label type: S/M Caption/700, L Body/SM/700, XL Body/MD/700.
      size: {
        s: 'h-[var(--size-32)] gap-[var(--spacing-08)] px-[var(--spacing-06)] text-xs [&_svg]:size-[var(--size-20)]',
        m: 'h-[var(--size-40)] gap-[var(--spacing-08)] px-[var(--spacing-10)] text-xs [&_svg]:size-[var(--size-20)]',
        l: 'h-[var(--size-48)] gap-[var(--spacing-08)] px-[var(--spacing-12)] text-sm [&_svg]:size-[var(--size-24)]',
        xl: 'h-[var(--size-56)] gap-[var(--spacing-16)] px-[var(--spacing-14)] text-base [&_svg]:size-[var(--size-28)]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

// Figma: Primary has a `border/default` divider at the per-size Divider Height.
// Secondary has no divider — the halves' own tone border forms a full-height
// seam, so it inherits the container's border colour. Ghost (React-only) keeps
// a faint current-colour line.
const dividerStyles = cva(['w-px shrink-0'], {
  variants: {
    variant: {
      primary: 'self-center bg-[var(--border-default)]',
      secondary: 'self-stretch border-l [border-color:inherit]',
      ghost: 'self-center bg-current opacity-30',
    },
    size: {
      s: '',
      m: '',
      l: '',
      xl: '',
    },
  },
  compoundVariants: [
    { variant: ['primary', 'ghost'], size: 's', class: 'h-[var(--size-24)]' },
    { variant: ['primary', 'ghost'], size: 'm', class: 'h-[var(--size-32)]' },
    { variant: ['primary', 'ghost'], size: 'l', class: 'h-[var(--size-40)]' },
    { variant: ['primary', 'ghost'], size: 'xl', class: 'h-[var(--size-48)]' },
  ],
  defaultVariants: { variant: 'primary', size: 'm' },
});

/** A SplitButton menu row — the same shape as a Dropdown item. */
export type SplitMenuItem = DropdownItem;

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
  size: sizeProp,
  className,
  children,
  onClick,
  leftIcon,
  items,
  triggerLabel = 'More actions',
  disabled,
  ...rest
}: SplitButtonProps) {
  const size = useFormGroupSize(sizeProp) ?? 'm';
  // The menu lines up with the whole split button (end-aligned), not just the chevron.
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} className={cn(containerStyles({ variant, tone }), className)} {...rest}>
      <BaseButton
        className={cn(partStyles({ part: 'main', size }))}
        onClick={onClick}
        disabled={disabled}
      >
        {leftIcon}
        {children}
      </BaseButton>
      <span className={dividerStyles({ variant, size })} aria-hidden />
      <Menu.Root>
        <Menu.Trigger
          className={cn(partStyles({ part: 'trigger', size }))}
          aria-label={triggerLabel}
          disabled={disabled}
          render={<BaseButton />}
        >
          <ChevronDown />
        </Menu.Trigger>
        <DropdownMenu items={items} align="end" anchor={containerRef} />
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
