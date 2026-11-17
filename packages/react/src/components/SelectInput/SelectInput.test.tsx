import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SelectInput, type SelectOption } from './SelectInput.js';

const items: SelectOption[] = [
  { value: 'ro', label: 'Romania' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
];

describe('SelectInput', () => {
  it('is a combobox named by its label, showing the placeholder', () => {
    render(<SelectInput label="Country" items={items} />);
    const trigger = screen.getByRole('combobox', { name: 'Country' });
    expect(trigger).toHaveTextContent('Select…');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('is named by aria-label when there is no label', () => {
    render(<SelectInput aria-label="Country" items={items} />);
    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();
  });

  it('opens a listbox and picks an option by click', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SelectInput label="Country" items={items} onValueChange={onValueChange} />);
    const trigger = screen.getByRole('combobox', { name: 'Country' });

    await user.click(trigger);
    const listbox = await screen.findByRole('listbox');
    expect(listbox).toBeInTheDocument();
    await user.click(screen.getByRole('option', { name: 'Germany' }));

    expect(onValueChange).toHaveBeenCalledWith('de');
    // Phase 4.5 regression: the trigger showed the raw value ("de"), not the label.
    expect(trigger).toHaveTextContent('Germany');
    expect(trigger).not.toHaveTextContent(/^de$/);
  });

  it('opens and picks with the keyboard', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SelectInput label="Country" items={items} onValueChange={onValueChange} />);
    screen.getByRole('combobox', { name: 'Country' }).focus();

    await user.keyboard('{ArrowDown}');
    await screen.findByRole('listbox');
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes on Escape without changing the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SelectInput label="Country" items={items} defaultValue="fr" onValueChange={onValueChange} />,
    );
    const trigger = screen.getByRole('combobox', { name: 'Country' });
    await user.click(trigger);
    await screen.findByRole('listbox');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent('France');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('shows the controlled value', () => {
    const { rerender } = render(<SelectInput label="Country" items={items} value="ro" />);
    const trigger = screen.getByRole('combobox', { name: 'Country' });
    expect(trigger).toHaveTextContent('Romania');
    rerender(<SelectInput label="Country" items={items} value="fr" />);
    expect(trigger).toHaveTextContent('France');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<SelectInput label="Country" items={items} disabled />);
    await user.click(screen.getByRole('combobox', { name: 'Country' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('links the helper, and an error replaces it and marks the trigger invalid', () => {
    const { rerender } = render(<SelectInput label="Country" items={items} helper="Billing" />);
    const trigger = screen.getByRole('combobox', { name: 'Country' });
    expect(trigger).toHaveAccessibleDescription('Billing');

    rerender(
      <SelectInput label="Country" items={items} helper="Billing" errorMessage="Required" />,
    );
    expect(trigger).toHaveAccessibleDescription('Required');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });

  it('submits the value under `name`, controlled or not', async () => {
    const user = userEvent.setup();
    let submitted: FormData | undefined;
    const form = (field: ReactNode) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitted = new FormData(e.currentTarget);
        }}
      >
        {field}
        <button type="submit">Send</button>
      </form>
    );
    const { unmount } = render(
      form(<SelectInput label="Country" name="country" items={items} defaultValue="ro" />),
    );
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(submitted?.get('country')).toBe('ro');
    unmount();

    // Controlled: the hidden input mirrors the value the parent passes.
    const { rerender } = render(
      form(<SelectInput label="Country" name="country" items={items} value="fr" />),
    );
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(submitted?.get('country')).toBe('fr');
    rerender(form(<SelectInput label="Country" name="country" items={items} value="de" />));
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(submitted?.get('country')).toBe('de');
  });
});
