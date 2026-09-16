import { TimePicker } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Native Max Core Time Picker — a scroll-wheel (Hour · Minute · AM/PM) matching the
 * Figma master. Pick by click, arrow keys, or mouse wheel over a column (±1 per
 * notch). Two display modes: `popover` (default, a field that opens the wheel) and
 * `inline`. Values are canonical 24-hour strings ("HH:mm" / "HH:mm:ss").
 */
const meta = {
  title: 'Atoms/TimePicker',
  component: TimePicker,
  parameters: { layout: 'centered' },
  argTypes: {
    mode: { control: 'inline-radio', options: ['popover', 'inline'] },
    format: { control: 'inline-radio', options: ['12h', '24h'] },
    minuteStep: { control: 'inline-radio', options: [1, 5, 10, 15, 30] },
    showSeconds: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Popover field (default). Commit-on-select; closes on click-away / Escape. */
export const Popover: Story = {
  args: { defaultValue: '16:10', format: '12h', label: 'Meeting time' },
};

/** Inline wheel — no trigger, rendered directly. */
export const Inline: Story = {
  args: { mode: 'inline', defaultValue: '16:10', format: '12h' },
};

/** 24-hour with seconds — columns become Hour · Minute · Second (no AM/PM). */
export const WithSeconds: Story = {
  args: { mode: 'inline', defaultValue: '14:45:20', format: '24h', showSeconds: true },
};

/** Constrained + stepped: 09:00–17:00, 15-minute steps (blocked values greyed). */
export const Constrained: Story = {
  args: {
    mode: 'inline',
    defaultValue: '09:00',
    format: '24h',
    minuteStep: 15,
    minTime: '09:00',
    maxTime: '17:00',
  },
};
