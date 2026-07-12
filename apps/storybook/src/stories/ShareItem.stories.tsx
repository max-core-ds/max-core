import { Avatar, ShareItem } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy, Link, Mail, Trash2 } from 'lucide-react';

const meta = {
  title: 'Organisms/Data Display/Share Item',
  component: ShareItem,
  parameters: { layout: 'centered' },
  args: { label: 'Copy link', icon: <Copy /> },
  argTypes: {
    tone: { control: 'select', options: ['default', 'success', 'warning', 'danger'] },
    icon: { control: false },
    avatar: { control: false },
  },
} satisfies Meta<typeof ShareItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Row: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex gap-[var(--spacing-16)]">
      <ShareItem label="Copy link" icon={<Link />} />
      <ShareItem label="Email" icon={<Mail />} tone="success" />
      <ShareItem label="Delete" icon={<Trash2 />} tone="danger" />
      <ShareItem label="Jane" avatar={<Avatar size="l" src="https://i.pravatar.cc/64?img=30" />} />
    </div>
  ),
};
