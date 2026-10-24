import { StatusDot } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Status Dot',
  component: StatusDot,
  parameters: { layout: 'centered' },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['default', 'busy', 'away', 'dnd', 'offline'],
    },
  },
} satisfies Meta<typeof StatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { status: 'default', label: 'Online' } };

export const AllStatuses: Story = {
  render: () => (
    <div className="flex items-center gap-[var(--spacing-24)]">
      {(['default', 'busy', 'away', 'dnd', 'offline'] as const).map((status) => (
        <div key={status} className="flex flex-col items-center gap-[var(--spacing-08)]">
          <StatusDot status={status} label={status} />
          <code className="text-xs text-[var(--text-muted)]">{status}</code>
        </div>
      ))}
    </div>
  ),
};
