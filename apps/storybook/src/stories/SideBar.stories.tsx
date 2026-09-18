import {
  Avatar,
  EntityItem,
  ListItem,
  SideBar,
  type SideBarProps,
  SideBarTrigger,
  useRailCollapsed,
} from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChevronDown,
  FileText,
  Home,
  LifeBuoy,
  PanelLeft,
  PieChart,
  Settings,
  Users,
} from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Organisms/Side Bar',
  component: SideBar,
  parameters: { layout: 'fullscreen' },
  // h-full so the rail fills the (100%-height) preview and a tall nav scrolls.
  decorators: [(Story) => <div className="h-screen p-[var(--spacing-16)]">{Story()}</div>],
  argTypes: {
    collapsed: { control: false },
    defaultCollapsed: { control: 'boolean' },
    topBar: { control: false },
    header: { control: false },
    subHeader: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof SideBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// A collapse-aware brand row: shows the wordmark when expanded, and the toggle
// (SideBarTrigger, wired to the rail via context) in both states. This is the
// intended way to compose the topBar slot.
function Brand() {
  const collapsed = useRailCollapsed();
  return (
    <div
      className={`flex items-center px-[var(--spacing-04)] ${
        collapsed ? 'justify-center' : 'justify-between'
      }`}
    >
      {!collapsed && (
        <span className="text-lg font-black text-[var(--text-primary)]">Max Core</span>
      )}
      <SideBarTrigger>
        <PanelLeft />
      </SideBarTrigger>
    </div>
  );
}

const slots = {
  topBar: <Brand />,
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
      <ListItem leftIcon={<Home />} active>
        Dashboard
      </ListItem>
      <ListItem leftIcon={<Users />}>Team</ListItem>
      <ListItem leftIcon={<PieChart />}>Analytics</ListItem>
      <ListItem leftIcon={<FileText />}>Reports</ListItem>
      <ListItem leftIcon={<LifeBuoy />}>Support</ListItem>
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
} satisfies Partial<SideBarProps>;

// Uncontrolled + interactive: click the toggle in the topBar to collapse/expand.
export const Expanded: Story = {
  args: { ...slots },
};

// Uncontrolled, seeded collapsed. Header/subHeader/nav/footer go icon-only via
// the rail context; the same toggle expands it.
export const Collapsed: Story = {
  args: { ...slots, defaultCollapsed: true },
};

// Controlled: the consumer owns `collapsed` (e.g. persisted or route-driven).
export const Controlled: Story = {
  render: (args) => {
    const [collapsed, setCollapsed] = useState(false);
    return <SideBar {...args} collapsed={collapsed} onCollapsedChange={setCollapsed} />;
  },
  args: { ...slots },
};
