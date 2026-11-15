import { Radio, RadioGroup } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/Radio',
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

export const WithHelper: Story = {
  render: () => (
    <RadioGroup defaultValue="standard">
      <Radio value="standard" label="Standard" helperText="Arrives in 5–7 days" />
      <Radio value="express" label="Express" helperText="Arrives next day" />
    </RadioGroup>
  ),
};

// Group-level error message renders once, below the radios.
export const WithError: Story = {
  render: () => (
    <RadioGroup label="Shipping method" errorMessage="Please choose a shipping method.">
      <Radio value="standard" label="Standard shipping" />
      <Radio value="express" label="Express shipping" />
      <Radio value="pickup" label="Store pickup" />
    </RadioGroup>
  ),
};

// Validation recolors the box border and the selected dot.
export const Validations: Story = {
  render: () => (
    <RadioGroup defaultValue="default">
      {(['default', 'error', 'warning', 'success'] as const).map((validation) => (
        <Radio key={validation} value={validation} validation={validation} label={validation} />
      ))}
    </RadioGroup>
  ),
};
