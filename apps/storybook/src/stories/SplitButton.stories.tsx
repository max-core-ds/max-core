import { SplitButton } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy, Save, Share2, Trash2 } from 'lucide-react';

const items = [
  { label: 'Save as draft', icon: <Save />, onClick: () => {} },
  { label: 'Duplicate', icon: <Copy />, onClick: () => {} },
  { label: 'Share', icon: <Share2 />, onClick: () => {} },
  { label: 'Delete', icon: <Trash2 />, onClick: () => {} },
];

const meta = {
  title: 'Atoms/Split Button',
  component: SplitButton,
  parameters: { layout: 'centered' },
  args: { children: 'Save', items },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    tone: { control: 'select', options: ['default', 'danger', 'success', 'warning'] },
    size: { control: 'select', options: ['s', 'm', 'l', 'xl'] },
    disabled: { control: 'boolean' },
    items: { control: false },
  },
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-end gap-[var(--spacing-16)]">
      {(['s', 'm', 'l', 'xl'] as const).map((size) => (
        <SplitButton key={size} size={size} items={items}>
          Save
        </SplitButton>
      ))}
    </div>
  ),
};
