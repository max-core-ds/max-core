import {
  Avatar,
  Dropdown,
  EntityCard,
  EntityItem,
  ListItem,
  SideBar,
  type SideBarProps,
  SideBarTrigger,
  Thumbnail,
  useRailCollapsed,
} from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileText, Home, LifeBuoy, PanelLeft, PieChart, Plus, Settings, Users } from 'lucide-react';
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

// The Top Bar slot content: wordmark + collapse toggle. The rail lays it out (row
// when expanded, centred column when collapsed); the wordmark hides when
// collapsed. SideBarTrigger flips the rail via context.
function Brand() {
  const collapsed = useRailCollapsed();
  return (
    <>
      {!collapsed && (
        <span className="text-lg font-black text-[var(--text-primary)]">Max Core</span>
      )}
      <SideBarTrigger>
        <PanelLeft />
      </SideBarTrigger>
    </>
  );
}

// The master's default slot content: workspace Dropdown (Entity Card trigger) in
// the Header, List Items in the Body, the user's Entity Card in the Footer.
// Sub Header is hidden by default, as in the master.
const slots = {
  topBar: <Brand />,
  header: (
    <Dropdown
      trigger={
        <EntityCard className="w-full">
          <EntityItem
            type="workspace"
            title="Max core v0.9"
            leading={<Thumbnail shape="circle" size="s" src="https://picsum.photos/seed/max/64" />}
          />
        </EntityCard>
      }
      items={[
        { label: 'Max core v0.9', onClick: () => {} },
        { label: 'New workspace', icon: <Plus />, onClick: () => {} },
      ]}
    />
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
    <EntityCard className="w-full">
      <EntityItem
        title="Username"
        leading={<Avatar size="s" src="https://i.pravatar.cc/64?img=22" />}
      />
    </EntityCard>
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
