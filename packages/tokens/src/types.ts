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
}
