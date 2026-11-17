import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ScrollArea } from './ScrollArea.js';

// jsdom has no layout: fake the viewport's scroll metrics.
function fakeMetrics({
  scrollHeight,
  clientHeight,
}: { scrollHeight: number; clientHeight: number }) {
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(scrollHeight);
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(clientHeight);
}

const viewportOf = (text: string) => screen.getByText(text).closest('[data-overflow-end], div')!;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ScrollArea', () => {
  // Phase 6.2 (axe scrollable-region-focusable): an overflowing viewport with
  // nothing focusable inside must be reachable by keyboard.
  it('makes an overflowing viewport with only text a Tab stop', () => {
    fakeMetrics({ scrollHeight: 400, clientHeight: 100 });
    render(
      <ScrollArea>
        <p>Long text</p>
      </ScrollArea>,
    );
    const viewport = screen.getByText('Long text').parentElement!;
    expect(viewport).toHaveAttribute('tabindex', '0');
    expect(viewport).toHaveAttribute('data-overflow-end');
    expect(viewport).not.toHaveAttribute('data-overflow-start');
  });

  it('adds no Tab stop when the content has its own focusable elements', () => {
    fakeMetrics({ scrollHeight: 400, clientHeight: 100 });
    render(
      <ScrollArea>
        <button type="button">Row</button>
      </ScrollArea>,
    );
    expect(screen.getByRole('button', { name: 'Row' }).parentElement).not.toHaveAttribute(
      'tabindex',
    );
  });

  it('adds no Tab stop and no rail when nothing overflows', () => {
    fakeMetrics({ scrollHeight: 100, clientHeight: 100 });
    render(
      <ScrollArea>
        <p>Short text</p>
      </ScrollArea>,
    );
    const viewport = viewportOf('Short text');
    expect(viewport).not.toHaveAttribute('tabindex');
    expect(viewport).not.toHaveAttribute('data-overflow-end');
  });
});
