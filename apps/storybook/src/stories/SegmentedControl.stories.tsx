import { SegmentedControl } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { List, Map as MapIcon } from 'lucide-react';

const meta = {
  title: 'Atoms/Selection/Segmented Control',
  component: SegmentedControl,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': 'View',
    defaultValue: 'day',
    items: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ],
  },
  argTypes: { items: { control: false } },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcons: Story = {
  args: {
    defaultValue: 'list',
    items: [
      { value: 'list', label: 'List', icon: <List /> },
      { value: 'map', label: 'Map', icon: <MapIcon /> },
    ],
  },
};
