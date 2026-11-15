import { AvatarGroup } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const avatars = [
  { src: 'https://i.pravatar.cc/80?img=1', alt: 'A' },
  { src: 'https://i.pravatar.cc/80?img=2', alt: 'B' },
  { src: 'https://i.pravatar.cc/80?img=3', alt: 'C' },
  { fallback: 'JD' },
  { src: 'https://i.pravatar.cc/80?img=5', alt: 'E' },
  { src: 'https://i.pravatar.cc/80?img=6', alt: 'F' },
];

const meta = {
  title: 'Molecules/Avatar Group',
  component: AvatarGroup,
  parameters: { layout: 'centered' },
  args: { avatars, size: 'xs' },
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
    avatars: { control: false },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithOverflow: Story = { args: { max: 4 } };
