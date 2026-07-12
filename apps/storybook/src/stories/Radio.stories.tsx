import { Radio, RadioGroup } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Selection/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
  // A Radio requires a `value`; the render-only stories below ignore it.
  args: { value: 'option' },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

// Radios are only meaningful inside a RadioGroup, so that is the primary story.
export const Group: Story = {
  render: () => (
    <RadioGroup defaultValue="standard">
      <Radio value="standard" label="Standard shipping" />
      <Radio value="express" label="Express shipping" />
      <Radio value="pickup" label="Store pickup" />
    </RadioGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <RadioGroup defaultValue="m" className="flex-row">
      <Radio value="s" size="s" label="Small" />
      <Radio value="m" size="m" label="Medium" />
    </RadioGroup>
  ),
};
