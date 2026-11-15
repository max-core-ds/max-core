import { LinkButton } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, ExternalLink } from 'lucide-react';

const meta = {
  title: 'Atoms/Link Button',
  component: LinkButton,
  parameters: { layout: 'centered' },
  args: { children: 'Learn more' },
  argTypes: {
    tone: { control: 'select', options: ['default', 'danger', 'success', 'warning'] },
    disabled: { control: 'boolean' },
    leftIcon: { control: false },
    rightIcon: { control: false },
  },
} satisfies Meta<typeof LinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: { children: 'View documentation', rightIcon: <ArrowRight /> },
};

export const Tones: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col items-start gap-[var(--spacing-08)]">
      {(['default', 'danger', 'success', 'warning'] as const).map((tone) => (
        <LinkButton key={tone} tone={tone} leftIcon={<ExternalLink />}>
          {tone}
        </LinkButton>
      ))}
    </div>
  ),
};
