import { PayButton } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Buttons/Pay',
  component: PayButton,
  parameters: { layout: 'centered' },
  args: { children: 'Pay', color: 'dark' },
  argTypes: {
    color: { control: 'inline-radio', options: ['dark', 'light'] },
    provider: { control: 'inline-radio', options: ['apple', 'google'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof PayButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ApplePay: Story = { args: { provider: 'apple', children: ' Pay' } };

export const GooglePay: Story = { args: { provider: 'google', children: 'G Pay' } };

// Color is independent of provider: each renders in both a light and dark fill.
export const Colors: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      {(['dark', 'light'] as const).map((color) => (
        <div key={color} className="flex items-center gap-[var(--spacing-12)]">
          <PayButton color={color} provider="apple">
            {' Pay'}
          </PayButton>
          <PayButton color={color} provider="google">
            G Pay
          </PayButton>
        </div>
      ))}
    </div>
  ),
};

export const Loading: Story = { args: { provider: 'apple', loading: true } };
