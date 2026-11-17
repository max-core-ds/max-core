---
"@max-core-ds/react": patch
---

Selection controls: accessibility fixes found by the behaviour tests (Phase 6.4 B1):

- **Checkbox, Radio, Switch:** the accessible name is now the label only. Before, the `<label>` also wrapped the helper / error text, so it was read as part of the name ("TermsRequired to continue") and again as the description.
- **Checkbox, Radio, Switch:** `errorMessage` (or `validation="error"`) now sets `aria-invalid`, so the error state is announced, not only coloured.
- **RadioGroup:** the group-level `helperText` / `errorMessage` is linked to the group (`aria-describedby`), and `errorMessage` marks the group invalid.
