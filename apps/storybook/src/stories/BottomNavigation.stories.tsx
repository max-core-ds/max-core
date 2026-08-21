import { BottomNavigation } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heart, Home, Search, User } from 'lucide-react';
import { useState } from 'react';

const items = [
  { value: 'home', label: 'Home', icon: <Home /> },
  { value: 'search', label: 'Search', icon: <Search /> },
  { value: 'saved', label: 'Saved', icon: <Heart /> },
  { value: 'profile', label: 'Profile', icon: <User /> },
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

function Controlled() {
  const [value, setValue] = useState('home');
  return <BottomNavigation items={items} value={value} onValueChange={setValue} />;
}

export const Default: Story = { render: () => <Controlled /> };
