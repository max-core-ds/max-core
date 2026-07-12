import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Check, Download, Plus } from 'lucide-react';
import { Button } from '@max-core/react';

const meta = {
  title: 'Atoms/Buttons/Standard',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    tone: { control: 'select', options: ['default', 'danger', 'success', 'warning'] },
    size: { control: 'select', options: ['s', 'm', 'l', 'xl'] },
    disabled: { control: 'boolean' },
    leftIcon: { control: false },
    rightIcon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: 'Save changes' },
};

export const WithLeftIcon: Story = {
  args: { children: 'Add user', leftIcon: <Plus size={16} /> },
};

export const WithRightIcon: Story = {
  args: { children: 'Continue', rightIcon: <ArrowRight size={16} /> },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Download',
    leftIcon: <Download size={16} />,
    rightIcon: <Check size={16} />,
  },
};

export const IconsAcrossSizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-end gap-[var(--spacing-12)]">
      <Button size="s" leftIcon={<Plus size={14} />}>
        Add
      </Button>
      <Button size="m" leftIcon={<Plus size={16} />}>
        Add
      </Button>
      <Button size="l" leftIcon={<Plus size={20} />}>
        Add
      </Button>
      <Button size="xl" leftIcon={<Plus size={24} />}>
        Add
      </Button>
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-32)]">
      {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
        <section key={variant} className="flex flex-col gap-[var(--spacing-12)]">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text-muted)]">
            {variant}
          </h3>
          {(['default', 'danger', 'success', 'warning'] as const).map((tone) => (
            <div key={tone} className="flex items-center gap-[var(--spacing-12)]">
              {(['s', 'm', 'l', 'xl'] as const).map((size) => (
                <Button key={size} variant={variant} tone={tone} size={size}>
                  {tone === 'default' ? 'Button' : tone}
                </Button>
              ))}
            </div>
          ))}
        </section>
      ))}
    </div>
  ),
};
