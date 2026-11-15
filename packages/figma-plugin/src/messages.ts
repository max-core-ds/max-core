/** Settings for "Publish to GitHub", kept in figma.clientStorage (per user, per machine). */
export interface PublishSettings {
  owner: string;
  repo: string;
  /** Branch the PR targets (and the diff is taken against). */
  base: string;
  /** Path of tokens.json inside the repo. */
  path: string;
  /** Fine-grained PAT: Contents + Pull requests read/write on owner/repo only. */
  token: string;
  /** Write a .changeset file (Max Core repo). Off for template projects without Changesets. */
  changeset: boolean;
}

export const DEFAULT_SETTINGS: PublishSettings = {
  owner: 'max-core-ds',
  repo: 'max-core',
  base: 'main',
  path: 'packages/tokens/src/tokens.json',
  token: '',
  changeset: true,
};
