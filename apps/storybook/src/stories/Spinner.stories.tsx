import { Spinner } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l', 'xl'] },
    tone: { control: 'inline-radio', options: ['accent', 'neutral', 'on-accent'] },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { size: 'm', tone: 'accent' } };

export const AllSizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-[var(--spacing-24)]">
      {(['s', 'm', 'l', 'xl'] as const).map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </div>
  ),
};

export const Tones: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-[var(--spacing-24)]">
      <Spinner tone="accent" size="l" />
      <Spinner tone="neutral" size="l" />
      <div className="rounded-[var(--radius-md)] bg-[var(--accent-default)] p-[var(--spacing-12)]">
        <Spinner tone="on-accent" size="l" />
      </div>
    </div>
  ),
};
