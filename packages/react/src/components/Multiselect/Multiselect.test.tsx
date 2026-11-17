import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Multiselect, type MultiselectOption } from './Multiselect.js';

const items: MultiselectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
];

const values = (fn: ReturnType<typeof vi.fn>) =>
  (fn.mock.lastCall?.[0] as MultiselectOption[]).map((o) => o.value);

describe('Multiselect — typeahead (default)', () => {
  it('has a text input named by its label', () => {
    render(<Multiselect label="Frameworks" items={items} />);
    expect(screen.getByRole('combobox', { name: 'Frameworks' })).toBeInTheDocument();
  });

  it('names the text input by aria-label when there is no label', () => {
    render(<Multiselect aria-label="Frameworks" items={items} />);
    expect(screen.getByRole('combobox', { name: 'Frameworks' })).toBeInTheDocument();
  });

  it('filters while typing and adds picked options as removable chips', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Multiselect label="Frameworks" items={items} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Frameworks' });

    await user.type(input, 'sv');
    const listbox = await screen.findByRole('listbox');
    expect(
      within(listbox)
        .getAllByRole('option')
        .map((o) => o.textContent),
    ).toEqual(['Svelte']);

    await user.click(within(listbox).getByRole('option', { name: 'Svelte' }));
    expect(values(onValueChange)).toEqual(['svelte']);
    expect(screen.getByRole('button', { name: 'Remove Svelte' })).toBeInTheDocument();
  });

  it('removes a chip with its named ✕', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Multiselect
        label="Frameworks"
        items={items}
        defaultValue={[items[0]!, items[1]!]}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Remove React' }));
    expect(values(onValueChange)).toEqual(['vue']);
    expect(screen.queryByRole('button', { name: 'Remove React' })).not.toBeInTheDocument();
  });

  // The chevron is a mouse affordance (tabindex -1; Base UI names it after the field);
  // keyboard users open the list from the input.
  it('opens from the chevron', async () => {
    const user = userEvent.setup();
    const { container } = render(<Multiselect label="Frameworks" items={items} />);
    const chevron = container.querySelector<HTMLElement>(
      '[aria-haspopup="listbox"][tabindex="-1"]',
    );
    expect(chevron).not.toBeNull();
    await user.click(chevron!);
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
  });

  it('links the helper, and an error replaces it and marks the input invalid', () => {
    const { rerender } = render(<Multiselect label="Frameworks" items={items} helper="Pick any" />);
    const input = screen.getByRole('combobox', { name: 'Frameworks' });
    expect(input).toHaveAccessibleDescription('Pick any');

    rerender(
      <Multiselect label="Frameworks" items={items} helper="Pick any" errorMessage="Pick one" />,
    );
    expect(input).toHaveAccessibleDescription('Pick one');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Multiselect — list mode', () => {
  it('has a trigger named by its label that opens a searchable list', async () => {
    const user = userEvent.setup();
    render(<Multiselect mode="list" label="Frameworks" items={items} />);
    await user.click(screen.getByRole('combobox', { name: 'Frameworks' }));
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('toggles options and shows them as chips', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Multiselect mode="list" label="Frameworks" items={items} onValueChange={onValueChange} />,
    );
    const trigger = screen.getByRole('combobox', { name: 'Frameworks' });
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: 'Vue' }));
    await user.click(screen.getByRole('option', { name: 'React' }));
    expect(values(onValueChange)).toEqual(['vue', 'react']);

    await user.click(screen.getByRole('option', { name: 'Vue' }));
    expect(values(onValueChange)).toEqual(['react']);
  });

  it('Select all picks every visible option, and only the filtered ones while searching', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Multiselect mode="list" label="Frameworks" items={items} onValueChange={onValueChange} />,
    );
    await user.click(screen.getByRole('combobox', { name: 'Frameworks' }));
    await screen.findByRole('listbox');

    await user.type(screen.getByPlaceholderText('Search...'), 'v');
    // Named "Select all" — not the field's label (it sits inside the Multiselect's Field).
    const selectAll = screen.getByRole('checkbox', { name: 'Select all' });
    await user.click(selectAll);
    expect(values(onValueChange)).toEqual(['vue', 'svelte']);

    await user.click(selectAll);
    expect(values(onValueChange)).toEqual([]);
  });
});

describe('Multiselect — form submission', () => {
  it.each(['typeahead', 'list'] as const)(
    'submits one value per selected option under `name` (%s)',
    async (mode) => {
      const user = userEvent.setup();
      let submitted: FormData | undefined;
      render(
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitted = new FormData(e.currentTarget);
          }}
        >
          <Multiselect
            mode={mode}
            label="Frameworks"
            name="frameworks"
            items={items}
            value={[items[0]!, items[2]!]}
          />
          <button type="submit">Send</button>
        </form>,
      );
      await user.click(screen.getByRole('button', { name: 'Send' }));
      expect(submitted?.getAll('frameworks')).toEqual(['react', 'svelte']);
    },
  );
});
