import { ScrollArea, ScrollBar } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Atoms/ScrollBar',
  component: ScrollBar,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ScrollBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Alongside a scrollable region, showing scroll position.
export const InContext: Story = {
  render: () => (
    <div className="flex h-40 gap-[var(--spacing-04)]">
      <div className="h-full w-64 overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-subtle)] p-[var(--spacing-16)] text-[var(--text-secondary)]">
        <p>Scrollable content…</p>
      </div>
      <ScrollBar className="self-start" />
    </div>
  ),
};

// Restyling the *native* browser scrollbar via the `.styled-scrollbar` utility
// (from @max-core-ds/tokens/scrollbar.css). This skins the real scroll region's own
// scrollbar with tokens — distinct from the decorative ScrollBar atom above.
// Firefox gets the thin themed bar; Chromium/Safari get the full rounded thumb.
export const NativeScrollbar: Story = {
  render: () => {
    const lines = Array.from({ length: 14 }, (_, i) => `Line ${i + 1}`);
    return (
      <div className="styled-scrollbar h-40 w-72 overflow-y-auto rounded-[var(--radius-md)] bg-[var(--bg-subtle)] p-[var(--spacing-16)] text-[var(--text-secondary)]">
        {lines.map((line) => (
          <p key={line} className="mb-[var(--spacing-12)]">
            {line} — scroll to see the themed native scrollbar.
          </p>
        ))}
      </div>
    );
  },
};

// ScrollArea hides the native scrollbar and renders the ScrollBar atom as an
// *external* rail beside the content — the rail sits outside the content box,
// which a native scrollbar can't do. Click or drag the rail to scroll.
export const ExternalRail: Story = {
  render: () => {
    const lines = Array.from({ length: 16 }, (_, i) => `Line ${i + 1}`);
    return (
      <ScrollArea className="h-40 w-72">
        <div className="rounded-[var(--radius-md)] bg-[var(--bg-subtle)] p-[var(--spacing-16)] text-[var(--text-secondary)]">
          {lines.map((line) => (
            <p key={line} className="mb-[var(--spacing-12)]">
              {line} — external rail, driven by scroll.
            </p>
          ))}
        </div>
      </ScrollArea>
    );
  },
};

// Horizontal ScrollArea: the external rail sits below the content.
export const ExternalRailHorizontal: Story = {
  render: () => {
    const cols = Array.from({ length: 12 }, (_, i) => `Card ${i + 1}`);
    return (
      <ScrollArea orientation="horizontal" className="w-80">
        <div className="flex w-max gap-[var(--spacing-12)]">
          {cols.map((col) => (
            <div
              key={col}
              className="flex h-24 w-40 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
            >
              {col}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  },
};
