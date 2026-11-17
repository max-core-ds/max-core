import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tag } from './Tag.js';

describe('Tag', () => {
  it('is plain text when it has no onClick or selected', () => {
    render(<Tag>Draft</Tag>);
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('becomes a button with onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Tag onClick={onClick}>Design</Tag>);
    const tag = screen.getByRole('button', { name: 'Design' });
    expect(tag).toHaveAttribute('type', 'button');
    expect(tag).not.toHaveAttribute('aria-pressed');
    await user.click(tag);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // Phase 4.5: a selectable tag is a filter chip — a toggle button.
  it('is a toggle button (aria-pressed) when selected is set', () => {
    const { rerender } = render(<Tag selected={false}>Open</Tag>);
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-pressed', 'false');
    rerender(<Tag selected>Open</Tag>);
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Tag onClick={onClick} disabled>
        Archived
      </Tag>,
    );
    const tag = screen.getByRole('button', { name: 'Archived' });
    expect(tag).toBeDisabled();
    await user.click(tag);
    expect(onClick).not.toHaveBeenCalled();
  });
});
