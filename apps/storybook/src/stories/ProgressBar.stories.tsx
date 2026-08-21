import { ProgressBar } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Progress Bar',
  component: ProgressBar,
  parameters: { layout: 'padded' },
  args: { value: 60, size: 'm' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    size: { control: 'select', options: ['s', 'm', 'l'] },
    showRangeLabels: { control: 'boolean' },
  },
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRangeLabels: Story = { args: { value: 72, showRangeLabels: true } };

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-16)]">
      {(['s', 'm', 'l'] as const).map((size) => (
        <ProgressBar key={size} size={size} value={60} />
      ))}
    </div>
  ),
};
