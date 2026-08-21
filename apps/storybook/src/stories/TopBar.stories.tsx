import { Avatar, IconOnlyButton, TopBar } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, Menu, Search } from 'lucide-react';

const meta = {
  title: 'Organisms/Top Bar',
  component: TopBar,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['desktop', 'mobile'] },
    leading: { control: false },
    center: { control: false },
    trailing: { control: false },
  },
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    variant: 'desktop',
    leading: <span className="text-lg font-black text-[var(--text-primary)]">Max Core</span>,
    trailing: (
      <>
        <IconOnlyButton variant="ghost" icon={<Search />} aria-label="Search" />
        <IconOnlyButton variant="ghost" icon={<Bell />} aria-label="Notifications" />
        <Avatar size="s" src="https://i.pravatar.cc/64?img=20" />
      </>
    ),
  },
};

export const Mobile: Story = {
  parameters: { layout: 'centered' },
  args: {
    variant: 'mobile',
    leading: <IconOnlyButton variant="ghost" icon={<Menu />} aria-label="Menu" />,
    center: <span className="font-bold text-[var(--text-primary)]">Home</span>,
    trailing: <IconOnlyButton variant="ghost" icon={<Bell />} aria-label="Notifications" />,
  },
};
