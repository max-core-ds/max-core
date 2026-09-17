import { Checkbox } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  args: { label: 'Accept terms', size: 'm' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm'] },
    validation: { control: 'inline-radio', options: ['default', 'error', 'warning', 'success'] },
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    helperText: { control: 'text' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { defaultChecked: true } };

export const WithHelper: Story = {
  args: {
    label: 'Email me offers',
    helperText: 'You can unsubscribe anytime.',
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: { label: 'Select all', indeterminate: true },
};

export const WithError: Story = {
  args: { label: 'Accept terms', errorMessage: 'You must accept the terms to continue.' },
};

export const Sizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <Checkbox size="s" label="Small" defaultChecked />
      <Checkbox size="m" label="Medium" defaultChecked />
    </div>
  ),
};

// Validation recolors the box (border + checked fill).
export const Validations: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      {(['default', 'error', 'warning', 'success'] as const).map((validation) => (
        <Checkbox key={validation} validation={validation} label={validation} defaultChecked />
      ))}
    </div>
  ),
};
