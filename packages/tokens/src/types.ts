/**
 * Shape of `tokens.json` — the source of truth for design tokens.
 *
 * Lives in its own file so both the CSS transform (Node) and the Figma plugin
 * (browser sandbox) can import it without pulling in each other's runtime
 * dependencies.
 *
 * Token references use Tokens Studio syntax: `{primitives.color.primary.600}`.
 * The cascade is Primitives → Semantics → Colors (light/dark modes).
 */

export type Tree = Record<string, unknown>;

export interface TokensFile {
  $version: string;
  $description?: string;
  primitives: Tree;
  semantics: {
    spacing: Tree;
    size: Tree;
    radius: Tree;
    'border-weight': Tree;
    opacity: Tree;
  };
  colors: {
    light: Tree;
    dark: Tree;
  };
  /**
   * Level 3/4 component tokens (`-- Atoms/...`, `-- Molecule/...`,
   * `--Organism/...`) from the `Max Core - Components` collection, in its
   * `Max core` (production) mode. Flat-keyed by the full Figma variable name.
   * Values are either alias references into semantics/primitives
   * (`{semantics.radius.sm}`) or resolved literals where the alias target is
   * itself a component token. Optional: hand-authored `tokens.json` omits it,
   * and the CSS transform does not consume it.
   */
  components?: Tree;
  /**
   * Drop/inner shadow effect styles, keyed by style name (e.g.
   * `effect/shadow/down/lg`), each an ordered list of shadow layers. Sourced
   * from Figma Effect Styles (not variables), so only the plugin can populate
   * this. Background-blur and glass styles are intentionally excluded — they
   * map to `backdrop-filter`, not `box-shadow`. Optional.
   */
  effects?: Record<string, EffectShadowLayer[]>;
}

/**
 * One layer of a shadow effect style. Mirrors a Figma `DropShadowEffect` /
 * `InnerShadowEffect`. The color is referenced by the bound variable name
 * (`shadow/color 4`) so the CSS transform can emit `var(--shadow-color-4)` and
 * inherit light/dark mode for free; `color` is a literal-hex fallback for
 * layers with no bound variable.
 */
export interface EffectShadowLayer {
  inset: boolean;
  x: number;
  y: number;
  blur: number;
  spread: number;
  colorVar?: string;
  color?: string;
}
