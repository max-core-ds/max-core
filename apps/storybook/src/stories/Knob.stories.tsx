import { Knob } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Knob',
  component: Knob,
  parameters: { layout: 'centered' },
  argTypes: {
    state: { control: 'inline-radio', options: ['default', 'hover', 'pressed'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Knob>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-[var(--spacing-24)]">
      {(['default', 'hover', 'pressed'] as const).map((state) => (
        <div key={state} className="flex flex-col items-center gap-[var(--spacing-08)]">
          <Knob state={state} />
          <span className="text-xs uppercase text-[var(--text-muted)]">{state}</span>
        </div>
      ))}
      <div className="flex flex-col items-center gap-[var(--spacing-08)]">
        <Knob disabled />
        <span className="text-xs uppercase text-[var(--text-muted)]">disabled</span>
      </div>
    </div>
  ),
};
