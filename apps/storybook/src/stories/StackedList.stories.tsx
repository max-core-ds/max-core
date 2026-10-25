import { Avatar, IconOnlyButton, StackedList, StackedListRow } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown, ChevronRight, Equal, Settings, Trash2 } from 'lucide-react';

const meta = {
  title: 'Organisms/Stacked List',
  component: StackedList,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="max-w-[375px]">{Story()}</div>],
  argTypes: { bordered: { control: 'boolean' }, divided: { control: 'boolean' } },
} satisfies Meta<typeof StackedList>;

export default meta;
type Story = StoryObj<typeof meta>;

// The four built row types with the master's default content. The 56px media /
// product slot crops whatever it holds to the Item Radius.
export const Default: Story = {
  render: (args) => (
    <StackedList {...args}>
      <StackedListRow
        variant="default"
        leading={<Settings />}
        title="Settings"
        subtitle="options"
        trailing={
          <IconOnlyButton variant="ghost" size="s" icon={<ChevronRight />} aria-label="Open" />
        }
      />
      <StackedListRow
        variant="social"
        leading={<Avatar size="s" src="https://i.pravatar.cc/64?img=12" />}
        title="Your story"
        subtitle="View share options"
        subtitleIcon={<ChevronDown />}
        trailing={
          <IconOnlyButton variant="ghost" size="s" icon={<ChevronRight />} aria-label="Open" />
        }
      />
      <StackedListRow
        variant="media"
        leading={
          <img alt="" src="https://picsum.photos/seed/dog/112" className="size-full object-cover" />
        }
        title="Where the dog's at"
        subtitle="Dog • Balling hard"
        trailing={<Equal className="size-[var(--size-24)] text-[var(--text-secondary)]" />}
      />
      <StackedListRow
        variant="product"
        leading={
          <img
            alt=""
            src="https://picsum.photos/seed/phone/112"
            className="size-full object-cover"
          />
        }
        title="Iphone 17 pro"
        subtitle="512GB • Orange"
        price="$999"
        trailing={
          <IconOnlyButton
            variant="ghost"
            tone="danger"
            size="s"
            icon={<Trash2 />}
            aria-label="Remove"
          />
        }
      />
    </StackedList>
  ),
};

// Clickable rows (`onClick`) render as buttons with hover + focus ring.
export const Interactive: Story = {
  render: (args) => (
    <StackedList {...args}>
      {['Profile', 'Billing', 'Security'].map((title) => (
        <StackedListRow
          key={title}
          leading={<Settings />}
          title={title}
          subtitle="options"
          trailing={<ChevronRight className="size-[var(--size-20)] text-[var(--accent-default)]" />}
          onClick={() => {}}
        />
      ))}
    </StackedList>
  ),
};
