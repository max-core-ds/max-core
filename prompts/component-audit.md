# Prompt — Continue the Phase 4.5 component audit

> **How to use:** paste the block below into a new conversation to continue auditing shipped
> React components against their Figma doc pages, page by page.

---

```
I'm continuing the Max Core Phase 4.5 component audit: each shipped React component
(packages/react) is checked against its Figma doc page + master bindings, then fixed.

READ FIRST:
- PROGRESS.md → "Audit status (Phase 4.5)" — which pages are done and which is next;
  "For the designer" — Figma-side findings so far; the contrast baseline.
- PLAN.md → "Phase 4.5" — ground rules, the 10-row checklist, page order.
- docs/audit/README.md — the practical recipe: read scripts, verify gate, gotchas.
- docs/audit/*.md — finished audits (format to follow; buttons.md is the fullest).

RULES:
- Figma file sX5tikviuBEhNbu2iPVya5 is READ-ONLY. Call create_session first and load the
  figma:figma-use skill before use_figma. If MCP auth dropped, ask me to re-auth via /plugin.
- Master bound variables are ground truth; doc text can be stale.
- Ask me only the genuine Figma-vs-code decisions; fix everything Figma clearly specifies.
- One page = one docs/audit/<slug>.md + one commit. Don't push.

Continue with the next ⏳ page in the Audit status table.
```
