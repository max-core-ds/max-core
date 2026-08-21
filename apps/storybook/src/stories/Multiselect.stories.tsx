import { Multiselect } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const items = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'angular', label: 'Angular' },
];

const meta = {
  title: 'Atoms/Multiselect',
  component: Multiselect,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
  args: { items, placeholder: 'Add frameworks…', 'aria-label': 'Frameworks' },
  argTypes: { items: { control: false } },
} satisfies Meta<typeof Multiselect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  args: { defaultValue: items.filter((i) => i.value === 'react' || i.value === 'svelte') },
};
