import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination.js';

function pageLabels() {
  const nav = screen.getByRole('navigation', { name: 'Pagination' });
  return within(nav)
    .getAllByRole('button')
    .map((b) => b.getAttribute('aria-label') ?? b.textContent);
}

describe('Pagination', () => {
  it('marks the current page', () => {
    render(<Pagination page={3} count={5} />);
    expect(screen.getByRole('button', { name: '3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: '2' })).not.toHaveAttribute('aria-current');
  });

  it('calls onPageChange with the clicked, previous and next page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={3} count={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    await user.click(screen.getByRole('button', { name: 'Next page' }));

    expect(onPageChange.mock.calls).toEqual([[5], [2], [4]]);
  });

  it('disables Previous on the first page and Next on the last', () => {
    const { rerender } = render(<Pagination page={1} count={5} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();

    rerender(<Pagination page={5} count={5} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  // Phase 4.5 regression: page 2 / count−1 were pushed twice (duplicate keys + a stale button).
  it('keeps a constant-length window without duplicate pages', () => {
    const count = 20;
    const { rerender } = render(<Pagination page={1} count={count} />);
    for (let page = 1; page <= count; page++) {
      rerender(<Pagination page={page} count={count} />);
      const nav = screen.getByRole('navigation', { name: 'Pagination' });
      // first, last, current, 1 sibling each side, 2 ellipsis slots = 7 slots + prev/next
      expect(nav.children).toHaveLength(9);

      const numbers = pageLabels().filter((l) => l && /^\d+$/.test(l));
      expect(new Set(numbers).size).toBe(numbers.length);
      expect(numbers).toContain('1');
      expect(numbers).toContain(String(count));
      expect(numbers).toContain(String(page));
    }
  });
});
