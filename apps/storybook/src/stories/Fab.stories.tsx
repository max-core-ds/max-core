import { Fab } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image, Plus, Share2, UserPlus } from 'lucide-react';

const meta = {
  title: 'Atoms/FAB',
  component: Fab,
  parameters: { layout: 'centered' },
  args: { icon: <Plus />, 'aria-label': 'Create' },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'xl'] },
    icon: { control: false },
    actions: { control: false },
  },
} satisfies Meta<typeof Fab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-end gap-[var(--spacing-24)]">
      {(['s', 'm', 'xl'] as const).map((size) => (
        <Fab key={size} size={size} icon={<Plus />} aria-label="Create" />
      ))}
    </div>
  ),
};

export const SpeedDial: Story = {
  parameters: { layout: 'padded' },
  args: {
    icon: <Plus />,
    actions: [
      { label: 'New photo', icon: <Image />, onClick: () => {} },
      { label: 'Invite people', icon: <UserPlus />, onClick: () => {} },
      { label: 'Share', icon: <Share2 />, onClick: () => {} },
    ],
  },
};
