import { ListItem } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown, ChevronRight, Settings, Trash2, User } from 'lucide-react';

const meta = {
  title: 'Atoms/List Item',
  component: ListItem,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
  argTypes: {
    leftIcon: { control: false },
    rightIcon: { control: false },
    supportText: { control: 'text' },
    level: { control: 'inline-radio', options: [0, 1, 2] },
    active: { control: 'boolean' },
    collapsed: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Account settings', leftIcon: <Settings />, rightIcon: <ChevronRight /> },
};

export const List: Story = {
  render: () => (
    <div className="flex flex-col">
      <ListItem leftIcon={<User />} rightIcon={<ChevronRight />}>
        Profile
      </ListItem>
      <ListItem leftIcon={<Settings />} rightIcon={<ChevronRight />} active>
        Preferences
      </ListItem>
      <ListItem leftIcon={<Trash2 />} className="text-[var(--status-danger-default)]">
        Delete account
      </ListItem>
    </div>
  ),
};

// Hover / press the rows to see the accent/subtle and accent/active fills;
// the selected row keeps the accent/default fill.
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <ListItem leftIcon={<Settings />} rightIcon={<ChevronDown />}>
        Default
      </ListItem>
      <ListItem leftIcon={<Settings />} rightIcon={<ChevronDown />} active>
        Active (selected)
      </ListItem>
      <ListItem leftIcon={<Settings />} rightIcon={<ChevronDown />} disabled>
        Disabled
      </ListItem>
    </div>
  ),
};

// Nested rows — Level 1/2 indent before the leading icon, with support text.
export const Nested: Story = {
  render: () => (
    <div className="flex flex-col">
      <ListItem leftIcon={<Settings />} rightIcon={<ChevronDown />} supportText="3 sections">
        Settings
      </ListItem>
      <ListItem level={1} leftIcon={<User />} rightIcon={<ChevronDown />}>
        Account
      </ListItem>
      <ListItem level={2} leftIcon={<User />} supportText="Name, avatar, email" active>
        Profile
      </ListItem>
    </div>
  ),
};

// Icon-only rail mode — label + trailing indicator are hidden.
export const Collapsed: Story = {
  render: () => (
    <div className="flex w-14 flex-col gap-2">
      <ListItem leftIcon={<User />} collapsed aria-label="Profile" />
      <ListItem leftIcon={<Settings />} collapsed active aria-label="Preferences" />
    </div>
  ),
};
