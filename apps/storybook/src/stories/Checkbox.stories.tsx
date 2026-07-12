import { Checkbox } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Selection/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  args: { label: 'Accept terms', size: 'm' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm'] },
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { defaultChecked: true } };

export const Sizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <Checkbox size="s" label="Small" defaultChecked />
      <Checkbox size="m" label="Medium" defaultChecked />
    </div>
  ),
};
