import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioGroup } from './Radio.js';

function Plans(props: Partial<Parameters<typeof RadioGroup>[0]>) {
  return (
    <RadioGroup label="Plan" defaultValue="free" {...props}>
      <Radio value="free" label="Free" />
      <Radio value="pro" label="Pro" />
      <Radio value="team" label="Team" disabled />
    </RadioGroup>
  );
}

describe('RadioGroup + Radio', () => {
  it('is a radiogroup named by its label', () => {
    render(<Plans />);
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Free' })).toBeChecked();
  });

  it('selects by click (radio or label) and reports the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Plans onValueChange={onValueChange} />);

    await user.click(screen.getByRole('radio', { name: 'Pro' }));
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked();

    await user.click(screen.getByText('Free'));
    expect(screen.getByRole('radio', { name: 'Free' })).toBeChecked();

    expect(onValueChange.mock.calls.map((c) => c[0])).toEqual(['pro', 'free']);
  });

  it('moves the selection with arrow keys and skips disabled radios', async () => {
    const user = userEvent.setup();
    render(<Plans />);
    await user.click(screen.getByRole('radio', { name: 'Free' }));
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    // Team is disabled → wraps to Free.
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Free' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Team' })).not.toBeChecked();
  });

  it('cannot select a disabled radio', async () => {
    const user = userEvent.setup();
    render(<Plans />);
    await user.click(screen.getByRole('radio', { name: 'Team' }));
    expect(screen.getByRole('radio', { name: 'Team' })).not.toBeChecked();
  });

  it('links the group helper, and a group error replaces it and marks the group invalid', () => {
    const { rerender } = render(<Plans helperText="You can change this later" />);
    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    expect(group).toHaveAccessibleDescription('You can change this later');
    expect(group).not.toHaveAttribute('aria-invalid');

    rerender(<Plans helperText="You can change this later" errorMessage="Pick a plan" />);
    expect(group).toHaveAccessibleDescription('Pick a plan');
    expect(group).toHaveAttribute('aria-invalid', 'true');
  });

  it('marks a single radio invalid with its own error', () => {
    render(
      <RadioGroup aria-label="Consent">
        <Radio value="yes" label="Yes" errorMessage="Required" />
      </RadioGroup>,
    );
    const radio = screen.getByRole('radio', { name: 'Yes' });
    expect(radio).toHaveAccessibleDescription('Required');
    expect(radio).toHaveAttribute('aria-invalid', 'true');
  });
});
