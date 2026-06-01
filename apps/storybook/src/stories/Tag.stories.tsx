import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hash, Star, X } from 'lucide-react';
import { Tag } from '@max-core/react';

const meta = {
  title: 'Atoms/Tag',
  component: Tag,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['filled', 'outline', 'ghost'] },
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
      {(['filled', 'outline', 'ghost'] as const).map((variant) => (
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
