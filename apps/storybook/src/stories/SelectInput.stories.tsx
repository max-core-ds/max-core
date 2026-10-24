import { SelectInput } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Globe } from 'lucide-react';

const items = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ro', label: 'Romania' },
  { value: 'jp', label: 'Japan' },
];

const meta = {
  title: 'Molecules/Select Input',
  component: SelectInput,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
  args: { items, placeholder: 'Choose a country', label: 'Country', size: 'm' },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'] },
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    disabled: { control: 'boolean' },
    items: { control: false },
    leadingIcon: { control: false },
  },
} satisfies Meta<typeof SelectInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = { args: { defaultValue: 'ro' } };

export const WithIcon: Story = { args: { leadingIcon: <Globe /> } };

export const WithError: Story = {
  args: { label: 'Country', errorMessage: 'Please select a country.' },
};
