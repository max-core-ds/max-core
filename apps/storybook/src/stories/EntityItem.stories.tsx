import { Avatar, Badge, EntityItem, Thumbnail } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRight } from 'lucide-react';

const meta = {
  title: 'Molecules/Entity Item',
  component: EntityItem,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
  args: { title: 'Jane Doe', subtitle: 'jane@example.com' },
  argTypes: { leading: { control: false }, trailing: { control: false } },
} satisfies Meta<typeof EntityItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    leading: <Avatar size="s" src="https://i.pravatar.cc/64?img=12" fallback="JD" />,
    trailing: <ChevronRight className="text-[var(--text-muted)]" />,
  },
};

export const WithBadge: Story = {
  args: {
    leading: <Avatar size="s" fallback="AT" />,
    title: 'Alex Turner',
    subtitle: 'Product designer',
    trailing: <Badge tone="success">Active</Badge>,
  },
};

export const Workspace: Story = {
  args: {
    type: 'workspace',
    leading: <Thumbnail shape="circle" size="s" src="https://picsum.photos/seed/max/64" />,
    title: 'Max core v0.9',
    subtitle: 'First Max core model',
  },
};
