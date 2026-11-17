import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button.js';
import { BottomSheet } from './BottomSheet.js';

function setup(props: Partial<Parameters<typeof BottomSheet>[0]> = {}) {
  const onOpenChange = vi.fn();
  render(
    <BottomSheet
      trigger={<Button>Share</Button>}
      title="Share with"
      onOpenChange={onOpenChange}
      footer={<Button>Send</Button>}
      {...props}
    >
      <p>Body content</p>
    </BottomSheet>,
  );
  return {
    user: userEvent.setup(),
    onOpenChange,
    // hidden: an open (modal) sheet hides the page behind it from assistive tech.
    trigger: screen.getByRole('button', { name: 'Share', hidden: true }),
  };
}

describe('BottomSheet', () => {
  it('opens a dialog named by its title, with body and footer', async () => {
    const { user, trigger } = setup();
    await user.click(trigger);
    const sheet = await screen.findByRole('dialog', { name: 'Share with' });
    expect(sheet).toHaveTextContent('Body content');
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('closes from the named ✕ and returns focus to the trigger', async () => {
    const { user, trigger, onOpenChange } = setup();
    await user.click(trigger);
    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('closes on Escape', async () => {
    const { user, trigger } = setup();
    await user.click(trigger);
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('uses closeLabel for the ✕ and hides it with showClose={false}', async () => {
    const { user, trigger } = setup({ closeLabel: 'Dismiss sheet' });
    await user.click(trigger);
    expect(await screen.findByRole('button', { name: 'Dismiss sheet' })).toBeInTheDocument();
  });

  it('can start open and has no ✕ when showClose is false', async () => {
    setup({ defaultOpen: true, showClose: false });
    expect(await screen.findByRole('dialog', { name: 'Share with' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });
});
