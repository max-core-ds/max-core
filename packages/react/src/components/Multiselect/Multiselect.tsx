'use client';

import { Combobox } from '@base-ui/react/combobox';
import { Field } from '@base-ui/react/field';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ReactNode, useRef, useState } from 'react';
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
// the master's State=Active → border/accent. Min Width 240 at every size (raw
// px in Figma); Radius md, Padding X 12, Inner Gap 8 per
// -- Molecule/Input/Multiselect/Size */*.
const chipsStyles = cva(
  [
    'flex min-w-[240px] items-center gap-[var(--spacing-08)]',
    'rounded-[var(--radius-md)] px-[calc(var(--spacing-12)-var(--border-weight-thin))]',
    fieldBorder,
    'has-[[data-popup-open]]:border-[var(--border-accent)]',
  ],
  {
    variants: {
      // Padding Y per size. Text 12 / 14 / 16 regular (deviation from
      // Caption/700, as Input).
      size: {
        s: 'py-[calc(var(--spacing-12)-var(--border-weight-thin))] text-xs',
        m: 'py-[calc(var(--spacing-12)-var(--border-weight-thin))] text-sm',
        l: 'py-[calc(var(--spacing-16)-var(--border-weight-thin))] text-base',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

// Only the chips (+ the typeahead input) wrap; the chevron stays pinned at the
// right edge, centred on the field.
const chipRowStyles = 'flex min-w-0 flex-1 flex-wrap items-center gap-[var(--spacing-08)]';

// Chip = the master's Badge (Size S, Variant Default, Tone Default) per
// -- Molecule/Input/Multiselect/Badge/*: Padding X 10 / Y 6, Radius sm, thin
// border; accent/subtle fill + accent/active border + Caption/300 text/accent.
// The trailing edge is tightened to sit against the remove × (not in the master,
// but a multiselect needs a way to remove a value without opening the list).
const chipStyles =
  'inline-flex items-center gap-[var(--spacing-04)] rounded-[var(--radius-sm)] ' +
  'border border-[var(--accent-active)] bg-[var(--accent-subtle)] ' +
  'py-[var(--spacing-06)] pl-[var(--spacing-10)] pr-[var(--spacing-06)] ' +
  'text-xs font-light text-[var(--text-accent)] [&_svg]:size-[var(--size-12)]';

// Chevron Icon Size per -- Molecule/Input/Multiselect/Size */Icon Size.
const chevronSize = {
  s: '[&_svg]:size-[var(--size-16)]',
  m: '[&_svg]:size-[var(--size-20)]',
  l: '[&_svg]:size-[var(--size-24)]',
} as const;

const popupStyles =
  'w-[var(--anchor-width)] min-w-[240px] rounded-[var(--radius-md)] border border-[var(--border-default)] ' +
  'bg-[var(--bg-surface)] p-[var(--spacing-04)] text-[var(--text-primary)] ' +
  'shadow-[var(--effect-shadow-down-md)] outline-none';

const itemStyles =
  'flex cursor-default items-center justify-between gap-[var(--spacing-08)] ' +
  'rounded-[var(--radius-sm)] px-[var(--spacing-08)] py-[var(--spacing-06)] text-sm outline-none ' +
  'data-[highlighted]:bg-[var(--bg-subtle)] [&_svg]:size-[var(--size-20)]';

// mode="list" (the master's State=Active): an Item List with Searchbar, Select
// all, Divider and ScrollBar, 8px below the field (Items Gap), as wide as it, no
// shadow. Rows are List Items with a leading Checkbox S.
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
  'aria-label'?: string;
}

export function Multiselect({
  items,
  value,
  defaultValue,
  onValueChange,
  size,
  variant = 'primary',
  disabled,
  placeholder = 'Select…',
  label,
  helper,
  errorMessage,
  mode = 'typeahead',
  searchPlaceholder = 'Search...',
  className,
  ...rest
}: MultiselectProps) {
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
  return (
    <Field.Root className={cn(fieldRoot, className)} invalid={isInvalid} disabled={disabled}>
      {label ? <Field.Label className={fieldLabel(isInvalid)}>{label}</Field.Label> : null}
      <Combobox.Root
        multiple
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
                      <span key={item.value} className={cn(chipStyles, 'pr-[var(--spacing-10)]')}>
                        {item.label}
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
                chevronSize[size ?? 'm'],
              )}
            >
              <ChevronDown />
            </span>
          </Combobox.Trigger>
        ) : (
          <Combobox.Chips ref={chipsRef} className={cn(chipsStyles({ size }), fill)} {...rest}>
            <span className={chipRowStyles}>
              <Combobox.Value>
                {(selected: MultiselectOption[]) =>
                  selected.map((item) => (
                    <Combobox.Chip key={item.value} className={chipStyles}>
                      {item.label}
                      <Combobox.ChipRemove
                        className="inline-flex text-[var(--text-accent)] opacity-[var(--opacity-dim)] hover:opacity-100"
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
                chevronSize[size ?? 'm'],
              )}
            >
              <ChevronDown />
            </Combobox.Trigger>
          </Combobox.Chips>
        )}
        <Combobox.Portal>
          {isList ? (
            <Combobox.Positioner anchor={triggerRef} sideOffset={8}>
              <Combobox.Popup className="outline-none">
                <ItemList
                  className={listStyles}
                  search={{ placeholder: searchPlaceholder, render: <Combobox.Input /> }}
                  selectAll={{
                    checked: allVisibleSelected,
                    indeterminate: selectedVisible.length > 0 && !allVisibleSelected,
                    onCheckedChange: toggleVisible,
                  }}
                >
                  <Combobox.Empty className="px-[var(--spacing-12)] py-[var(--spacing-12)] text-xs font-light text-[var(--text-muted)] empty:hidden">
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
          ) : (
            <Combobox.Positioner anchor={chipsRef} sideOffset={4}>
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
          )}
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
