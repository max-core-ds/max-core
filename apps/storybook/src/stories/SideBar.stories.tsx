import { Avatar, ListItem, SideBar } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home, PieChart, Settings, Users } from 'lucide-react';

const meta = {
  title: 'Organisms/Side Bar',
  component: SideBar,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="h-[28rem]">{Story()}</div>],
  argTypes: {
    collapsed: { control: 'boolean' },
    header: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof SideBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: {
    header: (
      <span className="px-[var(--spacing-12)] text-lg font-black text-[var(--text-primary)]">
        Max Core
      </span>
    ),
    children: (
      <>
        <ListItem leftIcon={<Home />}>Dashboard</ListItem>
        <ListItem leftIcon={<Users />}>Team</ListItem>
        <ListItem leftIcon={<PieChart />}>Analytics</ListItem>
        <ListItem leftIcon={<Settings />}>Settings</ListItem>
      </>
    ),
    footer: <Avatar size="m" src="https://i.pravatar.cc/64?img=22" />,
  },
};

export const Collapsed: Story = {
  args: { ...Expanded.args, collapsed: true },
};
