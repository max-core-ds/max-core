/// <reference types="@figma/plugin-typings" />

/**
 * Plugin main thread (Figma sandbox): reads the variables/styles, stores the
 * GitHub settings in figma.clientStorage (per user, on this machine) and opens
 * links. All network calls happen in the UI iframe (src/ui.ts).
 */
import type { PublishSettings } from './messages';
import { buildTokensFile, countTokens, exportWarnings } from './transform';

type PluginMessage =
  | { type: 'export'; purpose: 'download' | 'publish' }
  | { type: 'load-settings' }
  | { type: 'save-settings'; settings: PublishSettings }
  | { type: 'open-url'; url: string }
  | { type: 'notify'; text: string }
  | { type: 'resize'; height: number }
  | { type: 'cancel' };

const SETTINGS_KEY = 'max-core-publish-settings';
const WIDTH = 420;

figma.showUI(__html__, { width: WIDTH, height: 520, themeColors: true });

figma.ui.onmessage = async (msg: PluginMessage) => {
  switch (msg.type) {
    case 'cancel':
      figma.closePlugin();
      return;

    case 'load-settings': {
      const settings = (await figma.clientStorage.getAsync(SETTINGS_KEY)) as
        | PublishSettings
        | undefined;
      figma.ui.postMessage({ type: 'settings', settings: settings ?? null });
      return;
    }

    case 'save-settings':
      await figma.clientStorage.setAsync(SETTINGS_KEY, msg.settings);
      figma.ui.postMessage({ type: 'settings-saved' });
      return;

    case 'open-url':
      figma.openExternal(msg.url);
      return;

    case 'notify':
      figma.notify(msg.text);
      return;

    case 'resize':
      figma.ui.resize(WIDTH, Math.max(320, Math.min(760, Math.round(msg.height))));
      return;

    case 'export':
      try {
        figma.ui.postMessage({ type: 'status', text: 'Reading variables…' });
        const tokens = await buildTokensFile();
        figma.ui.postMessage({
          type: 'tokens',
          purpose: msg.purpose,
          payload: tokens,
          counts: countTokens(tokens),
          warnings: [...exportWarnings],
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        figma.ui.postMessage({ type: 'error', message });
      }
      return;
  }
};
