import { Switch } from '@max-core/react';
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

export const Default: Story = { args: { defaultChecked: true } };

export const WithLabel: Story = {
  args: {
    label: 'Wi-Fi',
    helperText: 'Connect automatically to known networks',
    defaultChecked: true,
  },
};

export const Sizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-[var(--spacing-16)]">
      <Switch size="s" defaultChecked />
      <Switch size="m" defaultChecked />
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
