import {
  Avatar,
  BottomSheet,
  Button,
  Checkbox,
  DatePicker,
  Divider,
  HeadingBlock,
  Input,
  Range,
  SearchBar,
  SelectInput,
  ShareItem,
  StackedListRow,
  Switch,
  Tabs,
  Tag,
  TextBlock,
  Textarea,
} from '@max-core/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AtSign,
  Bell,
  Camera,
  ChevronRight,
  CreditCard,
  Download,
  Equal,
  Globe,
  Link,
  Lock,
  Mail,
  MessageCircle,
  Moon,
  MoreHorizontal,
  Plus,
  ScanLine,
  Send,
  Shield,
  Star,
  User,
  Volume2,
  Wallet,
} from 'lucide-react';
import type { ReactNode } from 'react';

const meta = {
  title: 'Organisms/Bottom Sheet',
  component: BottomSheet,
  parameters: { layout: 'centered' },
  argTypes: {
    title: { control: 'text' },
    trigger: { control: false },
    children: { control: false },
    footer: { control: false },
  },
  // The builder's defaults: handle, header (title + ✕), a body, a two-button footer.
  args: {
    defaultOpen: true,
    trigger: <Button>Open sheet</Button>,
    title: 'Title',
    handle: true,
    showClose: true,
    children: <TextBlock className="px-[var(--spacing-16)]">Body Content slot.</TextBlock>,
    footer: (
      <>
        <Button variant="secondary" size="s">
          Cancel
        </Button>
        <Button size="s">Confirm</Button>
      </>
    ),
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// ---------------------------------------------------------------------------
// Premades — the Figma "Premade Bottom sheets" set, composed from DS parts into
// the builder's slots. Content recipes, not library components. Not built yet:
// Transport / Map, Ride / Driver Details, Ride / Delivery Track and Booking /
// Place List (their Stacked List row types are deferred); General / Sort is a
// copy of Settings in the master.

const pad = 'px-[var(--spacing-16)]';
const icon = 'size-[var(--size-24)] text-[var(--text-secondary)]';

function ShareRow({ children }: { children: ReactNode }) {
  // Stacked List "Items grid" row: 12 / 16 padding, items spread across the width.
  return (
    <div className="flex items-start justify-between px-[var(--spacing-16)] py-[var(--spacing-12)]">
      {children}
    </div>
  );
}

const person = (img: number) => `https://i.pravatar.cc/80?img=${img}`;
const photo = (seed: string) => (
  <img alt="" src={`https://picsum.photos/seed/${seed}/112`} className="size-full object-cover" />
);

type Premade = {
  title?: string;
  footer?: ReactNode;
  body: ReactNode;
};

const premades = {
  'Share / App Actions': {
    title: 'Share',
    body: (
      <>
        <ShareRow>
          <ShareItem label="Message" icon={<MessageCircle />} />
          <ShareItem label="Instagram" icon={<Camera />} />
          <ShareItem label="Linkedin" icon={<AtSign />} />
          <ShareItem label="Facebook" icon={<Send />} />
          <ShareItem label="Email" icon={<Mail />} />
        </ShareRow>
        <Divider />
        <ShareRow>
          <ShareItem label="Save" icon={<Download />} />
          <ShareItem label="Copy link" icon={<Link />} />
          <ShareItem label="More" icon={<MoreHorizontal />} />
        </ShareRow>
      </>
    ),
  },
  'Share / Quick Contacts': {
    title: 'Share',
    body: (
      <>
        <ShareRow>
          <ShareItem label="Max" avatar={<Avatar size="l" src={person(12)} />} />
          <ShareItem label="Alice" avatar={<Avatar size="l" src={person(32)} />} />
          <ShareItem label="Calu" avatar={<Avatar size="l" src={person(53)} />} />
          <ShareItem label="Add" icon={<Plus />} />
        </ShareRow>
        <Divider />
        <ShareRow>
          <ShareItem label="Save" icon={<Download />} />
          <ShareItem label="Copy link" icon={<Link />} />
          <ShareItem label="Report" icon={<Shield />} tone="danger" />
          <ShareItem label="More" icon={<MoreHorizontal />} />
        </ShareRow>
      </>
    ),
  },
  'Share / Social List': {
    title: 'Share with',
    body: (
      <>
        <div className={pad}>
          <SearchBar size="s" placeholder="Search..." />
        </div>
        <StackedListRow
          variant="social"
          leading={<Avatar size="s" src={person(20)} />}
          title="Your story"
          subtitle="View share options"
          subtitleIcon={<ChevronRight />}
        />
        <StackedListRow
          variant="social"
          leading={<Avatar size="s" fallback="CL" />}
          title="Create a list"
          subtitle="View share options"
          subtitleIcon={<ChevronRight />}
        />
        <HeadingBlock className={pad}>Suggested</HeadingBlock>
        {(
          [
            ['Nia', 45],
            ['Joe', 14],
            ['Leo', 60],
          ] as const
        ).map(([name, img]) => (
          <StackedListRow
            key={name}
            variant="social"
            leading={<Avatar size="s" src={person(img)} />}
            title={name}
            trailing={
              <Button variant="secondary" size="s">
                Send
              </Button>
            }
          />
        ))}
      </>
    ),
  },
  'General / Feedback': {
    body: (
      <div className="flex flex-col items-center gap-[var(--spacing-16)] text-center">
        <Avatar size="xl" src={person(15)} fallback="MC" />
        <HeadingBlock>How was your delivery?</HeadingBlock>
        <TextBlock>Help us improve our service.</TextBlock>
        <div className="flex gap-[var(--spacing-16)]" role="img" aria-label="3 of 5 stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={`size-[var(--size-24)] ${n <= 3 ? 'text-[var(--status-warning-default)]' : 'text-[var(--text-muted)]'}`}
            />
          ))}
        </div>
        <div className={`${pad} w-full text-left`}>
          <Textarea label="Write a comment..." placeholder="Write here" />
        </div>
      </div>
    ),
    footer: (
      <>
        <Button variant="secondary" tone="warning" size="s">
          Skip
        </Button>
        <Button size="s">Submit</Button>
      </>
    ),
  },
  'General / Settings': {
    title: 'Settings',
    body: (
      <div>
        <StackedListRow leading={<Moon />} title="Dark mode" trailing={<Switch size="s" />} />
        <StackedListRow
          leading={<Bell />}
          title="Notification"
          trailing={<Switch size="s" defaultChecked />}
        />
        <StackedListRow
          leading={<Volume2 />}
          title="Sound"
          trailing={<Switch size="s" defaultChecked />}
        />
        <StackedListRow
          leading={<Globe />}
          title="Language"
          subtitle="English"
          trailing={<ChevronRight className={icon} />}
          onClick={() => {}}
        />
        <StackedListRow
          leading={<Lock />}
          title="Privacy"
          trailing={<ChevronRight className={icon} />}
          onClick={() => {}}
        />
      </div>
    ),
  },
  'Payment / Method List': {
    title: 'Payment Method',
    body: (
      <div>
        <StackedListRow
          leading={<CreditCard />}
          title="Visa •••• 4242"
          subtitle="Expires 12/28"
          onClick={() => {}}
        />
        <StackedListRow
          leading={<CreditCard />}
          title="Mastercard •••• 8899"
          subtitle="Expires 01/26"
          onClick={() => {}}
        />
        <StackedListRow
          leading={<Wallet />}
          title="PayPal"
          subtitle="alex@design.com"
          onClick={() => {}}
        />
        <StackedListRow leading={<Wallet />} title="Google Pay" onClick={() => {}} />
        <StackedListRow leading={<Wallet />} title="Apple Pay" onClick={() => {}} />
      </div>
    ),
    footer: (
      <Button size="s" leftIcon={<Plus />}>
        Add new
      </Button>
    ),
  },
  'Payment / Add Card': {
    title: 'Add Payment Method',
    body: (
      <div className={`${pad} flex flex-col gap-[var(--spacing-16)]`}>
        <Input label="Card Number" placeholder="0000 0000 0000 0000" inputMode="numeric" />
        <div className="grid grid-cols-2 gap-[var(--spacing-12)]">
          <Input label="Expiry Date" placeholder="MM/YY" />
          <Input label="CVV" placeholder="123" inputMode="numeric" />
        </div>
        <Input label="Card Holder Name" placeholder="John doe" />
      </div>
    ),
    footer: (
      <>
        <Button variant="secondary" size="s" leftIcon={<ScanLine />}>
          Scan card
        </Button>
        <Button size="s" leftIcon={<Plus />}>
          Save card
        </Button>
      </>
    ),
  },
  'Media / Playlist': {
    body: (
      <>
        <div className={pad}>
          <Tabs
            defaultValue="next"
            items={[
              { value: 'next', label: 'Up Next' },
              { value: 'playing', label: 'Now Playing' },
              { value: 'lyrics', label: 'Lyrics' },
              { value: 'related', label: 'Related' },
            ]}
          />
        </div>
        <div>
          {['dog', 'cat', 'fox', 'owl', 'bee'].map((seed) => (
            <StackedListRow
              key={seed}
              variant="media"
              leading={photo(seed)}
              title="Where the dog's at"
              subtitle="Dog • Balling hard"
              trailing={<Equal className={icon} />}
            />
          ))}
        </div>
      </>
    ),
  },
  'Auth / Login': {
    body: (
      <div className="flex flex-col items-center gap-[var(--spacing-16)] text-center">
        <img alt="" src="https://picsum.photos/seed/dog/686/138" className="h-[69px] w-auto" />
        <HeadingBlock>Log in</HeadingBlock>
        <TextBlock>Welcome back. Sign in to continue.</TextBlock>
        <div className={`${pad} flex w-full flex-col gap-[var(--spacing-16)] text-left`}>
          <Input aria-label="Email" placeholder="Email" leadingIcon={<User />} />
          <Input aria-label="Password" placeholder="Password" type="password" />
          <Checkbox label="Keep me signed in" />
        </div>
      </div>
    ),
    footer: (
      <>
        <Button variant="secondary" size="s">
          Forgot password?
        </Button>
        <Button size="s">Log in</Button>
      </>
    ),
  },
  'Commerce / Cart': {
    title: 'Your cart',
    body: (
      <>
        <div>
          {(
            [
              ['Headphones', 'Black', 'headphones'],
              ['Gopro', 'Hero 13', 'camera'],
              ['Smart Watch', '44MM • Black', 'watch'],
              ['Iphone 17 pro', '512GB • Orange', 'phone'],
            ] as const
          ).map(([title, subtitle, seed]) => (
            <StackedListRow
              key={title}
              variant="product"
              leading={photo(seed)}
              title={title}
              subtitle={subtitle}
              price="$999"
            />
          ))}
        </div>
        <Divider />
        <div className={`${pad} flex flex-col gap-[var(--spacing-16)]`}>
          <TextBlock>Delivery Fee: $5</TextBlock>
          <HeadingBlock>Total: $2,004</HeadingBlock>
        </div>
      </>
    ),
    footer: (
      <>
        <Button variant="secondary" size="s">
          Shop more
        </Button>
        <Button size="s">Continue with payment</Button>
      </>
    ),
  },
  'Info / Terms': {
    title: 'Terms and conditions',
    body: (
      <TextBlock className={pad}>
        By accessing or using this application (the “Service”), you agree to be bound by these Terms
        & Service (“Terms”). If you do not agree, you must not use the Service.
        <br />
        <br />
        1. Using the Service — You may use the Service only in compliance with these Terms and any
        applicable laws. You are responsible for your own device, internet connection, and any
        activity performed through your account.
        <br />
        <br />
        2. Accounts & Security — If the Service requires an account, you agree to provide accurate
        information and keep it updated. You are responsible for safeguarding your credentials and
        for any actions taken under your account.
      </TextBlock>
    ),
  },
  'Commerce / Filter': {
    title: 'Filter',
    body: (
      <>
        <div className={pad}>
          <Range defaultValue={[20, 70]} showLabels />
        </div>
        <div className={`${pad} flex gap-[var(--spacing-16)] overflow-x-auto`}>
          <Tag selected>Electronics</Tag>
          <Tag selected>Accessories</Tag>
          <Tag>Audio</Tag>
          <Tag>Wearables</Tag>
        </div>
      </>
    ),
  },
  'Booking / Date Picker': {
    title: 'Choose date',
    body: (
      <>
        <DatePicker defaultValue="2026-10-25" className="w-full" />
        <div className={`${pad} flex flex-col gap-[var(--spacing-16)]`}>
          <SelectInput
            label="Check in"
            placeholder="Time"
            items={[
              { value: '14', label: '14:00' },
              { value: '16', label: '16:00' },
            ]}
          />
          <SelectInput
            label="Check out"
            placeholder="Time"
            items={[
              { value: '10', label: '10:00' },
              { value: '12', label: '12:00' },
            ]}
          />
        </div>
      </>
    ),
    footer: (
      <>
        <Button variant="secondary" size="s">
          Clear
        </Button>
        <Button size="s">Confirm</Button>
      </>
    ),
  },
} satisfies Record<string, Premade>;

type PremadeType = keyof typeof premades;
// URL-safe ids (Storybook drops arg values containing "/"), labelled with the Type names.
const premadeIds = Object.fromEntries(
  (Object.keys(premades) as PremadeType[]).map((name) => [
    name.toLowerCase().replace(/\W+/g, '-'),
    name,
  ]),
) as Record<string, PremadeType>;

// One story, the master's Type axis as a control (an id, mapped to its Type name).
export const Premade: StoryObj<{ type: string }> = {
  args: { type: 'share-app-actions' },
  argTypes: {
    type: {
      control: { type: 'select', labels: premadeIds },
      options: Object.keys(premadeIds),
      mapping: premadeIds,
    },
  },
  render: ({ type }) => {
    const p: Premade = premades[type as PremadeType];
    return (
      <BottomSheet
        key={type}
        defaultOpen
        trigger={<Button>Open {type}</Button>}
        title={p.title}
        footer={p.footer}
      >
        {p.body}
      </BottomSheet>
    );
  },
};
