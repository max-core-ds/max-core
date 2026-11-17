import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast } from './Toast.js';

function Trigger({ onUndo, showDismiss }: { onUndo?: () => void; showDismiss?: boolean }) {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() =>
        toast.add({
          title: 'Saved',
          description: 'Your changes are live.',
          type: 'success',
          timeout: 0,
          actionProps: onUndo ? { children: 'Undo', onClick: onUndo } : undefined,
          data: { showDismiss },
        })
      }
    >
      Save
    </button>
  );
}

function setup(props: Parameters<typeof Trigger>[0] = {}) {
  render(
    <ToastProvider>
      <Trigger {...props} />
    </ToastProvider>,
  );
  return { user: userEvent.setup() };
}

describe('Toast', () => {
  it('shows a toast with title and description', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes are live.')).toBeInTheDocument();
  });

  it('announces toasts through a live region', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Save' }));
    const title = await screen.findByText('Saved');
    expect(title.closest('[aria-live]')).not.toBeNull();
  });

  it('runs the action', async () => {
    const onUndo = vi.fn();
    const { user } = setup({ onUndo });
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(await screen.findByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  // Base UI keeps the ✕ out of the live-region read-out (aria-hidden) until the stack
  // expands or the ✕ itself takes focus — then it's exposed and named.
  it('exposes the named ✕ on focus and closes from it', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await screen.findByText('Saved');
    const close = document.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!;
    expect(close).toHaveAttribute('aria-hidden', 'true');
    close.focus();
    await waitFor(() => expect(close).not.toHaveAttribute('aria-hidden', 'true'));
    expect(screen.getByRole('button', { name: 'Close' })).toBe(close);
    await user.click(close);
    await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument());
  });

  it('hides the ✕ with data.showDismiss = false', async () => {
    const { user } = setup({ showDismiss: false });
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await screen.findByText('Saved');
    expect(document.querySelector('button[aria-label="Close"]')).toBeNull();
  });
});
