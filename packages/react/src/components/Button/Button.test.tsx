import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button.js';

describe('Button', () => {
  it('renders a named button that does not submit its form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    render(
      <form onSubmit={(e) => onSubmit(e.nativeEvent)}>
        <Button>Save</Button>
      </form>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
    await user.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits when type="submit"', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: Event) => e.preventDefault());
    render(
      <form onSubmit={(e) => onSubmit(e.nativeEvent)}>
        <Button type="submit">Send</Button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('fires onClick on click, Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    const button = screen.getByRole('button', { name: 'Go' });

    await user.click(button);
    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Go
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Go' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders both icons around the label and forwards the ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button
        ref={ref}
        leftIcon={<svg data-testid="left" />}
        rightIcon={<svg data-testid="right" />}
      >
        Next
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Next' });
    expect(ref.current).toBe(button);
    expect(button.firstElementChild).toBe(screen.getByTestId('left'));
    expect(button.lastElementChild).toBe(screen.getByTestId('right'));
  });
});
