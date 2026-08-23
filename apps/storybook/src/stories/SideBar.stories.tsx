import { Avatar, EntityItem, ListItem, SideBar } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown, Home, PanelLeft, PieChart, Settings, Users } from 'lucide-react';

const meta = {
  title: 'Organisms/Side Bar',
  component: SideBar,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="h-[32rem]">{Story()}</div>],
  argTypes: {
    collapsed: { control: 'boolean' },
    topBar: { control: false },
    header: { control: false },
    subHeader: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof SideBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: {
    topBar: (
      <div className="flex items-center justify-between px-[var(--spacing-04)]">
        <span className="text-lg font-black text-[var(--text-primary)]">Max Core</span>
        <PanelLeft className="size-5 text-[var(--text-muted)]" />
      </div>
    ),
    header: (
      <EntityItem
        title="Max core v0.9"
        leading={<Avatar size="s" src="https://i.pravatar.cc/64?img=12" />}
        trailing={<ChevronDown className="size-4 text-[var(--text-muted)]" />}
      />
    ),
    subHeader: (
      <ListItem leftIcon={<PieChart />} rightIcon={<ChevronDown className="size-4" />}>
        Workspace
      </ListItem>
    ),
    children: (
      <>
        <ListItem leftIcon={<Home />}>Dashboard</ListItem>
        <ListItem leftIcon={<Users />}>Team</ListItem>
        <ListItem leftIcon={<PieChart />}>Analytics</ListItem>
        <ListItem leftIcon={<Settings />}>Settings</ListItem>
      </>
    ),
    footer: (
      <EntityItem
        title="Username"
        leading={<Avatar size="s" src="https://i.pravatar.cc/64?img=22" />}
        trailing={<ChevronDown className="size-4 text-[var(--text-muted)]" />}
      />
    ),
  },
};

export const Collapsed: Story = {
  args: { ...Expanded.args, collapsed: true },
};
