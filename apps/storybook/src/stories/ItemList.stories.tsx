import { ItemList, ListItem } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Triangle } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Molecules/Item List',
  component: ItemList,
  parameters: { layout: 'padded' },
  args: { showDivider: true, showScrollBar: true },
  decorators: [(Story) => <div className="w-60">{Story()}</div>],
} satisfies Meta<typeof ItemList>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = Array.from({ length: 8 }, (_, i) => `Item ${i + 1}`);

// Mirrors the Figma master: search + select all + divider + scrolling rows.
// Search filters the rows; "Select all" toggles every visible row.
export const Default: Story = {
  render: (args) => {
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<string[]>([]);
    const visible = ITEMS.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
    const selectedVisible = visible.filter((item) => selected.includes(item));
    const allSelected = visible.length > 0 && selectedVisible.length === visible.length;
    const toggle = (item: string) =>
      setSelected((s) => (s.includes(item) ? s.filter((x) => x !== item) : [...s, item]));
    return (
      <ItemList
        {...args}
        className="max-h-64"
        search={{
          placeholder: 'Search...',
          value: query,
          onChange: (event) => setQuery(event.currentTarget.value),
          onClear: () => setQuery(''),
        }}
        selectAll={{
          checked: allSelected,
          indeterminate: selectedVisible.length > 0 && !allSelected,
          onCheckedChange: (checked) =>
            setSelected((s) =>
              checked
                ? [...new Set([...s, ...visible])]
                : s.filter((item) => !visible.includes(item)),
            ),
        }}
      >
        {visible.map((item) => (
          <ListItem
            key={item}
            leftIcon={<Triangle />}
            active={selected.includes(item)}
            onClick={() => toggle(item)}
          >
            {item}
          </ListItem>
        ))}
      </ItemList>
    );
  },
};

// Minimal — items only (no search, select all or divider).
export const ItemsOnly: Story = {
  render: (args) => (
    <ItemList {...args}>
      {ITEMS.slice(0, 3).map((item) => (
        <ListItem key={item} leftIcon={<Triangle />}>
          {item}
        </ListItem>
      ))}
    </ItemList>
  ),
};
