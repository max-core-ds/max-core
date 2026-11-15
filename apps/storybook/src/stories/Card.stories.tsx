import { Badge, Button, Card, LinkButton, MediaCard } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Triangle } from 'lucide-react';

const meta = {
  title: 'Organisms/Card',
  component: Card,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-[320px]">{Story()}</div>],
  argTypes: {
    elevation: { control: 'inline-radio', options: ['none', 'low', 'high'] },
    title: { control: 'text' },
    actions: { control: false },
    children: { control: false },
  },
  // The master's default content: title + close, body copy, Ghost Danger + Primary (S).
  args: {
    elevation: 'none',
    title: 'Card Title',
    onClose: () => {},
    children:
      'Card content goes here. This is a flexible area where you can place any content — text, forms, lists, images, or other components.',
    actions: (
      <>
        <Button variant="ghost" tone="danger" size="s">
          Button
        </Button>
        <Button size="s">Button</Button>
      </>
    ),
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// _Media Card: Media Slot with a Badge, then title, date meta, description, Link Button.
export const Media: StoryObj<typeof MediaCard> = {
  decorators: [(Story) => <div className="w-[280px]">{Story()}</div>],
  argTypes: { elevation: { control: 'inline-radio', options: ['none', 'low', 'high'] } },
  render: (args) => (
    <MediaCard
      elevation={args.elevation}
      media={<img alt="" src="https://picsum.photos/seed/card/560/480" />}
      badge={<Badge size="s">Badge label</Badge>}
      title="Card Title"
      meta="Mar 15, 2026 · 5 min read"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi."
      action={<LinkButton rightIcon={<Triangle />}>Label</LinkButton>}
    />
  ),
};
