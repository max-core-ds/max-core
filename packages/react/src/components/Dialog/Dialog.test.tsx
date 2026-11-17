import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button.js';
import { Dialog } from './Dialog.js';

function setup(onOpenChange = vi.fn()) {
  render(
    <Dialog
      trigger={<Button>Delete project</Button>}
      title="Delete project?"
      description="This can't be undone."
      tone="danger"
      onOpenChange={onOpenChange}
      actions={<Button>Delete</Button>}
    />,
  );
  return {
    user: userEvent.setup(),
    onOpenChange,
    trigger: screen.getByRole('button', { name: 'Delete project' }),
  };
}

describe('Dialog', () => {
  it('opens a modal dialog named by its title and described by its description', async () => {
    const { user, trigger } = setup();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Delete project?' });
    expect(dialog).toHaveAccessibleDescription("This can't be undone.");
  });

  it('moves focus into the dialog', async () => {
    const { user, trigger } = setup();
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const { user, trigger, onOpenChange } = setup();
    await user.click(trigger);
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('opens and closes from `open` when controlled', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Open</Button>
          <Dialog
            open={open}
            onOpenChange={setOpen}
            title="Saved"
            actions={<Button onClick={() => setOpen(false)}>Done</Button>}
          />
        </>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByRole('dialog', { name: 'Saved' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
