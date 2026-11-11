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
import { useFormGroupSize } from '../../utils/form-group-size.js';
import { FieldIcon } from '../Input/Input.js';
import { ItemList } from '../ItemList/ItemList.js';
import { listItemOption } from '../ListItem/ListItem.js';
import { RadioMark } from '../Radio/Radio.js';

// The trigger is the field frame (.Select-Input-Options → Input): it owns the
// border, fill and focus border (hybrid model: no outset ring). Open = the
// master's State=Active → border/accent. The placeholder shows in text/muted.
// Every dimension is -- Molecule/Input/Select Input/Size */*; the chevron is
// always there at Icon Size, so the frame is 40 / 44 / 56 as the master.
const triggerStyles = cva(
  [
    'inline-flex w-full items-center text-left',
    fieldBorder,
    'data-[popup-open]:border-[var(--border-accent)] data-[placeholder]:text-[var(--text-muted)]',
  ],
  {
    variants: {
      size: {
        s: 'min-w-(--input-select-input-size-s-min-width) gap-(--input-select-input-size-s-inner-gap) rounded-(--input-select-input-size-s-radius) border-(length:--input-select-input-size-s-stroke-weight) px-[calc(var(--input-select-input-size-s-padding-x)-var(--input-select-input-size-s-stroke-weight))] py-[calc(var(--input-select-input-size-s-padding-y)-var(--input-select-input-size-s-stroke-weight))] type-caption-300 [&_svg]:size-(--input-select-input-size-s-icon-size)',
        m: 'min-w-(--input-select-input-size-m-min-width) gap-(--input-select-input-size-m-inner-gap) rounded-(--input-select-input-size-m-radius) border-(length:--input-select-input-size-m-stroke-weight) px-[calc(var(--input-select-input-size-m-padding-x)-var(--input-select-input-size-m-stroke-weight))] py-[calc(var(--input-select-input-size-m-padding-y)-var(--input-select-input-size-m-stroke-weight))] type-body-sm-300 [&_svg]:size-(--input-select-input-size-m-icon-size)',
        l: 'min-w-(--input-select-input-size-l-min-width) gap-(--input-select-input-size-l-inner-gap) rounded-(--input-select-input-size-l-radius) border-(length:--input-select-input-size-l-stroke-weight) px-[calc(var(--input-select-input-size-l-padding-x)-var(--input-select-input-size-l-stroke-weight))] py-[calc(var(--input-select-input-size-l-padding-y)-var(--input-select-input-size-l-stroke-weight))] type-body-md-300 [&_svg]:size-(--input-select-input-size-l-icon-size)',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

const itemsGap = {
  s: 'gap-(--input-select-input-size-s-items-gap)',
  m: 'gap-(--input-select-input-size-m-items-gap)',
  l: 'gap-(--input-select-input-size-l-items-gap)',
} as const;

// Popup: the master's State=Active opens an Item List (Show search / Select all /
// Divider off, ScrollBar on) 8px below the field (Items Gap), as wide as it, with
// no shadow (decision 2026-10-24). Rows are List Items with a leading Radio S;
// the dot marks the selected value.
const listStyles =
  'w-[var(--anchor-width)] max-h-[min(var(--available-height),calc(var(--size-40)*6+var(--spacing-12)*2))]';

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
  size: sizeProp,
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
  const size = useFormGroupSize(sizeProp);
  const isInvalid = Boolean(errorMessage);
  return (
    <Field.Root
      className={cn(fieldRoot, itemsGap[size ?? 'm'], className)}
      invalid={isInvalid}
      disabled={disabled}
    >
      {label ? <Field.Label className={fieldLabel(isInvalid)}>{label}</Field.Label> : null}
      <Select.Root
        // items lets Select.Value show the label (not the raw value) once chosen.
        items={items}
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
          <Select.Positioner alignItemWithTrigger={false} sideOffset={8}>
            <Select.Popup className="outline-none">
              <ItemList className={listStyles}>
                {items.map((item) => (
                  <Select.Item key={item.value} value={item.value} className={listItemOption}>
                    <RadioMark />
                    <Select.ItemText className="flex-1">{item.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </ItemList>
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
