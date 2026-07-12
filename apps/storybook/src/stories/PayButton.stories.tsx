import { PayButton } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Buttons/Pay',
  component: PayButton,
  parameters: { layout: 'centered' },
  args: { children: 'Pay' },
  argTypes: {
    provider: { control: 'select', options: ['apple', 'google'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof PayButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ApplePay: Story = { args: { provider: 'apple', children: ' Pay' } };

export const GooglePay: Story = { args: { provider: 'google', children: 'G Pay' } };

export const Loading: Story = { args: { provider: 'apple', loading: true } };
