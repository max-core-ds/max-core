import { Button, Tooltip } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Display/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  args: {
    content: 'Saved automatically',
    children: <Button variant="secondary">Hover me</Button>,
  },
  argTypes: {
    side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    content: { control: 'text' },
    delay: { control: 'number' },
    closeDelay: { control: 'number' },
    children: { control: false },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// Hover the trigger to reveal the tooltip. Tune `delay` / `closeDelay` in Controls.
export const Default: Story = {
  args: { content: 'Saved automatically', side: 'top', delay: 200 },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="secondary">Hover me</Button>
    </Tooltip>
  ),
};

// Forced open so the bubble + arrow are visible for every position without hovering.
export const Positions: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-center gap-[var(--spacing-48)] p-[var(--spacing-48)]">
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <Tooltip key={side} content={`Side: ${side}`} side={side} rootProps={{ defaultOpen: true }}>
          <Button variant="secondary">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
