import { Button, FormGroup, Input } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Molecules/Inputs/Form Group',
  component: FormGroup,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
  args: { size: 'm' },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'] },
    premade: { control: 'boolean' },
  },
} satisfies Meta<typeof FormGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headline: 'Shipping address',
    description: 'Where should we send your order?',
    children: (
      <>
        <Input label="Street" placeholder="123 Main St" />
        <Input label="City" placeholder="Springfield" />
      </>
    ),
    action: (
      <>
        <Button variant="ghost">Cancel</Button>
        <Button>Save</Button>
      </>
    ),
  },
};

export const Premade: Story = {
  args: { ...Default.args, premade: true },
};
