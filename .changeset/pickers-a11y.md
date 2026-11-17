---
"@max-core-ds/react": patch
---

Pickers: accessibility fixes found by the behaviour tests (Phase 6.4 B4):

- **TimePicker wheel:** each column now points screen readers at its current value (`aria-activedescendant`), so stepping with the arrow keys announces the new hour / minute / period. Before, focus stayed on the column and nothing said which value was current.
- **DateInput, TimePicker (popover):** the trigger is now described by the helper / error text and marked `aria-invalid` on error. The trigger isn't a Base UI field control, so Base UI's `Field` never linked them.
