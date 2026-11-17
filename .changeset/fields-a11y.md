---
"@max-core-ds/react": patch
---

Fields: accessibility fixes found by the behaviour tests (Phase 6.4 B2):

- **Multiselect (typeahead, the default):** `aria-label` now names the text input. Before, it landed on the chips wrapper, so an unlabelled Multiselect's input had no name.
- **Multiselect (list) / ItemList:** the "Select all" checkbox is named "Select all". Inside a field it was named after the field's label.
- **SearchBar:** after the clear (✕) button is pressed, focus goes back to the input instead of being lost (the button unmounts once the value is empty).
- **SelectInput, Multiselect:** new optional `name` prop for native form submission (hidden input(s) mirror the value; Multiselect submits one value per selected option). Additive: `value` / `onValueChange` still own the state. See the prop docs for the form-reset and form-library caveats.
