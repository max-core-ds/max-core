import { Tabs } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Molecules/Tabs',
  component: Tabs,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-[32rem]">{Story()}</div>],
  argTypes: { items: { control: false } },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fill: 'underline',
    defaultValue: 'overview',
    items: [
      {
        value: 'overview',
        label: 'Overview',
        content: <p className="text-[var(--text-secondary)]">Overview panel</p>,
      },
      {
        value: 'activity',
        label: 'Activity',
        content: <p className="text-[var(--text-secondary)]">Activity panel</p>,
      },
      {
        value: 'billing',
        label: 'Billing',
        disabled: true,
      },
      {
        value: 'settings',
        label: 'Settings',
        content: <p className="text-[var(--text-secondary)]">Settings panel</p>,
      },
    ],
  },
};
