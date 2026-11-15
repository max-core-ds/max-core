import { Avatar, EntityCard, EntityItem, Thumbnail } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Molecules/Entity Card',
  component: EntityCard,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
  argTypes: {
    active: { control: 'boolean' },
    chevron: { control: 'boolean' },
    collapsed: { control: 'boolean' },
  },
} satisfies Meta<typeof EntityCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <EntityItem
        leading={<Avatar size="s" src="https://i.pravatar.cc/80?img=15" fallback="MG" />}
        title="Maria Garcia"
      />
    ),
  },
};

// Workspace switcher trigger.
export const Workspace: Story = {
  args: {
    children: (
      <EntityItem
        type="workspace"
        leading={<Thumbnail shape="circle" size="s" src="https://picsum.photos/seed/max/64" />}
        title="Max core v0.9"
        subtitle="First Max core model"
      />
    ),
  },
};
