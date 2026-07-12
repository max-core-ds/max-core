import { ItemList, ListItem } from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRight, CreditCard, Settings, User } from 'lucide-react';

const meta = {
  title: 'Molecules/Overlays/Item List',
  component: ItemList,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
} satisfies Meta<typeof ItemList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ItemList label="Account" helper="Manage your profile">
      <ListItem leftIcon={<User />} rightIcon={<ChevronRight />}>
        Profile
      </ListItem>
      <ListItem leftIcon={<CreditCard />} rightIcon={<ChevronRight />}>
        Billing
      </ListItem>
      <ListItem leftIcon={<Settings />} rightIcon={<ChevronRight />}>
        Settings
      </ListItem>
    </ItemList>
  ),
};
