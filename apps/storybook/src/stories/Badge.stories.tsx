import { Badge } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Data Display/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline', 'ghost'] },
    tone: { control: 'select', options: ['default', 'danger', 'success', 'warning'] },
    size: { control: 'select', options: ['s', 'm', 'l'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Badge label' } };

// The full Figma matrix: 3 variants × 4 tones × 3 sizes.
export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-24)]">
      {(['default', 'outline', 'ghost'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-[var(--spacing-12)]">
          <span className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            {variant}
          </span>
          {(['default', 'danger', 'success', 'warning'] as const).map((tone) => (
            <div key={tone} className="flex items-center gap-[var(--spacing-12)]">
              <span className="w-20 text-xs uppercase text-[var(--text-muted)]">{tone}</span>
              {(['s', 'm', 'l'] as const).map((size) => (
                <Badge key={size} variant={variant} tone={tone} size={size}>
                  Badge label
                </Badge>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
