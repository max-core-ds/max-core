import { Avatar, Pin } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MapPin } from 'lucide-react';

const meta = {
  title: 'Molecules/Pin',
  component: Pin,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Pin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithIcon: Story = { args: { children: <MapPin /> } };

export const WithInitials: Story = { args: { children: 'JD' } };

export const WithAvatar: Story = {
  args: { children: <Avatar size="m" src="https://i.pravatar.cc/80?img=8" /> },
};
