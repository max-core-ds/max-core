import { SearchBar } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta = {
  title: 'Atoms/Search Bar',
  component: SearchBar,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'] },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({ size }: { size?: 's' | 'm' | 'l' }) {
  const [value, setValue] = useState('');
  return (
    <SearchBar
      size={size}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => setValue('')}
      placeholder="Search products…"
    />
  );
}

export const Default: Story = { render: () => <Controlled /> };

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <Controlled size="s" />
      <Controlled size="m" />
      <Controlled size="l" />
    </div>
  ),
};
