import { Pagination } from '@max-core-ds/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta = {
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  // page/count are required; the render-only stories below manage their own state.
  args: { page: 1, count: 10 },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({ count = 10 }: { count?: number }) {
  const [page, setPage] = useState(1);
  return <Pagination page={page} count={count} onPageChange={setPage} />;
}

export const Default: Story = { render: () => <Controlled /> };

export const ManyPages: Story = { render: () => <Controlled count={42} /> };
