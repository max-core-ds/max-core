import { Avatar, Badge, EntityItem } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRight } from 'lucide-react';

const meta = {
  title: 'Molecules/Data Display/Entity Item',
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
    leading: <Avatar size="m" src="https://i.pravatar.cc/80?img=12" fallback="JD" />,
    trailing: <ChevronRight className="text-[var(--text-muted)]" />,
  },
};

export const WithBadge: Story = {
  args: {
    leading: <Avatar size="m" fallback="AT" />,
    title: 'Alex Turner',
    subtitle: 'Product designer',
    trailing: <Badge tone="success">Active</Badge>,
  },
};
