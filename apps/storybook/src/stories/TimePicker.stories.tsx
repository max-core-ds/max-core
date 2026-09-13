import { TimePicker, TimePickerDialog, TimePickerInput } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

/**
 * Functional Time Picker (vendored from baseui-cn, built on Base UI, styled with
 * Max Core tokens). Three entry points share one engine:
 *  - `TimePicker`        — inline/static surface (clock or list)
 *  - `TimePickerInput`   — read-only field that opens the picker in a popover
 *  - `TimePickerDialog`  — read-only field that opens the picker in a modal dialog
 *
 * Values are canonical 24-hour strings ("HH:mm" or "HH:mm:ss").
 */
const meta = {
  title: 'Atoms/TimePicker',
  component: TimePicker,
  parameters: { layout: 'centered' },
  argTypes: {
    format: { control: 'inline-radio', options: ['12h', '24h'] },
    pickerMode: { control: 'inline-radio', options: ['clock', 'list'] },
    orientation: { control: 'inline-radio', options: ['portrait', 'landscape'] },
    minuteStep: { control: 'inline-radio', options: [1, 5, 10, 15, 30] },
    showSeconds: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Inline clock face — the default surface. */
export const Clock: Story = {
  args: { defaultValue: '09:30', format: '12h', pickerMode: 'clock' },
};

/** Inline list columns (Hour / Minute / AM·PM) — matches the Figma master. */
export const List: Story = {
  args: { defaultValue: '16:10', format: '12h', pickerMode: 'list' },
};

/** 24-hour clock with seconds. */
export const TwentyFourHourWithSeconds: Story = {
  args: { defaultValue: '14:45:20', format: '24h', pickerMode: 'clock', showSeconds: true },
};

/** Field + popover (desktop). Defaults to list mode. */
export const InputPopover: StoryObj<typeof TimePickerInput> = {
  render: (args) => {
    const [value, setValue] = useState<string | null>('08:15');
    return (
      <TimePickerInput {...args} label="Meeting time" value={value} onValueChange={setValue} />
    );
  },
};

/** Field + modal dialog (mobile). Defaults to clock mode. */
export const InputDialog: StoryObj<typeof TimePickerDialog> = {
  render: (args) => {
    const [value, setValue] = useState<string | null>('19:00');
    return (
      <TimePickerDialog {...args} label="Reservation" value={value} onValueChange={setValue} />
    );
  },
};

/** Constrained + stepped: 09:00–17:00 business hours, 15-minute steps. */
export const Constrained: Story = {
  args: {
    defaultValue: '09:00',
    format: '24h',
    pickerMode: 'list',
    minuteStep: 15,
    minTime: '09:00',
    maxTime: '17:00',
  },
};
