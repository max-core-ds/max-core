import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '@max-core/react';

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleSrc = 'https://i.pravatar.cc/150?img=12';

export const Default: Story = {
  args: { src: sampleSrc, alt: 'Jane Doe', fallback: 'JD' },
};

export const AllSizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-end gap-[var(--spacing-16)]">
      {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-[var(--spacing-08)]">
          <Avatar size={size} fallback="MX" src={sampleSrc} alt="Max" />
          <span className="text-xs uppercase text-[var(--text-muted)]">{size}</span>
        </div>
      ))}
    </div>
  ),
};
