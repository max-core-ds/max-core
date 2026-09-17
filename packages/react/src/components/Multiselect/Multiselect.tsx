'use client';

import { Combobox } from '@base-ui/react/combobox';
import { Field } from '@base-ui/react/field';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn.js';
import { fieldSurface } from '../../utils/field.js';

export interface MultiselectOption {
  value: string;
  label: string;
}

const chipsStyles = cn(
  'flex min-h-[var(--size-40)] min-w-[240px] flex-wrap items-center gap-[var(--spacing-04)]',
  'rounded-[var(--radius-md)] px-[var(--spacing-12)] py-[var(--spacing-08)]',
  fieldSurface,
  'focus-within:border-[var(--border-focus)]',
);

// Chip = the selected-value Badge: leading padding is Badge Padding X (spacing-10);
// the trailing edge is tightened to sit against the remove ×.
const chipStyles =
  'inline-flex items-center gap-[var(--spacing-04)] rounded-[var(--radius-sm)] ' +
  'bg-[var(--bg-subtle)] py-[var(--spacing-02)] pl-[var(--spacing-10)] pr-[var(--spacing-04)] ' +
  'text-sm text-[var(--text-primary)]';

const popupStyles =
  'min-w-[240px] rounded-[var(--radius-md)] border border-[var(--border-muted)] ' +
  'bg-[var(--bg-surface)] p-[var(--spacing-04)] text-[var(--text-primary)] ' +
  'shadow-[var(--effect-shadow-down-md)] outline-none';

const itemStyles =
  'flex cursor-default items-center justify-between gap-[var(--spacing-08)] ' +
  'rounded-[var(--radius-sm)] px-[var(--spacing-08)] py-[var(--spacing-06)] text-sm outline-none ' +
  'data-[highlighted]:bg-[var(--bg-subtle)]';

export interface MultiselectProps {
  items: MultiselectOption[];
  value?: MultiselectOption[];
  defaultValue?: MultiselectOption[];
  onValueChange?: (value: MultiselectOption[]) => void;
  placeholder?: string;
  label?: ReactNode;
  helper?: ReactNode;
  errorMessage?: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function Multiselect({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select…',
  label,
  helper,
  errorMessage,
  className,
  ...rest
}: MultiselectProps) {
  const isInvalid = Boolean(errorMessage);
  return (
    <Field.Root className="flex flex-col gap-[var(--spacing-04)]" invalid={isInvalid}>
      {label ? (
        <Field.Label className="text-sm font-bold text-[var(--text-primary)]">{label}</Field.Label>
      ) : null}
      <Combobox.Root
        multiple
        items={items}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(v) => onValueChange?.(v as MultiselectOption[])}
      >
        <Combobox.Chips
          className={cn(
            chipsStyles,
            isInvalid && 'border-[var(--status-danger-default)]',
            className,
          )}
          {...rest}
        >
          <Combobox.Value>
            {(selected: MultiselectOption[]) =>
              selected.map((item) => (
                <Combobox.Chip key={item.value} className={chipStyles}>
                  {item.label}
                  <Combobox.ChipRemove
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    aria-label={`Remove ${item.label}`}
                  >
                    <XIcon />
                  </Combobox.ChipRemove>
                </Combobox.Chip>
              ))
            }
          </Combobox.Value>
          <Combobox.Input
            placeholder={placeholder}
            className="min-w-16 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          />
        </Combobox.Chips>
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup className={popupStyles}>
              <Combobox.List>
                {(item: MultiselectOption) => (
                  <Combobox.Item key={item.value} value={item} className={itemStyles}>
                    {item.label}
                    <Combobox.ItemIndicator>
                      <CheckIcon />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
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

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="size-[var(--size-16)]"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
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
      className="size-[var(--size-20)]"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
