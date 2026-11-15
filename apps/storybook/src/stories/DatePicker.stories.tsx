import { DateInput, DatePicker, DualDatePicker } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Date Picker — the React counterpart of the Figma Date Picker system, built on
 * `react-day-picker` and restyled entirely onto Max Core tokens. The public value
 * model is canonical ISO strings ("YYYY-MM-DD"); ranges are `{ start, end }`.
 *
 * Three components: **DatePicker** (inline pane, `granularity` = day / month / year),
 * **DualDatePicker** (two-month range), and **DateInput** (a field that opens the
 * pane in a popover). Keyboard grid navigation, disabled/min-max, and range
 * selection come from react-day-picker.
 */
const meta = {
  title: 'Molecules/Date Picker',
  component: DatePicker,
  parameters: { layout: 'centered' },
  argTypes: {
    granularity: { control: 'inline-radio', options: ['day', 'month', 'year'] },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
    showFooter: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Inline day calendar (default). Commit-on-select. */
export const Default: Story = {
  args: { defaultValue: '2026-09-16' },
};

/** Month granularity — a 12-month grid; value snaps to the first of the month. */
export const MonthGranularity: Story = {
  args: { granularity: 'month', defaultValue: '2026-09-01' },
};

/** Year granularity — a 12-year page; value snaps to the first of the year. */
export const YearGranularity: Story = {
  args: { granularity: 'year', defaultValue: '2026-01-01' },
};

/** Clear / Apply footer (Action Bar). */
export const WithFooter: Story = {
  args: { defaultValue: '2026-09-16', showFooter: true },
};

/** Constrained: only Sep 2026 selectable; earlier/later days are inert. */
export const Constrained: Story = {
  args: { defaultValue: '2026-09-16', minDate: '2026-09-01', maxDate: '2026-09-30' },
};

/** Disabled specific dates via a predicate (weekends here). */
export const DisabledDates: Story = {
  args: {
    defaultValue: '2026-09-16',
    disabledDates: (value: string) => {
      const day = new Date(`${value}T12:00:00`).getDay();
      return day === 0 || day === 6;
    },
  },
};

/** All three granularities side by side — day, month, year. */
export const AllGranularities: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-start gap-[var(--spacing-24)]">
      {(['day', 'month', 'year'] as const).map((granularity) => (
        <div key={granularity} className="flex flex-col gap-[var(--spacing-08)]">
          <span className="text-[0.75rem] font-bold uppercase tracking-wide text-[var(--text-muted)]">
            {granularity}
          </span>
          <DatePicker
            granularity={granularity}
            defaultValue={granularity === 'day' ? '2026-09-16' : '2026-09-01'}
          />
        </div>
      ))}
    </div>
  ),
};

/** Two-month range picker — start → end, with range styling on the days. */
export const Range: StoryObj<typeof DualDatePicker> = {
  render: (args) => <DualDatePicker {...args} />,
  args: { defaultValue: { start: '2026-09-10', end: '2026-09-18' } },
};

/** Field that opens the calendar in a popover; closes on select. */
export const Input: StoryObj<typeof DateInput> = {
  render: (args) => <DateInput {...args} />,
  args: { label: 'Start date', defaultValue: '2026-09-16', placeholder: 'Select date' },
};

/** DateInput in its error state — message renders below the trigger. */
export const InputWithError: StoryObj<typeof DateInput> = {
  render: (args) => <DateInput {...args} />,
  args: {
    label: 'Start date',
    placeholder: 'Select date',
    errorMessage: 'Start date is required.',
  },
};
