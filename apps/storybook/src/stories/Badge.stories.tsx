import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@max-core/react';

const meta = {
  title: 'Atoms/Data Display/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: {
    tone: { control: 'select', options: ['default', 'danger', 'success', 'warning', 'neutral'] },
    size: { control: 'select', options: ['s', 'm', 'l'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: '12' } };

export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-16)]">
      {(['default', 'danger', 'success', 'warning', 'neutral'] as const).map((tone) => (
        <div key={tone} className="flex items-center gap-[var(--spacing-12)]">
          <span className="w-20 text-xs uppercase text-[var(--text-muted)]">{tone}</span>
          {(['s', 'm', 'l'] as const).map((size) => (
            <Badge key={size} tone={tone} size={size}>
              {size === 's' ? '3' : 'Label'}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};
