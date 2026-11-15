import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Tokens',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const colorTokens = [
  ['bg/surface', '--bg-surface'],
  ['bg/default', '--bg-default'],
  ['bg/subtle', '--bg-subtle'],
  ['text/primary', '--text-primary'],
  ['text/secondary', '--text-secondary'],
  ['text/muted', '--text-muted'],
  ['text/on-accent', '--text-on-accent'],
  ['accent/default', '--accent-default'],
  ['accent/hover', '--accent-hover'],
  ['accent/active', '--accent-active'],
  ['accent/subtle', '--accent-subtle'],
  ['accent/surface', '--accent-surface'],
  ['border/default', '--border-default'],
  ['border/muted', '--border-muted'],
  ['border/accent', '--border-accent'],
  ['border/focus', '--border-focus'],
  ['status/danger/default', '--status-danger-default'],
  ['status/danger/subtle', '--status-danger-subtle'],
  ['status/success/default', '--status-success-default'],
  ['status/success/subtle', '--status-success-subtle'],
  ['status/warning/default', '--status-warning-default'],
  ['status/warning/subtle', '--status-warning-subtle'],
] as const;

const spacingTokens = ['04', '08', '12', '16', '20', '24', '32', '48', '64'] as const;

const radiusTokens = ['none', 'xs', 'sm', 'md', 'l', 'xl', '2xl', '3xl', 'full'] as const;

function Swatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className="flex items-center gap-[var(--spacing-12)]">
      <div
        className="h-10 w-10 shrink-0 rounded-[var(--radius-md)] border border-[var(--border-default)]"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div className="flex flex-col">
        <code className="text-sm font-bold text-[var(--text-primary)]">{name}</code>
        <code className="text-xs text-[var(--text-muted)]">{cssVar}</code>
      </div>
    </div>
  );
}

export const Colors: Story = {
  render: () => (
    <div className="min-h-screen bg-[var(--bg-default)] p-[var(--spacing-32)]">
      <h2 className="mb-[var(--spacing-24)] text-2xl font-bold text-[var(--text-primary)]">
        Color tokens
      </h2>
      <div className="grid grid-cols-2 gap-[var(--spacing-16)] md:grid-cols-3 lg:grid-cols-4">
        {colorTokens.map(([name, cssVar]) => (
          <Swatch key={cssVar} name={name} cssVar={cssVar} />
        ))}
      </div>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="min-h-screen bg-[var(--bg-default)] p-[var(--spacing-32)]">
      <h2 className="mb-[var(--spacing-24)] text-2xl font-bold text-[var(--text-primary)]">
        Spacing scale
      </h2>
      <div className="flex flex-col gap-[var(--spacing-12)]">
        {spacingTokens.map((value) => (
          <div key={value} className="flex items-center gap-[var(--spacing-16)]">
            <code className="w-32 text-sm font-bold text-[var(--text-primary)]">
              --spacing-{value}
            </code>
            <div
              className="h-4 bg-[var(--accent-default)]"
              style={{ width: `var(--spacing-${value})` }}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div className="min-h-screen bg-[var(--bg-default)] p-[var(--spacing-32)]">
      <h2 className="mb-[var(--spacing-24)] text-2xl font-bold text-[var(--text-primary)]">
        Radius scale
      </h2>
      <div className="flex flex-wrap gap-[var(--spacing-16)]">
        {radiusTokens.map((value) => (
          <div key={value} className="flex flex-col items-center gap-[var(--spacing-08)]">
            <div
              className="size-16 bg-[var(--accent-subtle)] border-2 border-[var(--accent-default)]"
              style={{ borderRadius: `var(--radius-${value})` }}
            />
            <code className="text-xs text-[var(--text-muted)]">--radius-{value}</code>
          </div>
        ))}
      </div>
    </div>
  ),
};
