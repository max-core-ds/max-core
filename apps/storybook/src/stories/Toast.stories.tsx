import { Button, ToastProvider, useToast } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Molecules/Toast',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

const undo = { children: 'Undo' };

function Demo() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-[var(--spacing-08)]">
      <Button
        tone="success"
        onClick={() =>
          toast.add({
            title: 'Success',
            description: 'Changes saved successfully.',
            type: 'success',
            actionProps: undo,
          })
        }
      >
        Success
      </Button>
      <Button
        tone="danger"
        onClick={() =>
          toast.add({
            title: 'Error',
            description: 'Connection lost. Please check your internet.',
            type: 'danger',
            actionProps: undo,
          })
        }
      >
        Danger
      </Button>
      <Button
        tone="warning"
        onClick={() =>
          toast.add({
            title: 'Warning',
            description: 'Unsaved changes. If you leave, your changes will be lost.',
            type: 'warning',
            actionProps: undo,
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            title: 'Info',
            description: 'A new software update is available.',
            actionProps: undo,
          })
        }
      >
        Default
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            title: 'Uploading file...',
            description: 'Please wait while we process your file.',
            type: 'loading',
            timeout: 0,
            data: { progress: 74 },
            actionProps: { children: 'Cancel' },
          })
        }
      >
        Loading
      </Button>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};
