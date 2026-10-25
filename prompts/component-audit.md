# Prompt — Audit a component against its Figma page

> **How to use:** paste the block below into a new conversation to audit (or re-audit) shipped
> React components against their Figma doc pages, or to build a new one from its page. The
> Phase 4.5 pass itself is complete (40 pages).

---

```
I'm working on the Max Core design system: React components (packages/react) are checked
against their Figma doc page + master bindings and fixed (the Phase 4.5 audit loop, also used
for new Phase 4 builds).

READ FIRST:
- PROGRESS.md → "Where we are" (START HERE bullet) and "Audit status (Phase 4.5)" — what's done;
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

Ask me what's next (START HERE bullet lists the candidates), or take the page / component I name.
```
