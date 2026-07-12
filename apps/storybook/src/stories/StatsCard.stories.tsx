import { Badge, StatsCard } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Organisms/Data Display/Stats Card',
  component: StatsCard,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
  args: { title: 'Revenue', value: '$48,120' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['big', 'compact'] },
    delta: { control: false },
    chart: { control: false },
  },
} satisfies Meta<typeof StatsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Big: Story = {
  args: {
    variant: 'big',
    delta: <Badge tone="success">+12%</Badge>,
    chart: <div className="h-16 rounded-[var(--radius-sm)] bg-[var(--accent-surface)]" />,
  },
};

export const Compact: Story = {
  args: {
    variant: 'compact',
    title: 'Active users',
    value: '2,340',
    delta: <Badge tone="danger">-3%</Badge>,
  },
};
