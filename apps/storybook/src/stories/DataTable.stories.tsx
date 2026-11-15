import {
  Badge,
  DataTable,
  type DataTableColumn,
  HeaderCell,
  Pagination,
  RatingStars,
  type SortState,
  Table,
  TableCell,
  TableRow,
} from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  status: 'active' | 'low' | 'out';
}

const rows: Product[] = [
  {
    id: 1,
    name: 'Mechanical keyboard',
    category: 'Peripherals',
    price: 129,
    rating: 4.6,
    status: 'active',
  },
  { id: 2, name: 'USB-C hub', category: 'Accessories', price: 49, rating: 4.1, status: 'low' },
  {
    id: 3,
    name: '27" 4K monitor',
    category: 'Displays',
    price: 389,
    rating: 4.8,
    status: 'active',
  },
  { id: 4, name: 'Wireless mouse', category: 'Peripherals', price: 39, rating: 3.9, status: 'out' },
  {
    id: 5,
    name: 'Laptop stand',
    category: 'Accessories',
    price: 59,
    rating: 4.4,
    status: 'active',
  },
];

const statusTone = { active: 'success', low: 'warning', out: 'danger' } as const;
const statusLabel = { active: 'In stock', low: 'Low stock', out: 'Out of stock' } as const;

const columns: DataTableColumn<Product>[] = [
  {
    key: 'name',
    header: 'Product',
    sortable: true,
    // _Cell Item / Product Info: thumbnail + Body/SM/700 title over a Caption/300
    // description (Product Info Gap 8, Title Subtitle Gap 4). Cell items are caller-composed.
    cell: (r) => (
      <span className="flex items-center gap-[var(--spacing-08)]">
        <img
          alt=""
          src={`https://picsum.photos/seed/p${r.id}/56`}
          className="size-[27px] object-cover"
        />
        <span className="flex flex-col gap-[var(--spacing-04)]">
          <span className="text-sm leading-[1.3] font-bold">{r.name}</span>
          <span className="text-xs leading-[1.3] font-light tracking-[0.005em] text-[var(--text-secondary)]">
            {r.category}
          </span>
        </span>
      </span>
    ),
  },
  { key: 'price', header: 'Price', sortable: true, align: 'right', cell: (r) => `$${r.price}` },
  {
    key: 'rating',
    header: 'Rating',
    sortable: true,
    cell: (r) => <RatingStars value={r.rating} />,
  },
  {
    key: 'status',
    header: 'Status',
    cell: (r) => <Badge tone={statusTone[r.status]}>{statusLabel[r.status]}</Badge>,
  },
];

const meta = {
  title: 'Organisms/Data Table',
  component: DataTable,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DataTable>;

export default meta;

export const Default: StoryObj = {
  render: () => {
    const Demo = () => {
      const [page, setPage] = useState(1);
      const [checked, setChecked] = useState<(string | number)[]>([]);
      return (
        <DataTable<Product>
          columns={columns}
          data={rows}
          getRowId={(r) => r.id}
          defaultSort={{ key: 'name', direction: 'asc' }}
          selectable
          selectedRowIds={checked}
          onSelectionChange={setChecked}
          header={
            <div className="flex items-baseline gap-[var(--spacing-08)]">
              <span className="text-lg font-bold text-[var(--text-primary)]">All products</span>
              <span className="text-sm text-[var(--text-secondary)]">
                {checked.length > 0 ? `${checked.length} selected` : `${rows.length} results`}
              </span>
            </div>
          }
          footerInfo={`Showing 1–${rows.length} of 25`}
          footer={<Pagination page={page} count={5} onPageChange={setPage} />}
        />
      );
    };
    return <Demo />;
  },
};

export const ControlledSort: StoryObj = {
  render: () => {
    const Demo = () => {
      const [sort, setSort] = useState<SortState | null>({ key: 'price', direction: 'desc' });
      const sorted = [...rows].sort((a, b) => {
        if (!sort) return 0;
        const dir = sort.direction === 'asc' ? 1 : -1;
        const av = a[sort.key as keyof Product];
        const bv = b[sort.key as keyof Product];
        return av < bv ? -1 * dir : av > bv ? 1 * dir : 0;
      });
      return (
        <DataTable<Product>
          columns={columns}
          data={sorted}
          getRowId={(r) => r.id}
          sort={sort}
          onSortChange={setSort}
        />
      );
    };
    return <Demo />;
  },
};

export const Primitives: StoryObj = {
  render: () => (
    <div className="overflow-hidden rounded-[var(--radius-xl)] bg-[var(--bg-surface)]">
      <Table>
        <thead>
          <tr>
            <HeaderCell>Name</HeaderCell>
            <HeaderCell align="right">Price</HeaderCell>
          </tr>
        </thead>
        <tbody>
          <TableRow>
            <TableCell>Mechanical keyboard</TableCell>
            <TableCell align="right">$129</TableCell>
          </TableRow>
          <TableRow selected>
            <TableCell>USB-C hub</TableCell>
            <TableCell align="right">$49</TableCell>
          </TableRow>
        </tbody>
      </Table>
    </div>
  ),
};
