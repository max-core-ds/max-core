import { ScrollBar } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/ScrollBar',
  component: ScrollBar,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ScrollBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Alongside a scrollable region, showing scroll position.
export const InContext: Story = {
  render: () => (
    <div className="flex h-40 gap-[var(--spacing-04)]">
      <div className="h-full w-64 overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-subtle)] p-[var(--spacing-16)] text-[var(--text-secondary)]">
        <p>Scrollable content…</p>
      </div>
      <ScrollBar className="self-start" />
    </div>
  ),
};
