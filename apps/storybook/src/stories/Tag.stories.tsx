import { Tag } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hash, Star, X } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Atoms/Tag',
  component: Tag,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'outline', 'ghost'] },
    tone: { control: 'select', options: ['default', 'danger', 'success', 'warning'] },
    size: { control: 'select', options: ['s', 'm'] },
    selected: { control: 'boolean' },
    leftIcon: { control: false },
    rightIcon: { control: false },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Design' } };

export const WithLeftIcon: Story = {
  args: { children: 'Frontend', leftIcon: <Hash size={12} /> },
};

export const Removable: Story = {
  args: { children: 'Filter applied', rightIcon: <X size={12} /> },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Featured',
    leftIcon: <Star size={12} />,
    rightIcon: <X size={12} />,
    variant: 'outline',
  },
};

export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-24)]">
      {(['primary', 'outline', 'ghost'] as const).map((variant) => (
        <section key={variant} className="flex flex-col gap-[var(--spacing-08)]">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text-muted)]">
            {variant}
          </h3>
          <div className="flex items-center gap-[var(--spacing-08)]">
            {(['default', 'danger', 'success', 'warning'] as const).map((tone) => (
              <Tag key={tone} variant={variant} tone={tone}>
                {tone}
              </Tag>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

// Passing `selected` (or onClick) makes the tag a clickable filter chip: a
// toggle button with hover/pressed overlay and focus ring. Selected only
// applies to the Primary variant: Off = subtle fill, On = solid.
function FilterChips() {
  const tones = ['default', 'danger', 'success', 'warning'] as const;
  const [picked, setPicked] = useState<string[]>(['default']);
  const toggle = (tone: string) =>
    setPicked((p) => (p.includes(tone) ? p.filter((t) => t !== tone) : [...p, tone]));
  return (
    <div className="flex items-center gap-[var(--spacing-08)]">
      {tones.map((tone) => (
        <Tag key={tone} tone={tone} selected={picked.includes(tone)} onClick={() => toggle(tone)}>
          {tone}
        </Tag>
      ))}
      <Tag selected={false} disabled>
        disabled
      </Tag>
    </div>
  );
}

export const Selected: Story = {
  parameters: { layout: 'padded' },
  render: () => <FilterChips />,
};
