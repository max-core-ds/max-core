import { Button, Input } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

// Foundations doc for utils/focus-ring.ts. The real utilities gate these same
// classes behind focus-visible / focus-within; the "preview" swatches apply
// them always-on so the geometry is visible without keyboard interaction.
const ringPreview =
  'ring-2 ring-[var(--border-focus)] ring-offset-2 ring-offset-[var(--bg-default)]';
const borderPreview =
  'border border-[var(--border-focus)] shadow-[inset_0_0_0_1px_var(--border-focus)]';

const meta = {
  title: 'Foundations/Focus Ring',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Row({ title, code, children }: { title: string; code: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[var(--spacing-12)]">
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary)]">{title}</h3>
        <code className="text-xs text-[var(--text-muted)]">{code}</code>
      </div>
      <div className="flex flex-wrap items-center gap-[var(--spacing-24)]">{children}</div>
    </div>
  );
}

const swatch =
  'grid size-16 place-items-center rounded-[var(--radius-md)] bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)]';

export const Overview: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-32)] bg-[var(--bg-default)] p-[var(--spacing-24)]">
      <p className="max-w-2xl text-sm font-light text-[var(--text-secondary)]">
        Focus indication uses <b>border/focus</b>. Hybrid model: <b>pressable</b> elements get an
        outset keyboard-focus ring (<code>focusRing</code>); bordered <b>fields</b> show focus on
        their own border, which turns border/focus at 2px (<code>focusBorder</code>, no ring). Tab
        through the live examples.
      </p>

      <Row
        title="focusRing — outset, keyboard focus"
        code="focus-visible:ring-2 · ring-offset-2 · border/focus"
      >
        <div className={`${swatch} ${ringPreview}`}>preview</div>
        <Button>Tab to focus</Button>
      </Row>

      <Row
        title="focusBorder — the field's own border, 2px"
        code="focus-within · border/focus · 1px border + 1px inset shadow"
      >
        <div className={`${swatch} ${borderPreview}`}>preview</div>
        <div className="w-56">
          <Input placeholder="Focus me" />
        </div>
      </Row>
    </div>
  ),
};
