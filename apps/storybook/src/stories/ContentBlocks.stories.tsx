import { HeadingBlock, ImagePlaceholder, TextBlock } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Display/Content Blocks',
  component: HeadingBlock,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof HeadingBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// Content Blocks are draggable placeholders for composing slot content, so the
// most useful story shows them assembled together.
export const Overview: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-[var(--spacing-12)]">
      <ImagePlaceholder />
      <HeadingBlock>Article title</HeadingBlock>
      <TextBlock>
        A short paragraph of supporting body copy that would sit beneath the heading.
      </TextBlock>
    </div>
  ),
};
