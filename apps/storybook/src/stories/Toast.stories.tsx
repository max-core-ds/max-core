import { Button, ToastProvider, useToast } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Molecules/Toast',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

function Demo() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-[var(--spacing-08)]">
      <Button onClick={() => toast.add({ title: 'Changes saved', type: 'success' })}>
        Success
      </Button>
      <Button
        tone="danger"
        onClick={() =>
          toast.add({ title: 'Upload failed', description: 'Try again.', type: 'danger' })
        }
      >
        Error
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({ title: 'Heads up', description: 'Session expires soon.', type: 'info' })
        }
      >
        Info
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
