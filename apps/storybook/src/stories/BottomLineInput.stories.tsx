import { BottomLineInput } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { User } from 'lucide-react';

const meta = {
  title: 'Molecules/Bottom Line Input',
  component: BottomLineInput,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
  args: { label: 'Full name', placeholder: 'Jane Doe', size: 'm' },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'] },
    disabled: { control: 'boolean' },
    leadingIcon: { control: false },
    trailingIcon: { control: false },
  },
} satisfies Meta<typeof BottomLineInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { errorMessage: 'Enter your name' },
};

export const WithIcon: Story = { args: { leadingIcon: <User /> } };
