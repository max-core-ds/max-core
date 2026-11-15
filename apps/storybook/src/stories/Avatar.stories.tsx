import { Avatar } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
    status: {
      control: 'select',
      options: [undefined, 'default', 'busy', 'away', 'dnd', 'offline'],
    },
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

// Text variant — initials on an accent/default fill with on-accent text.
export const Initials: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-end gap-[var(--spacing-16)]">
      {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-[var(--spacing-08)]">
          <Avatar size={size} fallback="MC" />
          <span className="text-xs uppercase text-[var(--text-muted)]">{size}</span>
        </div>
      ))}
    </div>
  ),
};

// ShowStatus — the presence dot scales with the avatar (8/8/16/16/20).
export const WithStatus: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-end gap-[var(--spacing-16)]">
      {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
        <Avatar
          key={size}
          size={size}
          fallback="MC"
          src={sampleSrc}
          alt="Max"
          status="default"
          statusLabel="Online"
        />
      ))}
    </div>
  ),
};
