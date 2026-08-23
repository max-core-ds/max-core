import { Button, Dialog } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Molecules/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  argTypes: {
    trigger: { control: false },
    actions: { control: false },
    icon: { control: false },
    tone: { control: 'select', options: [undefined, 'danger', 'success', 'warning'] },
    actionsLayout: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// Plain modal — no tone, left-aligned, right-aligned actions.
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

// Danger confirmation — tone icon, centered, tinted title, horizontal actions.
export const DangerConfirmation: Story = {
  args: {
    trigger: <Button tone="danger">Delete item</Button>,
    tone: 'danger',
    title: 'Delete item?',
    description: 'This action cannot be undone.',
    actions: (
      <>
        <Button variant="ghost" tone="danger">
          Cancel
        </Button>
        <Button tone="danger">Delete</Button>
      </>
    ),
  },
};

// Success, vertical layout — primary on top, ghost below, both full-width.
export const SuccessVertical: Story = {
  args: {
    trigger: <Button tone="success">Pay</Button>,
    tone: 'success',
    actionsLayout: 'vertical',
    title: 'Payment Successful',
    description: 'Your payment has been processed! Details have been sent to your email.',
    actions: (
      <>
        <Button tone="success">View Order</Button>
        <Button variant="ghost" tone="success">
          Back to home
        </Button>
      </>
    ),
  },
};

// Warning confirmation.
export const WarningConfirmation: Story = {
  args: {
    trigger: <Button tone="warning">Enable location</Button>,
    tone: 'warning',
    title: 'Enable Location?',
    description: 'We need access to your location to show you nearby hotels and restaurants.',
    actions: (
      <>
        <Button variant="ghost" tone="warning">
          Not now
        </Button>
        <Button tone="warning">Allow Access</Button>
      </>
    ),
  },
};
