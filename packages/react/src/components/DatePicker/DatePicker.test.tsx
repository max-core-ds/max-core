import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DateInput, DatePicker, DualDatePicker } from './DatePicker.js';

// September 2026: the 1st is a Tuesday. Day buttons are named "<n>, <weekday>, <month year>"
// (Phase 6.2: the name starts with the visible number).
const day = (n: number, rest = '') =>
  screen.getByRole('button', { name: new RegExp(`^${n}, \\w+day, ${rest}`) });

describe('DatePicker', () => {
  it('shows the month of the value with the selected day marked', () => {
    render(<DatePicker defaultValue="2026-09-10" />);
    expect(
      screen.getByRole('button', { name: '10, Thursday, September 2026, selected' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1, Tuesday, September 2026' })).toBeInTheDocument();
  });

  it('picks a day and reports it as an ISO date', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker defaultValue="2026-09-10" onValueChange={onValueChange} />);
    await user.click(day(15, 'September'));
    expect(onValueChange).toHaveBeenLastCalledWith('2026-09-15');
    expect(day(15, 'September 2026, selected')).toBeInTheDocument();
  });

  it('pages months with the named header buttons', async () => {
    const user = userEvent.setup();
    render(<DatePicker defaultValue="2026-09-10" />);
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('button', { name: '1, Thursday, October 2026' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByRole('button', { name: '1, Saturday, August 2026' })).toBeInTheDocument();
  });

  it('moves focus across days with the arrow keys and selects with Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker defaultValue="2026-09-10" onValueChange={onValueChange} />);
    await user.click(day(10, 'September'));
    await user.keyboard('{ArrowRight}');
    expect(day(11, 'September')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(day(18, 'September')).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('2026-09-18');
  });

  it('disables days outside minDate / maxDate', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DatePicker
        defaultValue="2026-09-10"
        minDate="2026-09-05"
        maxDate="2026-09-20"
        onValueChange={onValueChange}
      />,
    );
    expect(day(4, 'September')).toBeDisabled();
    expect(day(21, 'September')).toBeDisabled();
    expect(day(5, 'September')).toBeEnabled();
    await user.click(day(4, 'September'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('runs Apply with the value and Clear with null', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    const onClear = vi.fn();
    const onValueChange = vi.fn();
    render(
      <DatePicker
        defaultValue="2026-09-10"
        showFooter
        onApply={onApply}
        onClear={onClear}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onApply).toHaveBeenCalledWith('2026-09-10');
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it('shows the controlled value', () => {
    const { rerender } = render(<DatePicker value="2026-09-10" />);
    expect(day(10, 'September 2026, selected')).toBeInTheDocument();
    rerender(<DatePicker value="2026-09-12" />);
    expect(day(12, 'September 2026, selected')).toBeInTheDocument();
  });
});

describe('DualDatePicker', () => {
  it('completes a range on the second date, and the next click starts a new one', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DualDatePicker
        numberOfMonths={1}
        defaultValue={{ start: '2026-09-01', end: null }}
        onValueChange={onValueChange}
      />,
    );
    // The seeded start is waiting for its end.
    await user.click(day(10, 'September'));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: '2026-09-01', end: '2026-09-10' });

    // Regression: after a finished range rdp would stretch it to the clicked day;
    // the click starts a new range instead.
    await user.click(day(15, 'September'));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: '2026-09-15', end: null });
    await user.click(day(20, 'September'));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: '2026-09-15', end: '2026-09-20' });
  });
});

describe('DateInput', () => {
  // Phase 6.2: the trigger's name is the label + the visible value.
  it('names the trigger by label and value', () => {
    render(<DateInput label="Start date" defaultValue="2026-09-10" />);
    expect(screen.getByRole('button', { name: /^Start date .*2026/ })).toBeInTheDocument();
  });

  it('opens the calendar, picks a day and closes with the new value shown', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DateInput label="Start date" defaultValue="2026-09-10" onValueChange={onValueChange} />,
    );
    await user.click(screen.getByRole('button', { name: /^Start date/ }));
    await user.click(await screen.findByRole('button', { name: /^15, Tuesday, September 2026/ }));
    expect(onValueChange).toHaveBeenLastCalledWith('2026-09-15');
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /^15, Tuesday/ })).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: /^Start date .*15/ })).toBeInTheDocument();
  });

  it('clears the value from the named ✕', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DateInput label="Start date" defaultValue="2026-09-10" onValueChange={onValueChange} />,
    );
    await user.click(screen.getByRole('button', { name: 'Clear date' }));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole('button', { name: 'Start date Select date' })).toBeInTheDocument();
  });

  it('describes the trigger with the helper, then the error, and marks it invalid', () => {
    const { rerender } = render(<DateInput label="Start date" helper="Weekdays only" />);
    const trigger = screen.getByRole('button', { name: 'Start date Select date' });
    expect(trigger).toHaveAccessibleDescription('Weekdays only');
    expect(trigger).not.toHaveAttribute('aria-invalid');

    rerender(<DateInput label="Start date" helper="Weekdays only" errorMessage="Required" />);
    expect(trigger).toHaveAccessibleDescription('Required');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });
});
