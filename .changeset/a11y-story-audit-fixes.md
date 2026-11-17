---
"@max-core-ds/react": patch
---

Accessibility fixes from the first automated axe run (Phase 6.2):

- **SideBar (collapsed):** `ListItem` and `EntityItem` keep their label as screen-reader text when collapsed, so icon-only rail buttons have a name.
- **Range:** new `aria-label`, `aria-labelledby` and `getAriaLabel` props name the slider input(s); before, there was no way to label them.
- **DateInput, TimePicker:** the trigger's name is now the label plus the shown value (or placeholder), instead of an `aria-label` that hid the visible text. Without a `label`, `aria-label` is read before the value.
- **DatePicker:** day buttons are named "1, Tuesday, September 2026" (starting with the visible number); an internal `day="[object Object]"` attribute no longer reaches the DOM.
- **SegmentedControl, Switcher:** drop the invalid `aria-orientation` on the `role="group"` container.
- **ScrollArea:** an overflowing viewport with nothing focusable inside becomes a Tab stop (with the focus ring), so keyboard users can scroll it.
