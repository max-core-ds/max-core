# @max-core/react

React + Tailwind component library for the Max Core design system. Components are
token-bound (CSS custom properties emitted from Figma via `@max-core/tokens`) and
built on [Base UI](https://base-ui.com) for the headless primitives.

## State ownership convention

How a component handles a toggle-able / selectable value depends on **who owns the
truth**. Follow one of three patterns:

### 1. Hybrid (controlled + uncontrolled) — state the component owns

Use when the state is the component's own UI concern: SideBar collapse, a picker's
value, a Switcher selection, a disclosure. Expose the standard trio (or a
domain-named equivalent) and let the consumer pick either mode:

- `value` — controlled value (when defined, the consumer owns it).
- `defaultValue` — initial value when uncontrolled.
- `onValueChange` — fires on every change, in **both** modes.

Reconcile the two with the shared hook rather than re-implementing it:

```ts
import { useControllableState } from '@max-core/react';

const [value, setValue] = useControllableState<T>(
  controlled,     // the `value` prop (undefined ⇒ uncontrolled)
  defaultValue,   // seeds internal state when uncontrolled
  onValueChange,  // notified on every change
  fallback,       // used when defaultValue is undefined (e.g. null, false, [])
);
```

`SideBar` follows this with a domain-named trio — `collapsed` / `defaultCollapsed`
/ `onCollapsedChange`. Existing hybrid components: `DatePicker`, `TimePicker`,
`Switcher`, `DataTable` (sort + selection), plus the Base UI-backed inputs
(`Tabs`, `Switch`, `Checkbox`, `Radio`, `Select`, `Multiselect`, `Stepper`,
`Range`, `Dialog`), which delegate the same trio straight to Base UI.

### 2. Pure controlled — state that mirrors external/derived truth

Use when the "active" value is derived from something outside the component —
typically routing. Expose only `value` + `onValueChange`; **do not** add a
`defaultValue`/internal fallback, because an internal copy could silently diverge
from the source of truth (e.g. the URL).

- `BottomNavigation` — active item = current route.
- `Pagination` — page is normally URL/query-driven.

### 3. Stateless — presentational atoms

No state, no callback; the consumer wraps and wires it. Example: `Tag` (a
`selected` style flag with no `onChange`).

## Composing a collapse-aware rail (SideBar)

`SideBar` broadcasts its collapsed state through a context so slotted items render
their icon-only form automatically — `ListItem` and `EntityItem` already read it.
The collapse **trigger** is composed into the `topBar` slot rather than baked into
a fixed spot:

```tsx
import { SideBar, SideBarTrigger, useRailCollapsed } from '@max-core/react';
import { PanelLeft } from 'lucide-react';

function Brand() {
  const collapsed = useRailCollapsed();       // hide the wordmark when collapsed
  return (
    <div className={collapsed ? 'flex justify-center' : 'flex justify-between'}>
      {!collapsed && <span>Max Core</span>}
      <SideBarTrigger>
        <PanelLeft />
      </SideBarTrigger>
    </div>
  );
}

// Uncontrolled — the rail manages its own collapsed state:
<SideBar topBar={<Brand />} defaultCollapsed={false}>…</SideBar>

// Controlled — you own it (persist it, drive it from a route, etc.):
<SideBar topBar={<Brand />} collapsed={collapsed} onCollapsedChange={setCollapsed}>…</SideBar>
```

`useRail()` returns `{ collapsed, toggle }` if you need to build a custom trigger;
`SideBarTrigger` is the ready-made one.
