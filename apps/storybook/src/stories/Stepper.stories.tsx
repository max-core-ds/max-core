import { Stepper } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Forms/Stepper',
  component: Stepper,
  parameters: { layout: 'centered' },
  args: { label: 'Quantity', defaultValue: 1, min: 0, size: 'm' },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'] },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-end gap-[var(--spacing-16)]">
      {(['s', 'm', 'l'] as const).map((size) => (
        <Stepper key={size} size={size} defaultValue={1} min={0} />
      ))}
    </div>
  ),
};
