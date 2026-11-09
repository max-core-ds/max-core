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
  /**
   * Raw values. Dimensional groups (spacing, radius, border-width, opacity,
   * color) plus, since v0.4.0, every other Primitives variable: text-size,
   * radius-focus, z-index, motion (duration ms / easing strings), focus, grid,
   * breakpoint, container, tap-area.
   */
  primitives: Tree;
  /**
   * The five dimensional groups are always present; other semantic groups
   * (since v0.4.0: `typeface-family`, string values) appear as exported.
   */
  semantics: {
    spacing: Tree;
    size: Tree;
    radius: Tree;
    'border-weight': Tree;
    opacity: Tree;
    [group: string]: Tree;
  };
  colors: {
    light: Tree;
    dark: Tree;
  };
  /**
   * Level 3/4 component tokens (`-- Atoms/...`, `-- Molecule/...`,
   * `--Organism/...`) from the `Max Core - Components` collection, in its
   * `Max core` (production) mode. Flat-keyed by the full Figma variable name.
   * Values are alias references to the NEAREST token — another component token
   * (`{components.-- Molecule/Input/Global/Size M/Padding X}`), a semantic
   * (`{semantics.radius.sm}`) or a primitive — or a raw number (4 on purpose).
   */
  components?: Tree;
  /**
   * The text styles (`Heading/H1`, `Body/SM/300`, …) as composite tokens.
   * Since v0.4.0. Family and size are references to the bound variables.
   */
  typography?: Record<string, TypographyStyle>;
  /**
   * Effect styles keyed by style name (`effect/shadow/down/lg`,
   * `effect/blur/md`, `effect/glass/elevated`), each an ordered list of layers.
   * Sourced from Figma Effect Styles (not variables), so only the plugin can
   * populate this. Blur and glass layers since v0.4.0.
   */
  effects?: Record<string, EffectLayer[]>;
}

export interface TypographyStyle {
  /** Reference to `{semantics.typeface-family.*}`, or a literal family. */
  fontFamily: string;
  /** Reference to `{primitives.text-size.*}`, or a px number. */
  fontSize: string | number;
  fontWeight: number;
  /** `"140%"`, a px number, or `"normal"`. */
  lineHeight: string | number;
  /** `"-1.5%"` (of the font size) or a px number. */
  letterSpacing: string | number;
  /** Figma `leadingTrim: CAP_HEIGHT` → `cap-height`. */
  leadingTrim: 'cap-height' | 'none';
}

/**
 * One layer of a shadow effect style. Mirrors a Figma `DropShadowEffect` /
 * `InnerShadowEffect`. The color is referenced by the bound variable name
 * (`shadow/color 4`) so the CSS transform can emit `var(--shadow-color-4)` and
 * inherit light/dark mode for free; `color` is a literal-hex fallback for
 * layers with no bound variable. No `type` field, for v0.3 compatibility.
 */
export interface EffectShadowLayer {
  type?: undefined;
  inset: boolean;
  x: number;
  y: number;
  blur: number;
  spread: number;
  colorVar?: string;
  color?: string;
}

/** A Figma background blur (`backdrop: true`) or layer blur. `radius` is Figma's, not CSS's. */
export interface EffectBlurLayer {
  type: 'blur';
  backdrop: boolean;
  radius: number;
}

/** Figma's Glass effect, raw parameters (no exact CSS equivalent; approximated). */
export interface EffectGlassLayer {
  type: 'glass';
  radius: number;
  refraction: number;
  depth: number;
  lightAngle: number;
  lightIntensity: number;
  dispersion: number;
  splay: number;
}

export type EffectLayer = EffectShadowLayer | EffectBlurLayer | EffectGlassLayer;
