import { Spinner } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l', 'xl'] },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { size: 'm' } };

export const AllSizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-[var(--spacing-24)] text-[var(--accent-default)]">
      {(['s', 'm', 'l', 'xl'] as const).map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </div>
  ),
};
