import {
  Avatar,
  AvatarGroup,
  Badge,
  LinkButton,
  StackedList,
  StackedListRow,
  Thumbnail,
} from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRight, CreditCard, Settings, User } from 'lucide-react';

const meta = {
  title: 'Organisms/Stacked List',
  component: StackedList,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-md">{Story()}</div>],
} satisfies Meta<typeof StackedList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StackedList>
      <StackedListRow
        variant="default"
        leading={<User />}
        title="Profile"
        subtitle="Name, photo, contact"
        trailing={<ChevronRight className="text-[var(--text-muted)]" />}
        onClick={() => {}}
      />
      <StackedListRow
        variant="default"
        leading={<CreditCard />}
        title="Billing"
        subtitle="Plan and invoices"
        trailing={<ChevronRight className="text-[var(--text-muted)]" />}
        onClick={() => {}}
      />
      <StackedListRow
        variant="default"
        leading={<Settings />}
        title="Settings"
        subtitle="Preferences and security"
        trailing={<ChevronRight className="text-[var(--text-muted)]" />}
        onClick={() => {}}
      />
    </StackedList>
  ),
};

export const Variants: Story = {
  render: () => (
    <StackedList>
      <StackedListRow
        variant="social"
        leading={<Avatar size="s" fallback="AM" />}
        title="Ana Marin"
        subtitle="Commented on your post"
        trailing={<Badge tone="default">New</Badge>}
      />
      <StackedListRow
        variant="social"
        leading={
          <AvatarGroup
            size="s"
            max={3}
            avatars={[{ fallback: 'A' }, { fallback: 'B' }, { fallback: 'C' }, { fallback: 'D' }]}
          />
        }
        title="Design review"
        subtitle="4 people are attending"
        trailing={<LinkButton>Join</LinkButton>}
      />
      <StackedListRow
        variant="media"
        leading={<Thumbnail shape="square" size="l" fallback="▶" />}
        title="Weekly sync recording"
        subtitle="42:18 · yesterday"
        trailing={<LinkButton>Play</LinkButton>}
      />
      <StackedListRow
        variant="product"
        leading={<Thumbnail shape="square" size="l" fallback="📦" />}
        title="Mechanical keyboard"
        subtitle="In stock"
        trailing={<span className="font-bold text-[var(--text-primary)]">$129</span>}
      />
    </StackedList>
  ),
};
