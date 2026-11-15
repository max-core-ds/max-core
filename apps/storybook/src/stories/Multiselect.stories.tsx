import { Multiselect } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const items = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'angular', label: 'Angular' },
];

const meta = {
  title: 'Molecules/Multiselect',
  component: Multiselect,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
  args: { items, placeholder: 'Add frameworks…', label: 'Frameworks', size: 'm' },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'] },
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    mode: { control: 'inline-radio', options: ['typeahead', 'list'] },
    disabled: { control: 'boolean' },
    items: { control: false },
  },
} satisfies Meta<typeof Multiselect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  args: { defaultValue: items.filter((i) => i.value === 'react' || i.value === 'svelte') },
};

export const WithError: Story = {
  args: { label: 'Frameworks', errorMessage: 'Select at least one framework.' },
};

// The Figma master: chips-only field; the list has its own search + Select all.
export const ListMode: Story = {
  args: { mode: 'list', placeholder: 'Select frameworks' },
};
