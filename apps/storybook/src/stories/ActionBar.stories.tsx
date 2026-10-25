import { ActionBar, Button } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Molecules/Action Bar',
  component: ActionBar,
  parameters: { layout: 'padded' },
  argTypes: {
    direction: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-96">
      <ActionBar {...args}>
        <Button variant="secondary">Cancel</Button>
        <Button>Confirm</Button>
      </ActionBar>
    </div>
  ),
  args: { direction: 'horizontal' },
};

export const Vertical: Story = {
  render: (args) => (
    <div className="w-64">
      <ActionBar {...args}>
        <Button>Save changes</Button>
        <Button variant="secondary">Save as draft</Button>
        <Button variant="ghost">Discard</Button>
      </ActionBar>
    </div>
  ),
  args: { direction: 'vertical' },
};
