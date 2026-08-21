import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@max-core/react';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'] },
    disabled: { control: 'boolean' },
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
      <Input size="s" label="Small (32px)" placeholder="Small input" />
      <Input size="m" label="Medium (40px)" placeholder="Medium input" />
      <Input size="l" label="Large (48px)" placeholder="Large input" />
    </>
  ),
};
