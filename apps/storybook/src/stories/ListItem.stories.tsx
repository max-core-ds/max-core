import { ListItem } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRight, Settings, Trash2, User } from 'lucide-react';

const meta = {
  title: 'Atoms/Selection/List Item',
  component: ListItem,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
  argTypes: {
    leftIcon: { control: false },
    rightIcon: { control: false },
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
      <ListItem leftIcon={<Settings />} rightIcon={<ChevronRight />}>
        Preferences
      </ListItem>
      <ListItem leftIcon={<Trash2 />} className="text-[var(--status-danger-default)]">
        Delete account
      </ListItem>
    </div>
  ),
};
