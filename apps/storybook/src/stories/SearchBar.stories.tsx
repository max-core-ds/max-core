import { Button, SearchBar } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta = {
  title: 'Molecules/Search Bar',
  component: SearchBar,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({ size, disabled }: { size?: 's' | 'm' | 'l' | null; disabled?: boolean }) {
  const [value, setValue] = useState('');
  return (
    <SearchBar
      size={size}
      disabled={disabled}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => setValue('')}
      placeholder="Search products…"
    />
  );
}

export const Default: Story = {
  render: (args) => <Controlled size={args.size} disabled={args.disabled} />,
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <Controlled size="s" />
      <Controlled size="m" />
      <Controlled size="l" />
    </div>
  ),
};

// Button=On mode — a size-S Standard Button at every size (as the master).
export const WithButton: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <SearchBar size="s" placeholder="Search…" action={<Button size="s">Search</Button>} />
      <SearchBar size="m" placeholder="Search…" action={<Button size="s">Search</Button>} />
      <SearchBar size="l" placeholder="Search…" action={<Button size="s">Search</Button>} />
    </div>
  ),
};
