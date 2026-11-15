import { Range } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Molecules/Range',
  component: Range,
  parameters: { layout: 'padded' },
  // Top room for the value tooltip (gap 16 + bubble + arrow).
  decorators: [(Story) => <div className="w-96 pt-20">{Story()}</div>],
  args: { defaultValue: 40, min: 0, max: 100, showLabels: true, disabled: false },
  argTypes: {
    showTooltip: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Range>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTooltip: Story = { args: { showTooltip: true } };

export const Dual: Story = { args: { defaultValue: [20, 70] } };
