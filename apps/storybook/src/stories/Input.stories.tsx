import { Input } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, X } from 'lucide-react';

const meta = {
  title: 'Molecules/Input',
  component: Input,
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'] },
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    disabled: { control: 'boolean' },
    leadingIcon: { control: false },
    trailingIcon: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    helper: "We'll never share your email.",
  },
};

// Show Leading / Show Trailing — icons take the size's Icon Size (16/20/24).
export const WithIcons: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    leadingIcon: <Mail />,
    trailingIcon: <X />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email address',
    defaultValue: 'not-an-email',
    errorMessage: 'Please enter a valid email address.',
  },
};

export const AllSizes: Story = {
  decorators: [
    (Story) => (
      <div className="flex w-96 flex-col gap-[var(--spacing-16)]">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <Input size="s" label="Small (40px)" placeholder="Small input" />
      <Input size="m" label="Medium (44px)" placeholder="Medium input" />
      <Input size="l" label="Large (56px)" placeholder="Large input" />
    </>
  ),
};
