import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LinkButton } from './LinkButton.js';

describe('LinkButton', () => {
  it('is a named button that fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<LinkButton onClick={onClick}>View all</LinkButton>);
    await user.click(screen.getByRole('button', { name: 'View all' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <LinkButton disabled onClick={onClick}>
        View all
      </LinkButton>,
    );
    const button = screen.getByRole('button', { name: 'View all' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
