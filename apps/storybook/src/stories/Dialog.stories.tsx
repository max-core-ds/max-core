import { Button, Dialog } from '@max-core-ds/react';
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

// Plain modal — no tone: no icon, left-aligned text (not a Figma variant).
export const Default: Story = {
  args: {
    trigger: <Button>Delete account</Button>,
    title: 'Delete account?',
    description: 'This action is permanent and cannot be undone.',
    actions: (
      <>
        <Button size="s" variant="ghost">
          Cancel
        </Button>
        <Button size="s" tone="danger">
          Delete
        </Button>
      </>
    ),
  },
};

// Danger confirmation — tone icon, centered, tinted title, Ghost + Primary S actions (as the master).
export const DangerConfirmation: Story = {
  args: {
    trigger: <Button tone="danger">Delete item</Button>,
    tone: 'danger',
    title: 'Delete item?',
    description: 'This action cannot be undone.',
    actions: (
      <>
        <Button size="s" variant="ghost">
          Cancel
        </Button>
        <Button size="s" tone="danger">
          Delete
        </Button>
      </>
    ),
  },
};

// Success, vertical (Figma Type=Vertical) — primary on top, ghost below, both full-width.
export const SuccessVertical: Story = {
  args: {
    trigger: <Button tone="success">Pay</Button>,
    tone: 'success',
    actionsLayout: 'vertical',
    title: 'Payment Successful',
    description: 'Your payment has been processed! Details have been sent to your email.',
    actions: (
      <>
        <Button size="s" tone="success">
          View Order
        </Button>
        <Button size="s" variant="ghost">
          Back to home
        </Button>
      </>
    ),
  },
};

// Warning confirmation — the master's primary action stays the Default (accent) tone.
export const WarningConfirmation: Story = {
  args: {
    trigger: <Button tone="warning">Enable location</Button>,
    tone: 'warning',
    title: 'Enable Location?',
    description: 'We need access to your location to show you nearby hotels and restaurants.',
    actions: (
      <>
        <Button size="s" variant="ghost">
          Not now
        </Button>
        <Button size="s">Allow Access</Button>
      </>
    ),
  },
};
