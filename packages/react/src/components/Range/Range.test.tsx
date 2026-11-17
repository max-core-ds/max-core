import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Range } from './Range.js';

describe('Range', () => {
  // Phase 6.2: the name must reach the slider input, not the wrapper.
  it('names its slider input with aria-label', () => {
    render(<Range aria-label="Volume" defaultValue={40} />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toHaveAttribute('aria-valuenow', '40');
  });

  it('names its slider input with aria-labelledby', () => {
    render(
      <>
        <span id="vol-label">Volume</span>
        <Range aria-labelledby="vol-label" defaultValue={40} />
      </>,
    );
    expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument();
  });

  it('steps with the arrow keys and reports the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Range aria-label="Volume" defaultValue={40} step={5} onValueChange={onValueChange} />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '45');
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(slider).toHaveAttribute('aria-valuenow', '35');
    expect(onValueChange.mock.calls.map((c) => c[0])).toEqual([45, 40, 35]);
  });

  it('jumps to min / max with Home / End and stays within them', async () => {
    const user = userEvent.setup();
    render(<Range aria-label="Volume" defaultValue={40} min={10} max={60} />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    slider.focus();
    await user.keyboard('{End}{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '60');
    await user.keyboard('{Home}{ArrowLeft}');
    expect(slider).toHaveAttribute('aria-valuenow', '10');
  });

  it('names each thumb of a dual range with getAriaLabel', () => {
    render(
      <Range
        defaultValue={[20, 70]}
        getAriaLabel={(i) => (i === 0 ? 'Minimum price' : 'Maximum price')}
      />,
    );
    expect(screen.getByRole('slider', { name: 'Minimum price' })).toHaveAttribute(
      'aria-valuenow',
      '20',
    );
    expect(screen.getByRole('slider', { name: 'Maximum price' })).toHaveAttribute(
      'aria-valuenow',
      '70',
    );
  });

  it('does not move when disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Range aria-label="Volume" defaultValue={40} disabled onValueChange={onValueChange} />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toBeDisabled();
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('shows the bound labels with formatLabel', () => {
    render(<Range aria-label="Price" defaultValue={40} showLabels formatLabel={(v) => `$${v}`} />);
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });
});
