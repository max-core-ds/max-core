import { Avatar, EntityCard, EntityItem } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Molecules/Data Display/Entity Card',
  component: EntityCard,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
  argTypes: { active: { control: 'boolean' } },
} satisfies Meta<typeof EntityCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const item = (
  <EntityItem
    leading={<Avatar size="m" src="https://i.pravatar.cc/80?img=15" fallback="MG" />}
    title="Maria Garcia"
    subtitle="Engineering lead"
  />
);

export const Default: Story = { args: { children: item } };

export const Active: Story = { args: { children: item, active: true } };
