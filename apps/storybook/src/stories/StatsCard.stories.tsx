import {
  ActionBar,
  Avatar,
  AvatarGroup,
  Button,
  ChartLegend,
  Dropdown,
  EntityCard,
  EntityItem,
  IconOnlyButton,
  LinkButton,
  StatsCard,
  StatsComparison,
  StatsMetric,
  Tabs,
  chartTheme,
} from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BadgeDollarSign, Briefcase, ChevronDown, Ellipsis, Plus, Triangle } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// The DS draws no charts: StatsCard sizes whatever goes in its `chart` slot. These
// stories use Recharts (a Storybook-only dev dependency) themed purely through
// `chartTheme` — the recipe for any SVG chart library.

const data = [
  { m: 'Jan', a: 68 },
  { m: 'Feb', a: 55 },
  { m: 'Mar', a: 100 },
  { m: 'Apr', a: 103 },
  { m: 'May', a: 48 },
  { m: 'Jun', a: 45 },
  { m: 'Jul', a: 12 },
];
const spark = [5, 3, 9, 9, 4, 4, 1, 6, 10, 4, 2, 7].map((a, i) => ({ i, a }));

const axisTick = { fill: chartTheme.axis, fontSize: 10, fontWeight: 300 };

function Line_({ axes = true }: { axes?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={axes ? data : spark} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid
          vertical={false}
          stroke={chartTheme.grid}
          strokeWidth={chartTheme.gridWidth}
        />
        {axes ? (
          <>
            <XAxis dataKey="m" tick={axisTick} tickLine={false} axisLine={false} tickMargin={6} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} width={32} tickMargin={6} />
          </>
        ) : null}
        <Line
          type="linear"
          dataKey="a"
          dot={false}
          stroke={chartTheme.series[0]}
          strokeWidth={chartTheme.lineWidth}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

const legend = (
  <ChartLegend
    items={[
      { label: 'Series A' },
      { label: 'Series B' },
      { label: 'Series C' },
      { label: 'Series D' },
    ]}
  />
);
const heading = (
  <StatsMetric
    label="Some statistics"
    info="Total across all workspaces"
    icon={<BadgeDollarSign />}
    value="324k"
  />
);
const menu = (
  <IconOnlyButton variant="ghost" size="s" icon={<Ellipsis />} aria-label="More actions" />
);

const meta = {
  title: 'Organisms/Stats Card',
  component: StatsCard,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['big', 'small', 'compact'] },
    size: { control: 'inline-radio', options: ['desktop', 'mobile'] },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
  },
} satisfies Meta<typeof StatsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Stats card small (Size=S 360 · L 560 — the width is the caller's).
export const Small: Story = {
  args: {
    variant: 'small',
    className: 'w-[360px]',
    icon: <Briefcase />,
    menu,
    heading,
    legend,
    chart: <Line_ />,
    footer: (
      <ActionBar>
        <Button size="s" leftIcon={<Triangle />} rightIcon={<Triangle />}>
          Button
        </Button>
        <Button size="s" leftIcon={<Triangle />} rightIcon={<Triangle />}>
          Button
        </Button>
      </ActionBar>
    ),
  },
};

const tabs = (
  <Tabs
    className="w-auto"
    items={['1', '2', '3', '4'].map((value) => ({ value, label: 'Text' }))}
  />
);
// The master's filter hugs on Desktop (167) and fills on Mobile.
const filter = (width: string) => (
  <Dropdown
    trigger={
      <EntityCard className={width}>
        <EntityItem
          title="Username"
          leading={<Avatar size="s" src="https://i.pravatar.cc/64?img=12" />}
        />
      </EntityCard>
    }
    items={[{ label: 'All users' }, { label: 'Only me' }]}
  />
);

// Stats card big, Size=Desktop (768 × 480).
export const Big: Story = {
  args: {
    variant: 'big',
    size: 'desktop',
    className: 'w-[768px]',
    heading,
    actions: (
      <ActionBar className="w-full max-w-[347px]">
        <Button size="s" leftIcon={<Triangle />} rightIcon={<Triangle />}>
          Button
        </Button>
        <Button size="s" leftIcon={<Triangle />} rightIcon={<Triangle />}>
          Button
        </Button>
      </ActionBar>
    ),
    tabs,
    filter: filter('w-auto'),
    legend,
    chart: <Line_ />,
    info: 'Updated 5 min ago',
    footer: <LinkButton rightIcon={<Triangle />}>Label</LinkButton>,
  },
};

// Stats card big, Size=Mobile (320 × 480): icon actions, filter over tabs.
export const BigMobile: Story = {
  args: {
    ...Big.args,
    size: 'mobile',
    className: 'w-[320px]',
    filter: filter('w-full'),
    actions: (
      <>
        <IconOnlyButton size="s" icon={<Plus />} aria-label="Add" />
        <IconOnlyButton size="s" icon={<ChevronDown />} aria-label="Expand" />
      </>
    ),
  },
};

// Stats card compact: Vertical (154) and Horizontal (247), with a spark line.
export const Compact: Story = {
  args: {
    variant: 'compact',
    orientation: 'vertical',
    className: 'w-[154px]',
    icon: <Briefcase />,
    menu,
    heading,
    legend,
    chart: <Line_ axes={false} />,
  },
};

export const CompactHorizontal: Story = {
  args: { ...Compact.args, orientation: 'horizontal', className: 'w-[247px]' },
};

// The internals: _Metric Avatars / _Metric User (a heading's children) and the
// _Comparison Group (two _Comparison Metrics, 32 apart).
export const Parts: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-24)]">
      <div className="flex gap-[var(--spacing-32)]">
        <StatsComparison label="Last month" info="Calendar month" value="$45,231" delta="21.3%" />
        <StatsComparison label="Last week" value="$9,120" delta="4.1%" trend="down" />
      </div>
      <StatsMetric label="Core departament" info="People on the team">
        <AvatarGroup
          size="s"
          max={3}
          avatars={[{ fallback: 'A' }, { fallback: 'B' }, { fallback: 'C' }, { fallback: 'D' }]}
        />
      </StatsMetric>
    </div>
  ),
};
