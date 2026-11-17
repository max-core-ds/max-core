# @max-core-ds/react

## 0.1.1

### Patch Changes

- 8b27d0f: Accessibility fixes from the first automated axe run (Phase 6.2):
  
  - **SideBar (collapsed):** `ListItem` and `EntityItem` keep their label as screen-reader text when collapsed, so icon-only rail buttons have a name.
  - **Range:** new `aria-label`, `aria-labelledby` and `getAriaLabel` props name the slider input(s); before, there was no way to label them.
  - **DateInput, TimePicker:** the trigger's name is now the label plus the shown value (or placeholder), instead of an `aria-label` that hid the visible text. Without a `label`, `aria-label` is read before the value.
  - **DatePicker:** day buttons are named "1, Tuesday, September 2026" (starting with the visible number); an internal `day="[object Object]"` attribute no longer reaches the DOM.
  - **SegmentedControl, Switcher:** drop the invalid `aria-orientation` on the `role="group"` container.
  - **ScrollArea:** an overflowing viewport with nothing focusable inside becomes a Tab stop (with the focus ring), so keyboard users can scroll it.
- e73c549: BottomNavigation: the notification dot is now announced. An item with `dot` reads "Inbox, New activity" to screen readers (before, the dot was visual only). New optional `dotLabel` on the item changes the wording.
- 41a081d: Fields: accessibility fixes found by the behaviour tests (Phase 6.4 B2):
  
  - **Multiselect (typeahead, the default):** `aria-label` now names the text input. Before, it landed on the chips wrapper, so an unlabelled Multiselect's input had no name.
  - **Multiselect (list) / ItemList:** the "Select all" checkbox is named "Select all". Inside a field it was named after the field's label.
  - **SearchBar:** after the clear (✕) button is pressed, focus goes back to the input instead of being lost (the button unmounts once the value is empty).
  - **SelectInput, Multiselect:** new optional `name` prop for native form submission (hidden input(s) mirror the value; Multiselect submits one value per selected option). Additive: `value` / `onValueChange` still own the state. See the prop docs for the form-reset and form-library caveats.
- df1a937: Pickers: accessibility fixes found by the behaviour tests (Phase 6.4 B4):
  
  - **TimePicker wheel:** each column now points screen readers at its current value (`aria-activedescendant`), so stepping with the arrow keys announces the new hour / minute / period. Before, focus stayed on the column and nothing said which value was current.
  - **DateInput, TimePicker (popover):** the trigger is now described by the helper / error text and marked `aria-invalid` on error. The trigger isn't a Base UI field control, so Base UI's `Field` never linked them.
- 941c432: Selection controls: accessibility fixes found by the behaviour tests (Phase 6.4 B1):
  
  - **Checkbox, Radio, Switch:** the accessible name is now the label only. Before, the `<label>` also wrapped the helper / error text, so it was read as part of the name ("TermsRequired to continue") and again as the description.
  - **Checkbox, Radio, Switch:** `errorMessage` (or `validation="error"`) now sets `aria-invalid`, so the error state is announced, not only coloured.
  - **RadioGroup:** the group-level `helperText` / `errorMessage` is linked to the group (`aria-describedby`), and `errorMessage` marks the group invalid.
- @max-core-ds/tokens@0.1.1

## 0.1.0

### Minor Changes

- ce6e99f: First release. 55 components on their own Figma component tokens; `@max-core-ds/tokens` ships
  `tokens.css`, the Tailwind v4 `theme.css`, `scrollbar.css`, `tokens.json`, the token contract and
  the `max-core-tokens` CLI (`build` / `check`) for template projects.

### Patch Changes

- Updated dependencies [ce6e99f]
  - @max-core-ds/tokens@0.1.0
