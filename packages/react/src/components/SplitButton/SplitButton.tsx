'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { Menu } from '@base-ui/react/menu';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ReactNode, useRef } from 'react';
import { capTrim } from '../../utils/cap-trim.js';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { useFormGroupSize } from '../../utils/form-group-size.js';
import { statusBg, statusOutline, statusText, statusToneCompounds } from '../../utils/tone.js';
import { type DropdownItem, DropdownMenu } from '../Dropdown/Dropdown.js';

// The container carries the variant/tone fill (mirroring Button); the two parts
// inside are transparent and share it. Every dimension is the Split Button's own
// Figma token -- Atoms/Buttons/Split Button/<size>/* (Height, Padding X/Y, Radius,
// Icon Size, Divider Height); the gap is Global/Size <size>/Gap (no own token).
// Deliberate superset: Figma's Split Button only has Type = Primary/Secondary;
// `ghost` and the status tones reuse Button's mapping.
// No overflow-hidden: it would clip each part's outset focus ring — the parts
// round their own outer corners instead.
const containerStyles = cva(['relative isolate inline-flex items-stretch', 'transition'], {
  variants: {
    variant: {
      primary:
        'border-solid border-(length:--buttons-global-primary-border-width) border-[var(--border-default)] text-[var(--text-on-accent)]',
      secondary:
        'border-solid border-(length:--buttons-global-secondary-border-width) bg-transparent text-[var(--text-primary)]',
      ghost: 'bg-transparent text-[var(--text-primary)]',
    },
    tone: { default: '', danger: '', success: '', warning: '' },
    size: {
      s: 'rounded-(--buttons-split-button-s-radius)',
      m: 'rounded-(--buttons-split-button-m-radius)',
      l: 'rounded-(--buttons-split-button-l-radius)',
      xl: 'rounded-(--buttons-split-button-xl-radius)',
    },
  },
  compoundVariants: [
    { variant: 'primary', tone: 'default', class: 'bg-[var(--accent-default)]' },
    ...statusToneCompounds('primary', statusBg),
    {
      variant: 'secondary',
      tone: 'default',
      class: 'border-[var(--border-accent)] text-[var(--text-accent)]',
    },
    ...statusToneCompounds('secondary', statusOutline),
    { variant: 'ghost', tone: 'default', class: 'text-[var(--text-accent)]' },
    ...statusToneCompounds('ghost', statusText),
  ],
  defaultVariants: { variant: 'primary', tone: 'default', size: 'm' },
});

// Shared part styling: transparent with its own hover state-layer overlay.
const partStyles = cva(
  [
    'relative inline-flex items-center justify-center',
    'whitespace-nowrap',
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
      part: { main: '', trigger: '' },
      // Label type: S/M Caption/700, L Body/SM/700, XL Body/MD/700.
      size: {
        s: 'h-(--buttons-split-button-s-height) gap-(--buttons-global-size-s-gap) px-(--buttons-split-button-s-padding-x) py-(--buttons-split-button-s-padding-y) [&_svg]:size-(--buttons-split-button-s-icon-size) type-caption-700',
        m: 'h-(--buttons-split-button-m-height) gap-(--buttons-global-size-m-gap) px-(--buttons-split-button-m-padding-x) py-(--buttons-split-button-m-padding-y) [&_svg]:size-(--buttons-split-button-m-icon-size) type-caption-700',
        l: 'h-(--buttons-split-button-l-height) gap-(--buttons-global-size-l-gap) px-(--buttons-split-button-l-padding-x) py-(--buttons-split-button-l-padding-y) [&_svg]:size-(--buttons-split-button-l-icon-size) type-body-sm-700',
        xl: 'h-(--buttons-split-button-xl-height) gap-(--buttons-global-size-xl-gap) px-(--buttons-split-button-xl-padding-x) py-(--buttons-split-button-xl-padding-y) [&_svg]:size-(--buttons-split-button-xl-icon-size) type-body-md-700',
      },
    },
    compoundVariants: [
      { part: 'main', size: 's', class: 'rounded-l-(--buttons-split-button-s-radius)' },
      { part: 'main', size: 'm', class: 'rounded-l-(--buttons-split-button-m-radius)' },
      { part: 'main', size: 'l', class: 'rounded-l-(--buttons-split-button-l-radius)' },
      { part: 'main', size: 'xl', class: 'rounded-l-(--buttons-split-button-xl-radius)' },
      { part: 'trigger', size: 's', class: 'rounded-r-(--buttons-split-button-s-radius)' },
      { part: 'trigger', size: 'm', class: 'rounded-r-(--buttons-split-button-m-radius)' },
      { part: 'trigger', size: 'l', class: 'rounded-r-(--buttons-split-button-l-radius)' },
      { part: 'trigger', size: 'xl', class: 'rounded-r-(--buttons-split-button-xl-radius)' },
    ],
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
    {
      variant: ['primary', 'ghost'],
      size: 's',
      class: 'h-(--buttons-split-button-s-divider-height)',
    },
    {
      variant: ['primary', 'ghost'],
      size: 'm',
      class: 'h-(--buttons-split-button-m-divider-height)',
    },
    {
      variant: ['primary', 'ghost'],
      size: 'l',
      class: 'h-(--buttons-split-button-l-divider-height)',
    },
    {
      variant: ['primary', 'ghost'],
      size: 'xl',
      class: 'h-(--buttons-split-button-xl-divider-height)',
    },
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
    <div
      ref={containerRef}
      className={cn(containerStyles({ variant, tone, size }), className)}
      {...rest}
    >
      <BaseButton
        className={cn(partStyles({ part: 'main', size }))}
        onClick={onClick}
        disabled={disabled}
      >
        {leftIcon}
        {children != null && children !== false ? (
          <span className={capTrim}>{children}</span>
        ) : null}
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
