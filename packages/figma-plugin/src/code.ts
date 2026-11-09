/// <reference types="@figma/plugin-typings" />

import { buildTokensFile, countTokens, exportWarnings } from './transform';

interface ExportMessage {
  type: 'export';
}
interface CancelMessage {
  type: 'cancel';
}
type PluginMessage = ExportMessage | CancelMessage;

figma.showUI(__html__, { width: 360, height: 380, themeColors: true });

figma.ui.onmessage = async (msg: PluginMessage) => {
  if (msg.type === 'cancel') {
    figma.closePlugin();
    return;
  }

  if (msg.type === 'export') {
    try {
      figma.ui.postMessage({ type: 'status', text: 'Reading variables…' });
      const tokens = await buildTokensFile();
      const counts = countTokens(tokens);
      figma.ui.postMessage({
        type: 'tokens',
        payload: tokens,
        counts,
        warnings: [...exportWarnings],
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      figma.ui.postMessage({ type: 'error', message });
    }
  }
};
