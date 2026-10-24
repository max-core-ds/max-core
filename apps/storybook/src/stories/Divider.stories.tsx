import { Divider } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Divider',
  component: Divider,
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

// Switch `orientation` in Controls: horizontal splits stacked content, vertical
// splits an inline row (it stretches to the row's height).
export const Default: Story = {
  args: { orientation: 'horizontal' },
  render: (args) =>
    args.orientation === 'vertical' ? (
      <div className="flex h-12 items-center gap-[var(--spacing-12)] text-[var(--text-secondary)]">
        <span>Left</span>
        <Divider {...args} />
        <span>Right</span>
      </div>
    ) : (
      <div className="w-80 text-[var(--text-secondary)]">
        <p>Above</p>
        <Divider {...args} className="my-[var(--spacing-12)]" />
        <p>Below</p>
      </div>
    ),
};
