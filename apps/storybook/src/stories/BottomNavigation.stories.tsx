import { Avatar, BottomNavigation } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heart, Home, MoreHorizontal, Search, User } from 'lucide-react';
import { useState } from 'react';

const items = [
  { value: 'home', label: 'Home', icon: <Home /> },
  { value: 'search', label: 'Search', icon: <Search /> },
  { value: 'saved', label: 'Saved', icon: <Heart />, dot: true },
  { value: 'profile', label: 'Profile', icon: <User />, disabled: true },
];

const meta = {
  title: 'Organisms/Bottom Navigation',
  component: BottomNavigation,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
  // items is required; the render-only story manages its own selection state.
  args: { items },
} satisfies Meta<typeof BottomNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({ data = items }: { data?: typeof items }) {
  const [value, setValue] = useState('home');
  return <BottomNavigation items={data} value={value} onValueChange={setValue} />;
}

// 'Saved' carries a notification dot; 'Profile' is disabled (dimmed).
export const Default: Story = { render: () => <Controlled /> };

// Type=More — the trailing item is a "More" overflow trigger.
export const More: Story = {
  render: () => (
    <Controlled
      data={[
        { value: 'home', label: 'Home', icon: <Home /> },
        { value: 'search', label: 'Search', icon: <Search /> },
        { value: 'saved', label: 'Saved', icon: <Heart /> },
        { value: 'more', label: 'More', icon: <MoreHorizontal /> },
      ]}
    />
  ),
};

// Profile slot swaps the icon for an Avatar (Bottom Navigation Avatar pattern).
export const WithProfileAvatar: Story = {
  render: () => (
    <Controlled
      data={[
        { value: 'home', label: 'Home', icon: <Home /> },
        { value: 'search', label: 'Search', icon: <Search /> },
        { value: 'saved', label: 'Saved', icon: <Heart /> },
        {
          value: 'profile',
          label: 'Profile',
          icon: <Avatar size="s" src="https://i.pravatar.cc/64?img=20" />,
        },
      ]}
    />
  ),
};
