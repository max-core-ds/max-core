'use client';

import { Combobox } from '@base-ui/react/combobox';
import { Field } from '@base-ui/react/field';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ReactNode, useRef, useState } from 'react';
import { capTrim } from '../../utils/cap-trim.js';
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
import { useFloatingZIndex } from '../../utils/layer.js';
import { useControllableState } from '../../utils/use-controllable-state.js';
import { CheckboxMark } from '../Checkbox/Checkbox.js';
import { ItemList } from '../ItemList/ItemList.js';
import { listItemOption } from '../ListItem/ListItem.js';

export interface MultiselectOption {
  value: string;
  label: string;
}

// The chips row is the field frame (.Multiselect-Options → Input): border, fill
// and focus border (focus-within, the inline search input takes focus). Open =
// the master's State=Active → border/accent. Every dimension is
// -- Molecule/Input/Multiselect/Size */* (Min Width 240 at every size). The
// frame hugs its chips: Padding Y + chip (21) + Padding Y = 45 / 45, and the
// Icon Size chevron sets L = 56, as the master.
const chipsStyles = cva(
  ['flex items-center', fieldBorder, 'has-[[data-popup-open]]:border-[var(--border-accent)]'],
  {
    variants: {
      size: {
        s: 'min-w-(--input-multiselect-size-s-min-width) gap-(--input-multiselect-size-s-inner-gap) rounded-(--input-multiselect-size-s-radius) border-(length:--input-multiselect-size-s-stroke-weight) px-[calc(var(--input-multiselect-size-s-padding-x)-var(--input-multiselect-size-s-stroke-weight))] py-[calc(var(--input-multiselect-size-s-padding-y)-var(--input-multiselect-size-s-stroke-weight))] type-caption-300',
        m: 'min-w-(--input-multiselect-size-m-min-width) gap-(--input-multiselect-size-m-inner-gap) rounded-(--input-multiselect-size-m-radius) border-(length:--input-multiselect-size-m-stroke-weight) px-[calc(var(--input-multiselect-size-m-padding-x)-var(--input-multiselect-size-m-stroke-weight))] py-[calc(var(--input-multiselect-size-m-padding-y)-var(--input-multiselect-size-m-stroke-weight))] type-body-sm-300',
        l: 'min-w-(--input-multiselect-size-l-min-width) gap-(--input-multiselect-size-l-inner-gap) rounded-(--input-multiselect-size-l-radius) border-(length:--input-multiselect-size-l-stroke-weight) px-[calc(var(--input-multiselect-size-l-padding-x)-var(--input-multiselect-size-l-stroke-weight))] py-[calc(var(--input-multiselect-size-l-padding-y)-var(--input-multiselect-size-l-stroke-weight))] type-body-md-300',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

const itemsGap = {
  s: 'gap-(--input-multiselect-size-s-items-gap)',
  m: 'gap-(--input-multiselect-size-m-items-gap)',
  l: 'gap-(--input-multiselect-size-l-items-gap)',
} as const;

// Only the chips (+ the typeahead input) wrap; the chevron stays pinned at the
// right edge, centred on the field. Chips sit Inner Gap apart.
const chipRowStyles = 'flex min-w-0 flex-1 flex-wrap items-center gap-[inherit]';

// Chip = the master's Badge (Size S, Variant Default) per
// -- Molecule/Input/Multiselect/Badge/*: Padding X 10 / Y 6, Radius sm, Border
// Weight thin; accent/subtle fill + accent/active stroke + Caption/300 text/accent,
// cap-trimmed (21px). The Badge stroke is OUTSIDE, so it's an outline here: it
// doesn't add to the chip's box, and the field stays 45 tall like the master. The
// trailing edge is tightened to sit against the remove × (not in the master, but a
// multiselect needs a way to remove a value without opening the list).
const chipStyles =
  'inline-flex items-center gap-[var(--spacing-04)] rounded-(--input-multiselect-badge-radius) ' +
  'outline-solid outline-(length:--input-multiselect-badge-border-weight) outline-[var(--accent-active)] ' +
  'bg-[var(--accent-subtle)] py-(--input-multiselect-badge-padding-y) pl-(--input-multiselect-badge-padding-x) ' +
  'pr-(--input-multiselect-badge-padding-y) type-caption-300 text-[var(--text-accent)] [&_svg]:size-[var(--size-12)]';

// Chevron Icon Size per -- Molecule/Input/Multiselect/Size */Icon Size.
const chevronSize = {
  s: '[&_svg]:size-(--input-multiselect-size-s-icon-size)',
  m: '[&_svg]:size-(--input-multiselect-size-m-icon-size)',
  l: '[&_svg]:size-(--input-multiselect-size-l-icon-size)',
} as const;

// The popup is an Item List 8px below the field (Items Gap), as wide as it, with
// the Item List's shadow; rows are List Items with a leading Checkbox S. mode="list" (the
// master's State=Active) adds the Searchbar, Select all and Divider header;
// typeahead filters from the field, so its list has no header.
const listStyles =
  'w-[var(--anchor-width)] max-h-[min(var(--available-height),calc(var(--size-40)*8+var(--spacing-12)*2))]';

export interface MultiselectProps extends VariantProps<typeof chipsStyles> {
  items: MultiselectOption[];
  value?: MultiselectOption[];
  defaultValue?: MultiselectOption[];
  onValueChange?: (value: MultiselectOption[]) => void;
  /** Primary = filled (`bg/default`), Secondary = outline only. */
  variant?: FieldVariant;
  placeholder?: string;
  disabled?: boolean;
  label?: ReactNode;
  helper?: ReactNode;
  errorMessage?: ReactNode;
  /**
   * `typeahead` (default): type in the field to filter a plain list. `list` (the
   * Figma master): the field only shows the chips and opens an Item List with its
   * own search, a Select all row and checkbox rows.
   */
  mode?: 'typeahead' | 'list';
  /** Placeholder of the search field inside the list (`mode="list"`). */
  searchPlaceholder?: string;
  /** Applied to the field wrapper (label + field + helper). */
  className?: string;
  /**
   * Field name for native form submission: Base UI renders hidden input(s) that
   * mirror the current value, so `new FormData(form)` includes it.
   * One hidden input per selected option, each carrying its `value`
   * (`formData.getAll(name)` → `['react', 'vue']`).
   * Optional and additive — `value` / `onValueChange` still own the state.
   *
   * Caveats:
   * - A native form reset (`<button type="reset">`, `form.reset()`) empties the hidden
   *   input(s) but not a **controlled** value; your state wins on the next render
   *   (same as any controlled React input). Reset your state yourself.
   * - With a form library that already reads `value` / `onValueChange`, leave `name`
   *   out — passing both submits the value twice (library + FormData).
   */
  name?: string;
  'aria-label'?: string;
}

export function Multiselect({
  items,
  value,
  defaultValue,
  onValueChange,
  size: sizeProp,
  variant = 'primary',
  disabled,
  placeholder = 'Select…',
  label,
  name,
  helper,
  errorMessage,
  mode = 'typeahead',
  searchPlaceholder = 'Search...',
  className,
  ...rest
}: MultiselectProps) {
  const floatingZ = useFloatingZIndex('dropdown');
  const size = useFormGroupSize(sizeProp);
  const isInvalid = Boolean(errorMessage);
  const isList = mode === 'list';
  const [selected, setSelected] = useControllableState(value, defaultValue, onValueChange, []);
  // List mode filters itself so "Select all" can act on the visible rows.
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const visible = needle ? items.filter((i) => i.label.toLowerCase().includes(needle)) : items;
  const isSelected = (item: MultiselectOption) => selected.some((s) => s.value === item.value);
  const selectedVisible = visible.filter(isSelected);
  const allVisibleSelected = visible.length > 0 && selectedVisible.length === visible.length;
  const toggleVisible = (checked: boolean) =>
    setSelected(
      checked
        ? [...selected, ...visible.filter((i) => !isSelected(i))]
        : selected.filter((s) => !visible.some((i) => i.value === s.value)),
    );
  const fill = isInvalid
    ? ['border-[var(--status-danger-border)]', fieldInvalidFill[variant]]
    : [fieldFill[variant], fieldHover];
  // Anchor the list to the whole field frame (the chips row, or the trigger in
  // list mode), not the inner text input, so it opens below it, as wide as it.
  const chipsRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sizeKey = size ?? 'm';
  return (
    <Field.Root
      className={cn(fieldRoot, itemsGap[sizeKey], className)}
      invalid={isInvalid}
      disabled={disabled}
    >
      {label ? <Field.Label className={fieldLabel(isInvalid)}>{label}</Field.Label> : null}
      <Combobox.Root
        multiple
        name={name}
        disabled={disabled}
        items={items}
        value={selected}
        onValueChange={(v) => setSelected(v as MultiselectOption[])}
        {...(isList
          ? { inputValue: query, onInputValueChange: setQuery, filteredItems: visible }
          : {})}
      >
        {isList ? (
          // The field is the trigger: chips (no remove ×, the checkboxes deselect),
          // the placeholder when empty, and the chevron.
          <Combobox.Trigger
            ref={triggerRef}
            className={cn(
              chipsStyles({ size }),
              'text-left data-[popup-open]:border-[var(--border-accent)]',
              fill,
            )}
            {...rest}
          >
            <span className={chipRowStyles}>
              <Combobox.Value>
                {(chosen: MultiselectOption[]) =>
                  chosen.length ? (
                    chosen.map((item) => (
                      <span
                        key={item.value}
                        className={cn(chipStyles, 'pr-(--input-multiselect-badge-padding-x)')}
                      >
                        <span className={capTrim}>{item.label}</span>
                      </span>
                    ))
                  ) : (
                    <span
                      className={
                        isInvalid
                          ? 'text-[var(--status-danger-default)]'
                          : 'text-[var(--text-muted)]'
                      }
                    >
                      {placeholder}
                    </span>
                  )
                }
              </Combobox.Value>
            </span>
            <span
              aria-hidden="true"
              className={cn(
                'inline-flex shrink-0 text-[var(--text-muted)] in-data-[popup-open]:rotate-180',
                chevronSize[sizeKey],
              )}
            >
              <ChevronDown />
            </span>
          </Combobox.Trigger>
        ) : (
          <Combobox.Chips ref={chipsRef} className={cn(chipsStyles({ size }), fill)}>
            <span className={chipRowStyles}>
              <Combobox.Value>
                {(selected: MultiselectOption[]) =>
                  selected.map((item) => (
                    <Combobox.Chip key={item.value} className={chipStyles}>
                      <span className={capTrim}>{item.label}</span>
                      <Combobox.ChipRemove
                        // h-0: the 12px × overflows the 9px label row, so the chip keeps the Badge's 21px.
                        className="inline-flex h-0 items-center text-[var(--text-accent)] opacity-[var(--opacity-dim)] hover:opacity-100"
                        aria-label={`Remove ${item.label}`}
                      >
                        <XIcon />
                      </Combobox.ChipRemove>
                    </Combobox.Chip>
                  ))
                }
              </Combobox.Value>
              <Combobox.Input
                // The input is the focusable control here — `aria-label` names it
                // (on the chips wrapper it named nothing a screen reader reaches).
                {...rest}
                placeholder={placeholder}
                className={cn(
                  'min-w-16 flex-1 bg-transparent text-[var(--text-primary)] outline-none disabled:cursor-not-allowed',
                  isInvalid
                    ? 'placeholder:text-[var(--status-danger-default)]'
                    : 'placeholder:text-[var(--text-muted)]',
                )}
              />
            </span>
            {/* Chevron (Figma: Show Trailing / Right Icon) — opens the list; flips while open. */}
            <Combobox.Trigger
              aria-label="Show options"
              className={cn(
                'inline-flex shrink-0 text-[var(--text-muted)] data-[popup-open]:rotate-180',
                chevronSize[sizeKey],
              )}
            >
              <ChevronDown />
            </Combobox.Trigger>
          </Combobox.Chips>
        )}
        <Combobox.Portal>
          {/* Both modes open an Item List 8px below the field (Items Gap); the
              typeahead one has no header — the field itself is the search. */}
          <Combobox.Positioner
            style={{ zIndex: floatingZ }}
            anchor={isList ? triggerRef : chipsRef}
            sideOffset={8}
          >
            <Combobox.Popup className="outline-none">
              <ItemList
                className={listStyles}
                {...(isList
                  ? {
                      search: { placeholder: searchPlaceholder, render: <Combobox.Input /> },
                      selectAll: {
                        checked: allVisibleSelected,
                        indeterminate: selectedVisible.length > 0 && !allVisibleSelected,
                        onCheckedChange: toggleVisible,
                      },
                    }
                  : {})}
              >
                <Combobox.Empty className="px-(--list-item-padding-x) py-(--list-item-padding-y) type-caption-300 text-[var(--text-muted)] empty:hidden">
                  No matches
                </Combobox.Empty>
                <Combobox.List>
                  {(item: MultiselectOption) => (
                    <Combobox.Item key={item.value} value={item} className={listItemOption}>
                      <CheckboxMark />
                      <span className="flex-1">{item.label}</span>
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </ItemList>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
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

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
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
