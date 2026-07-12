import { Knob } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Display/Knob',
  component: Knob,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Knob>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
