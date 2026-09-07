import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

// Foundations doc for the effect styles shipped in @max-core/tokens (the
// `effects` block → --effect-* CSS vars). Classes are full literals so
// Tailwind's static extractor keeps them. Shadows carry a branded tint via
// shadow-color 1–4 (light/dark-aware variables).

const meta = {
  title: 'Foundations/Effects',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-[var(--spacing-16)]">
      <h3 className="text-base font-bold text-[var(--text-primary)]">{title}</h3>
      <div className="flex flex-wrap gap-[var(--spacing-32)]">{children}</div>
    </section>
  );
}

function Swatch({ label, cls }: { label: string; cls: string }) {
  return (
    <div className="flex flex-col items-center gap-[var(--spacing-08)]">
      <div className={`size-24 rounded-[var(--radius-l)] bg-[var(--bg-surface)] ${cls}`} />
      <code className="text-xs text-[var(--text-muted)]">{label}</code>
    </div>
  );
}

export const Overview: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-48)] bg-[var(--bg-default)] p-[var(--spacing-32)]">
      <Section title="Drop shadow — down">
        <Swatch label="down / sm" cls="shadow-[var(--effect-shadow-down-sm)]" />
        <Swatch label="down / md" cls="shadow-[var(--effect-shadow-down-md)]" />
        <Swatch label="down / lg" cls="shadow-[var(--effect-shadow-down-lg)]" />
        <Swatch label="down / xl" cls="shadow-[var(--effect-shadow-down-xl)]" />
      </Section>

      <Section title="Drop shadow — up">
        <Swatch label="up / sm" cls="shadow-[var(--effect-shadow-up-sm)]" />
        <Swatch label="up / md" cls="shadow-[var(--effect-shadow-up-md)]" />
        <Swatch label="up / lg" cls="shadow-[var(--effect-shadow-up-lg)]" />
        <Swatch label="up / xl" cls="shadow-[var(--effect-shadow-up-xl)]" />
      </Section>

      <Section title="Inner shadow">
        <Swatch label="inner / sm" cls="shadow-[var(--effect-shadow-inner-sm)]" />
        <Swatch label="inner / md" cls="shadow-[var(--effect-shadow-inner-md)]" />
        <Swatch label="inner / lg" cls="shadow-[var(--effect-shadow-inner-lg)]" />
      </Section>

      <Section title="Glass">
        <Swatch label="glass / elevated" cls="shadow-[var(--effect-glass-elevated)]" />
      </Section>

      <section className="flex max-w-2xl flex-col gap-[var(--spacing-08)] border-[var(--border-muted)] border-t pt-[var(--spacing-16)]">
        <h3 className="text-base font-bold text-[var(--text-primary)]">Not yet tokenized</h3>
        <p className="text-sm font-light text-[var(--text-secondary)]">
          The Figma Effects page also documents <b>glass / base</b>, <b>glass / strong</b>, and{' '}
          <b>blur / xs · sm · md</b>. These are not present in the tokens package yet (only{' '}
          <code>effect/glass/elevated</code> ships), so no CSS var exists to preview. Values are
          left unset rather than invented — fold them in when the tokens are exported.
        </p>
      </section>
    </div>
  ),
};
