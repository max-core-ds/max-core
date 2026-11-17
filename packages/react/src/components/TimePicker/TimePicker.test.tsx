import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TimePicker } from './TimePicker.js';

/** The option a wheel column currently points screen readers at. */
function activeOption(column: HTMLElement) {
  const id = column.getAttribute('aria-activedescendant');
  return id ? document.getElementById(id) : null;
}

describe('TimePicker — inline wheel', () => {
  it('has a named listbox column per unit with the value selected', () => {
    render(<TimePicker mode="inline" format="24h" aria-label="Start time" defaultValue="09:30" />);
    const hour = screen.getByRole('listbox', { name: 'Hour' });
    const minute = screen.getByRole('listbox', { name: 'Minute' });
    expect(within(hour).getByRole('option', { selected: true })).toHaveTextContent('09');
    expect(within(minute).getByRole('option', { selected: true })).toHaveTextContent('30');
  });

  it('steps a column with the arrow keys and reports the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimePicker mode="inline" defaultValue="09:30" onValueChange={onValueChange} />);
    screen.getByRole('listbox', { name: 'Hour' }).focus();
    await user.keyboard('{ArrowDown}');
    expect(onValueChange).toHaveBeenLastCalledWith('10:30');
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(onValueChange).toHaveBeenLastCalledWith('08:30');
  });

  // The focused element is the column; without aria-activedescendant a screen reader
  // has no way to know which value the arrows landed on.
  it('points screen readers at the current option as the value changes', async () => {
    const user = userEvent.setup();
    render(<TimePicker mode="inline" format="24h" defaultValue="09:30" />);
    const hour = screen.getByRole('listbox', { name: 'Hour' });
    expect(activeOption(hour)).toHaveTextContent('09');
    hour.focus();
    await user.keyboard('{ArrowDown}');
    expect(activeOption(hour)).toHaveTextContent('10');
    expect(activeOption(hour)).toHaveAttribute('aria-selected', 'true');
  });

  it('moves between columns with Left / Right', async () => {
    const user = userEvent.setup();
    render(<TimePicker mode="inline" format="24h" defaultValue="09:30" />);
    screen.getByRole('listbox', { name: 'Hour' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('listbox', { name: 'Minute' })).toHaveFocus();
  });

  it('picks a row by click', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker mode="inline" format="24h" defaultValue="09:30" onValueChange={onValueChange} />,
    );
    const hour = screen.getByRole('listbox', { name: 'Hour' });
    await user.click(within(hour).getByRole('option', { name: '10' }));
    expect(onValueChange).toHaveBeenLastCalledWith('10:30');
  });

  it('skips times outside minTime / maxTime', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker
        mode="inline"
        format="24h"
        defaultValue="09:30"
        minTime="09:00"
        maxTime="10:00"
        onValueChange={onValueChange}
      />,
    );
    const hour = screen.getByRole('listbox', { name: 'Hour' });
    expect(within(hour).getByRole('option', { name: '08' })).toBeDisabled();
    // The wheel is circular and skips disabled values: Up from 09 wraps past 08…00…23…11
    // to 10 — never onto a time outside the window.
    hour.focus();
    await user.keyboard('{ArrowUp}');
    expect(onValueChange).toHaveBeenLastCalledWith('10:00');
  });

  it('has a 12-hour format with an AM / PM column', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <TimePicker mode="inline" format="12h" defaultValue="09:30" onValueChange={onValueChange} />,
    );
    const period = screen.getByRole('listbox', { name: 'AM or PM' });
    expect(within(period).getByRole('option', { selected: true })).toHaveTextContent('AM');
    await user.click(within(period).getByRole('option', { name: 'PM' }));
    expect(onValueChange).toHaveBeenLastCalledWith('21:30');
  });
});

describe('TimePicker — popover', () => {
  // Phase 6.2: the trigger's name is the label + the visible value.
  it('names the trigger by label and value, and opens the wheel', async () => {
    const user = userEvent.setup();
    render(<TimePicker label="Start" defaultValue="09:30" />);
    const trigger = screen.getByRole('button', { name: 'Start 09:30 AM' });
    await user.click(trigger);
    expect(await screen.findByRole('listbox', { name: 'Hour' })).toBeInTheDocument();
  });

  it('clears the value from the named ✕', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimePicker label="Start" defaultValue="09:30" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Clear time' }));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Start Select time' })).toBeInTheDocument(),
    );
  });

  it('describes the trigger with the error and marks it invalid', () => {
    render(<TimePicker label="Start" errorMessage="Pick a time" />);
    const trigger = screen.getByRole('button', { name: 'Start Select time' });
    expect(trigger).toHaveAccessibleDescription('Pick a time');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });
});
