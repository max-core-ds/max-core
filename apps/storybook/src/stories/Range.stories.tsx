import { Range } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Molecules/Inputs/Range',
  component: Range,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-96 pt-8">{Story()}</div>],
  args: { defaultValue: 40, min: 0, max: 100, showLabels: true },
  argTypes: {
    showTooltip: { control: 'boolean' },
    showLabels: { control: 'boolean' },
  },
} satisfies Meta<typeof Range>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTooltip: Story = { args: { showTooltip: true } };

export const Dual: Story = { args: { defaultValue: [20, 70] } };
