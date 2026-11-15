import { Avatar, type BottomNavItem, BottomNavigation } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Ellipsis, FolderOpen, Heart, House, Mail, Search, Settings } from 'lucide-react';
import { useState } from 'react';

// The master's items: Home, Explore, Inbox, Projects + the profile Avatar (no label).
const items: BottomNavItem[] = [
  { value: 'home', label: 'Home', icon: <House /> },
  { value: 'explore', label: 'Explore', icon: <Search /> },
  { value: 'inbox', label: 'Inbox', icon: <Mail />, dot: true },
  { value: 'projects', label: 'Projects', icon: <FolderOpen /> },
  {
    value: 'profile',
    label: 'Profile',
    hideLabel: true,
    icon: <Avatar size="s" src="https://i.pravatar.cc/64?img=20" />,
  },
];

const meta = {
  title: 'Organisms/Bottom Navigation',
  component: BottomNavigation,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-[393px]">{Story()}</div>],
  // items is required; the render-only stories manage their own selection state.
  args: { items },
} satisfies Meta<typeof BottomNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({ data = items }: { data?: BottomNavItem[] }) {
  const [value, setValue] = useState('home');
  return <BottomNavigation items={data} value={value} onValueChange={setValue} />;
}

// Type=Simple. Inbox carries the notification dot.
export const Default: Story = { render: () => <Controlled /> };

// Type=More — the trailing item opens an Item List above the bar.
export const More: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div className="flex h-80 w-[393px] items-end">{Story()}</div>],
  render: () => (
    <Controlled
      data={[
        ...items.slice(0, 4),
        {
          value: 'more',
          label: 'More',
          icon: <Ellipsis />,
          menu: [
            { label: 'Favorites', icon: <Heart /> },
            { label: 'Profile', icon: <Avatar size="xs" src="https://i.pravatar.cc/64?img=20" /> },
            { label: 'Settings', icon: <Settings /> },
          ],
        },
      ]}
    />
  ),
};
