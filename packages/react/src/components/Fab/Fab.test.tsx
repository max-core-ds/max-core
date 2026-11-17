import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Fab } from './Fab.js';

function setupMenu() {
  const onShare = vi.fn();
  render(
    <>
      <Fab
        aria-label="Create"
        icon={<svg />}
        actions={[
          { label: 'Share', icon: <svg />, onClick: onShare },
          { label: 'Upload', icon: <svg /> },
        ]}
      />
      <p>Outside</p>
    </>,
  );
  return { user: userEvent.setup(), onShare, main: screen.getByRole('button', { name: 'Create' }) };
}

describe('Fab', () => {
  it('without actions it is a plain button that fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Fab aria-label="Compose" icon={<svg />} onClick={onClick} />);
    const main = screen.getByRole('button', { name: 'Compose' });
    expect(main).not.toHaveAttribute('aria-expanded');
    await user.click(main);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('with actions it toggles a speed dial of named items', async () => {
    const { user, main } = setupMenu();
    expect(main).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: 'Share' })).not.toBeInTheDocument();

    await user.click(main);
    expect(main).toHaveAttribute('aria-expanded', 'true');
    // Phase 4.5 regression: the icon-only items had no accessible names.
    const share = screen.getByRole('button', { name: 'Share' });
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
    expect(main).toHaveAttribute('aria-controls', share.closest('ul')?.id);

    await user.click(main);
    expect(main).toHaveAttribute('aria-expanded', 'false');
  });

  it('runs an item and closes the dial', async () => {
    const { user, onShare, main } = setupMenu();
    await user.click(main);
    await user.click(screen.getByRole('button', { name: 'Share' }));
    expect(onShare).toHaveBeenCalledTimes(1);
    expect(main).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes on Escape and on a pointer down outside', async () => {
    const { user, main } = setupMenu();
    await user.click(main);
    await user.keyboard('{Escape}');
    expect(main).toHaveAttribute('aria-expanded', 'false');

    await user.click(main);
    fireEvent.pointerDown(screen.getByText('Outside'));
    expect(main).toHaveAttribute('aria-expanded', 'false');
  });
});
