import { Avatar, Pin } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { User } from 'lucide-react';

const meta = {
  title: 'Molecules/Pin',
  component: Pin,
  parameters: { layout: 'centered' },
  argTypes: { type: { control: false } },
} satisfies Meta<typeof Pin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Icon: Story = { args: { children: <User /> } };

export const WithAvatar: Story = {
  args: { type: 'avatar', children: <Avatar size="m" src="https://i.pravatar.cc/80?img=8" /> },
};
