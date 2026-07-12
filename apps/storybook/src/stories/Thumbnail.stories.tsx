import { Thumbnail } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageIcon } from 'lucide-react';

const SAMPLE = 'https://picsum.photos/200';

const meta = {
  title: 'Atoms/Display/Thumbnail',
  component: Thumbnail,
  parameters: { layout: 'centered' },
  args: { src: SAMPLE, shape: 'rounded', size: 'm' },
  argTypes: {
    shape: { control: 'inline-radio', options: ['rounded', 'square', 'circle'] },
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
  },
} satisfies Meta<typeof Thumbnail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Fallback: Story = {
  args: { src: undefined, fallback: <ImageIcon /> },
};

export const Shapes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-[var(--spacing-16)]">
      {(['rounded', 'square', 'circle'] as const).map((shape) => (
        <Thumbnail key={shape} shape={shape} size="l" src={SAMPLE} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-end gap-[var(--spacing-16)]">
      {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
        <Thumbnail key={size} size={size} src={SAMPLE} />
      ))}
    </div>
  ),
};
