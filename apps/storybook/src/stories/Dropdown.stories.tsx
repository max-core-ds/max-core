import { Button, Dropdown } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy, Pencil, Share2, Trash2 } from 'lucide-react';

const meta = {
  title: 'Molecules/Overlays/Dropdown',
  component: Dropdown,
  parameters: { layout: 'centered' },
  argTypes: { trigger: { control: false }, items: { control: false } },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: <Button variant="secondary">Actions</Button>,
    items: [
      { label: 'Edit', icon: <Pencil />, onClick: () => {} },
      { label: 'Duplicate', icon: <Copy />, onClick: () => {} },
      { label: 'Share', icon: <Share2 />, onClick: () => {} },
      { label: 'Delete', icon: <Trash2 />, onClick: () => {}, disabled: true },
    ],
  },
};
