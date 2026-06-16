import { useEffect, useState, type ReactNode } from 'react';
import { Avatar, Badge, Button, Input, Tag } from '@max-core/react';
import {
  ArrowRight,
  Hash,
  Moon,
  Plus,
  Search,
  Star,
  Sun,
  Trash2,
  X,
} from 'lucide-react';

type Theme = 'light' | 'dark';

const sampleAvatar = 'https://i.pravatar.cc/150?img=12';

export function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border-muted)] bg-[var(--bg-surface)] px-8 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-[var(--radius-l)] bg-[var(--accent-default)]">
              <Star className="text-[var(--text-on-accent)]" size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-[var(--text-primary)]">
                Max Core
              </h1>
              <p className="text-xs text-[var(--text-muted)]">Consumer showcase</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="m"
            onClick={toggleTheme}
            leftIcon={theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          >
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-16 px-8 py-12">
        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
            Reference consumer app
          </p>
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            How to use @max-core/react in your project
          </h2>
          <p className="max-w-2xl text-[var(--text-secondary)]">
            This is the smallest possible Vite + React + Tailwind&nbsp;v4 app that
            consumes the Max Core library. It imports the React atoms, loads{' '}
            <code className="rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 text-xs">
              tokens.css
            </code>{' '}
            for the design tokens, and uses the same Tailwind setup any
            downstream project would. Toggle dark mode above to see the token
            cascade in action.
          </p>
        </section>

        <Section
          title="Buttons"
          description="3 variants × 4 tones × 4 sizes plus left/right icon slots."
        >
          <Row>
            <Button>Save changes</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="ghost">Skip</Button>
          </Row>
          <Row>
            <Button tone="default">Default</Button>
            <Button tone="danger">Danger</Button>
            <Button tone="success">Success</Button>
            <Button tone="warning">Warning</Button>
          </Row>
          <Row>
            <Button leftIcon={<Plus size={16} />}>Add user</Button>
            <Button rightIcon={<ArrowRight size={16} />}>Continue</Button>
            <Button
              variant="secondary"
              tone="danger"
              leftIcon={<Trash2 size={16} />}
            >
              Delete account
            </Button>
          </Row>
          <Row>
            <Button size="s">Small</Button>
            <Button size="m">Medium</Button>
            <Button size="l">Large</Button>
            <Button size="xl">Extra large</Button>
          </Row>
        </Section>

        <Section
          title="Avatars"
          description="Image with initials fallback. Five sizes."
        >
          <Row>
            {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Avatar
                  size={size}
                  src={sampleAvatar}
                  alt="Max"
                  fallback="MX"
                />
                <span className="text-xs uppercase text-[var(--text-muted)]">
                  {size}
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2">
              <Avatar size="l" fallback="JD" />
              <span className="text-xs uppercase text-[var(--text-muted)]">
                fallback
              </span>
            </div>
          </Row>
        </Section>

        <Section title="Badges" description="Status pills in five tones.">
          <Row>
            <Badge>12</Badge>
            <Badge tone="danger">Error</Badge>
            <Badge tone="success">Live</Badge>
            <Badge tone="warning">Beta</Badge>
            <Badge tone="neutral">Draft</Badge>
          </Row>
        </Section>

        <Section
          title="Tags"
          description="Filled / outline / ghost variants with optional icons and a selected state."
        >
          <Row>
            <Tag leftIcon={<Hash size={12} />}>Design</Tag>
            <Tag variant="outline">Engineering</Tag>
            <Tag variant="ghost">Marketing</Tag>
            <Tag selected>Picked</Tag>
          </Row>
          <Row>
            <Tag tone="success">Online</Tag>
            <Tag tone="warning">Beta</Tag>
            <Tag tone="danger" rightIcon={<X size={12} />}>
              Remove me
            </Tag>
            <Tag variant="outline" leftIcon={<Star size={12} />}>
              Featured
            </Tag>
          </Row>
        </Section>

        <Section
          title="Inputs"
          description="Three sizes, label / helper / error slots. Bound via Base UI Field."
        >
          <div className="grid max-w-md grid-cols-1 gap-4">
            <Input
              label="Search"
              placeholder="Start typing…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              helper="Controlled input — value echoes below."
            />
            <Input
              label="Email"
              defaultValue="not-an-email"
              errorMessage="Please enter a valid email address."
            />
            <Input size="s" label="Small input" placeholder="32px tall" />
            <Input size="l" label="Large input" placeholder="48px tall" />
          </div>
          {query && (
            <p className="text-sm text-[var(--text-secondary)]">
              You typed:{' '}
              <code className="rounded bg-[var(--bg-subtle)] px-2 py-1 font-bold text-[var(--text-primary)]">
                {query}
              </code>
            </p>
          )}
        </Section>

        <Section
          title="Composing directly with tokens"
          description="Components are CSS-variable-driven. You can build your own primitives the same way — no Max Core import required."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-l)] bg-[var(--accent-default)]">
                <Search className="text-[var(--text-on-accent)]" size={20} />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-[var(--text-primary)]">
                  Custom card
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Uses{' '}
                  <code className="rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 text-xs">
                    var(--bg-surface)
                  </code>
                  ,{' '}
                  <code className="rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 text-xs">
                    var(--radius-xl)
                  </code>
                  , and friends.
                </p>
              </div>
            </div>
            <div className="space-y-2 rounded-[var(--radius-xl)] border border-[var(--status-danger-border)] bg-[var(--status-danger-subtle)] p-6">
              <h3 className="font-bold text-[var(--status-danger-default)]">
                Danger banner
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Status tokens cascade through the same mechanism. Swap the
                Figma source and this banner colors update automatically.
              </p>
              <Row>
                <Button tone="danger" size="s">
                  Acknowledge
                </Button>
                <Button variant="ghost" tone="danger" size="s">
                  Dismiss
                </Button>
              </Row>
            </div>
          </div>
        </Section>
      </main>

      <footer className="border-t border-[var(--border-muted)] px-8 py-6">
        <div className="mx-auto max-w-5xl text-xs text-[var(--text-muted)]">
          Built with <code>@max-core/react</code>. See <code>README.md</code>{' '}
          for setup details.
        </div>
      </footer>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
        {description ? (
          <p className="text-sm text-[var(--text-secondary)]">{description}</p>
        ) : null}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}
