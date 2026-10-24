'use client';

import { Field } from '@base-ui/react/field';
import { Select } from '@base-ui/react/select';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import {
  type FieldVariant,
  fieldBorder,
  fieldError,
  fieldFill,
  fieldHelper,
  fieldHover,
  fieldInvalidFill,
  fieldLabel,
  fieldRoot,
} from '../../utils/field.js';
import { FieldIcon } from '../Input/Input.js';

// The trigger is the field frame (.Select-Input-Options → Input): it owns the
// border, fill and focus border (hybrid model: no outset ring). Open = the
// master's State=Active → border/accent. The placeholder shows in text/muted.
const triggerStyles = cva(
  [
    'inline-flex w-full items-center gap-[var(--spacing-08)]',
    'rounded-[var(--radius-md)] px-[calc(var(--spacing-12)-var(--border-weight-thin))] text-left',
    fieldBorder,
    'data-[popup-open]:border-[var(--border-accent)] data-[placeholder]:text-[var(--text-muted)]',
  ],
  {
    variants: {
      // Padding Y, Min Width (raw px) + Icon Size per -- Molecule/Input/Select
      // Input/Size {S,M,L} (Icon Size 16/20/24 for the leading icon and chevron).
      // Text 12 / 14 / 16 regular (deviation from Caption/700, as Input).
      size: {
        s: 'min-w-[160px] py-[calc(var(--spacing-12)-var(--border-weight-thin))] text-xs [&_svg]:size-[var(--size-16)]',
        m: 'min-w-[180px] py-[calc(var(--spacing-12)-var(--border-weight-thin))] text-sm [&_svg]:size-[var(--size-20)]',
        l: 'min-w-[200px] py-[calc(var(--spacing-16)-var(--border-weight-thin))] text-base [&_svg]:size-[var(--size-24)]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

// Popup: the master opens an Item List (bg/surface + border/default) below the
// field, as wide as the trigger. Item rows are audited with Item List / Dropdown.
const popupStyles =
  'w-[var(--anchor-width)] min-w-[var(--size-180)] rounded-[var(--radius-md)] border border-[var(--border-default)] ' +
  'bg-[var(--bg-surface)] p-[var(--spacing-04)] text-[var(--text-primary)] ' +
  'shadow-[var(--effect-shadow-down-md)] outline-none';

const itemStyles =
  'flex cursor-default items-center justify-between gap-[var(--spacing-08)] ' +
  'rounded-[var(--radius-sm)] px-[var(--spacing-08)] py-[var(--spacing-06)] text-sm outline-none ' +
  'data-[highlighted]:bg-[var(--bg-subtle)] [&_svg]:size-[var(--size-20)]';

export interface SelectOption {
  value: string;
  label: ReactNode;
}

export interface SelectInputProps extends VariantProps<typeof triggerStyles> {
  items: SelectOption[];
  /** Primary = filled (`bg/default`), Secondary = outline only. */
  variant?: FieldVariant;
  /** Icon before the value (Figma: Show Leading / Left Icon). */
  leadingIcon?: ReactNode;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  label?: ReactNode;
  helper?: ReactNode;
  errorMessage?: ReactNode;
  /** Applied to the field wrapper (label + trigger + helper). */
  className?: string;
  'aria-label'?: string;
}

export function SelectInput({
  items,
  placeholder = 'Select…',
  size,
  variant = 'primary',
  leadingIcon,
  value,
  defaultValue,
  onValueChange,
  disabled,
  label,
  helper,
  errorMessage,
  className,
  ...rest
}: SelectInputProps) {
  const isInvalid = Boolean(errorMessage);
  return (
    <Field.Root className={cn(fieldRoot, className)} invalid={isInvalid} disabled={disabled}>
      {label ? <Field.Label className={fieldLabel(isInvalid)}>{label}</Field.Label> : null}
      <Select.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={(v) => onValueChange?.(v as string)}
        disabled={disabled}
      >
        <Select.Trigger
          className={cn(
            triggerStyles({ size }),
            isInvalid
              ? [
                  'border-[var(--status-danger-border)] data-[placeholder]:text-[var(--status-danger-default)]',
                  fieldInvalidFill[variant],
                ]
              : [fieldFill[variant], fieldHover],
          )}
          {...rest}
        >
          {leadingIcon ? (
            <FieldIcon className={isInvalid ? 'text-[var(--status-danger-default)]' : undefined}>
              {leadingIcon}
            </FieldIcon>
          ) : null}
          <Select.Value className="min-w-0 flex-1 truncate" placeholder={placeholder} />
          <Select.Icon className="flex shrink-0 text-[var(--text-muted)]">
            <ChevronDown />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner alignItemWithTrigger={false} sideOffset={4}>
            <Select.Popup className={popupStyles}>
              {items.map((item) => (
                <Select.Item key={item.value} value={item.value} className={itemStyles}>
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      {errorMessage ? (
        <Field.Error match={true} className={fieldError}>
          {errorMessage}
        </Field.Error>
      ) : helper ? (
        <Field.Description className={fieldHelper}>{helper}</Field.Description>
      ) : null}
    </Field.Root>
  );
}

function ChevronDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
