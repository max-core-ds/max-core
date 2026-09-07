import { TimePicker } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/TimePicker',
  component: TimePicker,
  parameters: { layout: 'centered' },
  argTypes: {
    hour: { control: { type: 'number', min: 1, max: 12 } },
    minute: { control: { type: 'number', min: 0, max: 59 } },
    period: { control: 'inline-radio', options: ['AM', 'PM'] },
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { hour: 4, minute: 10, period: 'PM' },
};

export const Morning: Story = {
  args: { hour: 9, minute: 5, period: 'AM' },
};
