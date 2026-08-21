import { Textarea } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Textarea',
  component: Textarea,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
  args: { label: 'Message', placeholder: 'Write something…', size: 'm' },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { errorMessage: 'This field is required', defaultValue: '' },
};
