import { SelectInput } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const items = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ro', label: 'Romania' },
  { value: 'jp', label: 'Japan' },
];

const meta = {
  title: 'Atoms/Forms/Select Input',
  component: SelectInput,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
  args: { items, placeholder: 'Choose a country', 'aria-label': 'Country', size: 'm' },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'] },
    items: { control: false },
  },
} satisfies Meta<typeof SelectInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = { args: { defaultValue: 'ro' } };
