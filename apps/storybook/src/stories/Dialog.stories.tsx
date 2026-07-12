import { Button, Dialog } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Molecules/Overlays/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  argTypes: { trigger: { control: false }, actions: { control: false } },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: <Button>Delete account</Button>,
    title: 'Delete account?',
    description: 'This action is permanent and cannot be undone.',
    actions: (
      <>
        <Button variant="ghost">Cancel</Button>
        <Button tone="danger">Delete</Button>
      </>
    ),
  },
};
