import { Divider } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Display/Divider',
  component: Divider,
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-80">
      <p className="text-[var(--text-secondary)]">Above</p>
      <Divider className="my-[var(--spacing-12)]" />
      <p className="text-[var(--text-secondary)]">Below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-[var(--spacing-12)] text-[var(--text-secondary)]">
      <span>Left</span>
      <Divider orientation="vertical" />
      <span>Right</span>
    </div>
  ),
};
