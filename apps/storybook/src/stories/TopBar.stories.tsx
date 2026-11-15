import {
  Avatar,
  Button,
  EntityCard,
  EntityItem,
  IconOnlyButton,
  SearchBar,
  TopBar,
} from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu, Plus, Search } from 'lucide-react';

const meta = {
  title: 'Organisms/Top Bar',
  component: TopBar,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['desktop', 'mobile'] },
    type: { control: 'inline-radio', options: ['standard', 'mobile'] },
    elevated: { control: 'boolean' },
    leading: { control: false },
    center: { control: false },
    trailing: { control: false },
  },
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// The master's default slot content: logo + Search bar M (Button=On) leading,
// Button L + Entity Card trailing.
export const Desktop: Story = {
  args: {
    variant: 'desktop',
    leading: (
      <>
        <span className="text-lg font-black text-[var(--text-primary)]">Logo</span>
        <SearchBar
          size="m"
          placeholder="Search..."
          className="w-[270px]"
          action={<Button size="s">Search</Button>}
        />
      </>
    ),
    trailing: (
      <>
        <Button size="l" rightIcon={<Plus />}>
          New project
        </Button>
        <EntityCard>
          <EntityItem
            leading={<Avatar size="m" src="https://i.pravatar.cc/80?img=15" fallback="U" />}
            title="Username"
          />
        </EntityCard>
      </>
    ),
  },
};

// Type=Standard — square frosted bar: left icon, centred H5 title, right icon.
export const MobileStandard: Story = {
  decorators: [(Story) => <div className="w-[393px]">{Story()}</div>],
  args: {
    variant: 'mobile',
    type: 'standard',
    leading: <IconOnlyButton variant="ghost" size="l" icon={<Menu />} aria-label="Menu" />,
    center: 'Page title',
    trailing: <IconOnlyButton variant="ghost" size="l" icon={<Search />} aria-label="Search" />,
  },
};

// Type=Mobile — floating: frosted circular buttons on top, H4 page title below.
export const MobileFloating: Story = {
  decorators: [(Story) => <div className="w-[393px]">{Story()}</div>],
  args: { ...MobileStandard.args, type: 'mobile' },
};
