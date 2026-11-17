import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SearchBar } from './SearchBar.js';

function ControlledSearch({ onClear }: { onClear?: () => void }) {
  const [value, setValue] = useState('');
  return (
    <SearchBar
      aria-label="Search orders"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => {
        setValue('');
        onClear?.();
      }}
    />
  );
}

describe('SearchBar', () => {
  it('is named by aria-label, with the magnifier hidden', () => {
    render(<SearchBar aria-label="Search orders" />);
    expect(screen.getByRole('textbox', { name: 'Search orders' })).toHaveAttribute(
      'placeholder',
      'Search',
    );
  });

  it('shows the clear button only while there is a value', async () => {
    const user = userEvent.setup();
    render(<ControlledSearch />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: 'Search orders' }), 'inv');
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('clears and puts focus back in the field', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<ControlledSearch onClear={onClear} />);
    const input = screen.getByRole('textbox', { name: 'Search orders' });
    await user.type(input, 'inv');
    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(onClear).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
    // The clear button unmounts — focus must not fall back to <body>.
    expect(input).toHaveFocus();
  });

  it('renders the action instead of the clear button', () => {
    render(
      <SearchBar
        aria-label="Search orders"
        value="inv"
        onChange={() => {}}
        onClear={() => {}}
        action={<button type="button">Go</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });
});
