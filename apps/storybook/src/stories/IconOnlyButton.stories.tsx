import { IconOnlyButton } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heart } from 'lucide-react';

const meta = {
  title: 'Atoms/Buttons/Icon Only',
  component: IconOnlyButton,
  parameters: { layout: 'centered' },
  args: { icon: <Heart />, 'aria-label': 'Favorite' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    tone: { control: 'select', options: ['default', 'danger', 'success', 'warning'] },
    size: { control: 'select', options: ['s', 'm', 'l', 'xl'] },
    disabled: { control: 'boolean' },
    icon: { control: false },
  },
} satisfies Meta<typeof IconOnlyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-24)]">
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-[var(--spacing-12)]">
          <span className="w-20 text-xs uppercase text-[var(--text-muted)]">{variant}</span>
          {(['s', 'm', 'l', 'xl'] as const).map((size) => (
            <IconOnlyButton
              key={size}
              variant={variant}
              size={size}
              icon={<Heart />}
              aria-label="Favorite"
            />
          ))}
        </div>
      ))}
    </div>
  ),
};
