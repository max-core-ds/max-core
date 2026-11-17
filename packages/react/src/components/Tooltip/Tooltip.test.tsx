import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip.js';

function setup() {
  render(
    <Tooltip content="Copy link" delay={0} closeDelay={0}>
      <button type="button" aria-label="Copy">
        <svg aria-hidden="true" />
      </button>
    </Tooltip>,
  );
  return { user: userEvent.setup(), trigger: screen.getByRole('button', { name: 'Copy' }) };
}

describe('Tooltip', () => {
  it('stays hidden until the trigger is hovered', async () => {
    const { user, trigger } = setup();
    expect(screen.queryByText('Copy link')).not.toBeInTheDocument();
    await user.hover(trigger);
    expect(await screen.findByText('Copy link')).toBeInTheDocument();
    await user.unhover(trigger);
    await waitFor(() => expect(screen.queryByText('Copy link')).not.toBeInTheDocument());
  });

  it('shows on keyboard focus and hides on Escape', async () => {
    const { user } = setup();
    await user.tab();
    expect(await screen.findByText('Copy link')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Copy link')).not.toBeInTheDocument());
  });

  it('keeps the trigger as the focusable element', async () => {
    const { user, trigger } = setup();
    await user.tab();
    expect(trigger).toHaveFocus();
  });
});
