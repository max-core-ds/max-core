import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { IconOnlyButton } from './IconOnlyButton.js';

describe('IconOnlyButton', () => {
  it('is named by aria-label, not by its icon', () => {
    render(<IconOnlyButton aria-label="Close" icon={<svg aria-hidden="true" />} />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('fires onClick, but not when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(
      <IconOnlyButton aria-label="Close" icon={<svg />} onClick={onClick} />,
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(<IconOnlyButton aria-label="Close" icon={<svg />} onClick={onClick} disabled />);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<IconOnlyButton ref={ref} aria-label="Menu" icon={<svg />} />);
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Menu' }));
  });
});
