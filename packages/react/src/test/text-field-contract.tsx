// Shared behaviour contract for the text fields built on utils/field.ts
// (Input, BottomLineInput, Textarea): labelling, helper / error, typing, controlled
// value, disabled and form submission. Each component's test file calls it.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ComponentType, type ReactNode, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

export interface TextFieldLikeProps {
  label?: ReactNode;
  helper?: ReactNode;
  errorMessage?: ReactNode;
  disabled?: boolean;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  'aria-label'?: string;
  // biome-ignore lint/suspicious/noExplicitAny: each field has its own element type
  onChange?: (event: any) => void;
}

export function describeTextFieldContract(
  displayName: string,
  Field: ComponentType<TextFieldLikeProps>,
) {
  describe(`${displayName} — text field contract`, () => {
    it('is named by its label only (not the helper)', () => {
      render(<Field label="Email" helper="We never share it" />);
      const box = screen.getByRole('textbox', { name: 'Email' });
      expect(box).toHaveAccessibleDescription('We never share it');
      expect(box).not.toHaveAttribute('aria-invalid');
    });

    it('is named by aria-label when there is no label', () => {
      render(<Field aria-label="Search orders" />);
      expect(screen.getByRole('textbox', { name: 'Search orders' })).toBeInTheDocument();
    });

    it('shows the error instead of the helper and marks the field invalid', () => {
      render(<Field label="Email" helper="We never share it" errorMessage="Enter a valid email" />);
      const box = screen.getByRole('textbox', { name: 'Email' });
      expect(box).toHaveAccessibleDescription('Enter a valid email');
      expect(box).toHaveAttribute('aria-invalid', 'true');
      expect(screen.queryByText('We never share it')).not.toBeInTheDocument();
    });

    it('takes typing and fires onChange', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Field label="Name" onChange={onChange} />);
      const box = screen.getByRole('textbox', { name: 'Name' });
      await user.type(box, 'Ada');
      expect(box).toHaveValue('Ada');
      expect(onChange).toHaveBeenCalledTimes(3);
    });

    it('follows a controlled value', async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [value, setValue] = useState('');
        return (
          <Field
            label="Code"
            value={value}
            onChange={(e) => setValue(String(e.target.value).toUpperCase())}
          />
        );
      }
      render(<Controlled />);
      const box = screen.getByRole('textbox', { name: 'Code' });
      await user.type(box, 'ab');
      expect(box).toHaveValue('AB');
    });

    it('is not editable when disabled', async () => {
      const user = userEvent.setup();
      render(<Field label="Locked" defaultValue="fixed" disabled />);
      const box = screen.getByRole('textbox', { name: 'Locked' });
      expect(box).toBeDisabled();
      await user.type(box, 'x');
      expect(box).toHaveValue('fixed');
    });

    it('submits its value under `name`', async () => {
      const user = userEvent.setup();
      let submitted: FormData | undefined;
      render(
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitted = new FormData(e.currentTarget);
          }}
        >
          <Field label="City" name="city" />
          <button type="submit">Send</button>
        </form>,
      );
      await user.type(screen.getByRole('textbox', { name: 'City' }), 'Cluj');
      await user.click(screen.getByRole('button', { name: 'Send' }));
      expect(submitted?.get('city')).toBe('Cluj');
    });
  });
}
