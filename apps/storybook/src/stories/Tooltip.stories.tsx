import { Button, Tooltip } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  argTypes: {
    side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'Saved automatically',
    side: 'top',
    children: <Button variant="secondary">Hover me</Button>,
  },
};
