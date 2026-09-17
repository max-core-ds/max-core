'use client';

import { Field } from '@base-ui/react/field';
import { Select } from '@base-ui/react/select';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { fieldSurface } from '../../utils/field.js';
import { focusRing } from '../../utils/focus-ring.js';

const triggerStyles = cva(
  [
    'inline-flex w-full items-center justify-between gap-[var(--spacing-08)]',
    'rounded-[var(--radius-md)] px-[var(--spacing-12)]',
    fieldSurface,
    focusRing,
  ],
  {
    variants: {
      // Padding Y + Icon Size per -- Molecule/Input/Select Input/Size {S,M,L}
      // (Icon Size 16/20/24 targets the trigger chevron).
      size: {
        s: 'py-[var(--spacing-12)] text-xs [&_svg]:size-[var(--size-16)]',
        m: 'py-[var(--spacing-12)] text-sm [&_svg]:size-[var(--size-20)]',
        l: 'py-[var(--spacing-16)] text-base [&_svg]:size-[var(--size-24)]',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

const popupStyles =
  'min-w-[var(--size-180)] rounded-[var(--radius-md)] border border-[var(--border-muted)] ' +
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
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  label?: ReactNode;
  helper?: ReactNode;
  errorMessage?: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function SelectInput({
  items,
  placeholder = 'Select…',
  size,
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
    <Field.Root
      className="flex flex-col gap-[var(--spacing-04)]"
      invalid={isInvalid}
      disabled={disabled}
    >
      {label ? (
        <Field.Label className="text-sm font-bold text-[var(--text-primary)]">{label}</Field.Label>
      ) : null}
      <Select.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={(v) => onValueChange?.(v as string)}
        disabled={disabled}
      >
        <Select.Trigger
          className={cn(
            triggerStyles({ size }),
            isInvalid && 'border-[var(--status-danger-default)]',
            className,
          )}
          {...rest}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon className="text-[var(--text-muted)]">
            <ChevronDown />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={4}>
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
        <Field.Error match={true} className="text-xs text-[var(--status-danger-default)]">
          {errorMessage}
        </Field.Error>
      ) : helper ? (
        <Field.Description className="text-xs text-[var(--text-muted)]">{helper}</Field.Description>
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
