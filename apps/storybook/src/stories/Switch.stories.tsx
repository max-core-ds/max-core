import { Switch } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  args: { size: 'm' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm'] },
    validation: { control: 'inline-radio', options: ['default', 'error', 'warning', 'success'] },
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// A bare switch still needs a name — `aria-label` when there's no visible label.
export const Default: Story = { args: { 'aria-label': 'Notifications', defaultChecked: true } };

export const WithLabel: Story = {
  args: {
    label: 'Wi-Fi',
    helperText: 'Connect automatically to known networks',
    defaultChecked: true,
  },
};

export const WithError: Story = {
  args: { label: 'Enable 2FA', errorMessage: 'Two-factor authentication is required.' },
};

export const Sizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-[var(--spacing-16)]">
      <Switch size="s" aria-label="Size S" defaultChecked />
      <Switch size="m" aria-label="Size M" defaultChecked />
    </div>
  ),
};

// Validation recolors the track when on.
export const Validations: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      {(['default', 'error', 'warning', 'success'] as const).map((validation) => (
        <Switch key={validation} validation={validation} label={validation} defaultChecked />
      ))}
    </div>
  ),
};
