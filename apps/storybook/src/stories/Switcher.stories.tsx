import { Switcher } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, List } from 'lucide-react';

const meta = {
  title: 'Molecules/Switcher',
  component: Switcher,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': 'Layout',
    defaultValue: 'monthly',
    items: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' },
    ],
  },
  argTypes: { items: { control: false } },
} satisfies Meta<typeof Switcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcons: Story = {
  args: {
    defaultValue: 'grid',
    items: [
      { value: 'grid', label: 'Grid', icon: <Grid /> },
      { value: 'list', label: 'List', icon: <List /> },
    ],
  },
};
