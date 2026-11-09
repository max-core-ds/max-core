'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { type VariantProps, cva } from 'class-variance-authority';
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '../../utils/cn.js';
import { focusRing } from '../../utils/focus-ring.js';
import { elevatePress, stateLayer } from '../../utils/state-layer.js';

// Circular floating action button. Every dimension is its own Figma token
// (-- Atoms/Buttons/Fab/Main/<size>/*, Fab/Menu/*, Fab/Expandable Gap).
// States are fill swaps, as the master: Hover `accent/hover`, Pressed
// `accent/active`, Disabled = the Default look at `- opacity -/disabled`.
const mainStyles = cva(
  [
    'relative isolate inline-flex items-center justify-center',
    'bg-[var(--accent-default)] text-[var(--text-on-accent)]',
    'hover:bg-[var(--accent-hover)] active:bg-[var(--accent-active)]',
    'shadow-[var(--effect-shadow-down-md)]',
    'transition',
    elevatePress,
    focusRing,
    'disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        s: 'size-(--buttons-fab-main-s-size) rounded-(--buttons-fab-main-s-radius) [&_svg]:size-(--buttons-fab-main-s-icon-size)',
        m: 'size-(--buttons-fab-main-m-size) rounded-(--buttons-fab-main-m-radius) [&_svg]:size-(--buttons-fab-main-m-icon-size)',
        xl: 'size-(--buttons-fab-main-xl-size) rounded-(--buttons-fab-main-xl-radius) [&_svg]:size-(--buttons-fab-main-xl-icon-size)',
      },
    },
    defaultVariants: { size: 'm' },
  },
);

// Speed-dial action button — fixed Item Size / Item Icon Size. Figma: an accent
// circle with an on-accent icon and shadow/down/md, like the main button.
const itemStyles = cn(
  'relative isolate inline-flex size-(--buttons-fab-menu-item-size) items-center justify-center',
  'rounded-(--buttons-fab-menu-item-radius) bg-[var(--accent-default)] text-[var(--text-on-accent)]',
  'shadow-[var(--effect-shadow-down-md)] [&_svg]:size-(--buttons-fab-menu-item-icon-size)',
  'transition',
  stateLayer,
  focusRing,
);

// Item label: Caption/700 `text/secondary` on bg/surface, no shadow.
const labelStyles =
  'rounded-(--buttons-fab-menu-label-radius) bg-[var(--bg-surface)] ' +
  'px-(--buttons-fab-menu-label-padding-x) py-(--buttons-fab-menu-label-padding-y) ' +
  'type-caption-700 text-[var(--text-secondary)]';

export interface FabAction {
  label: ReactNode;
  icon: ReactNode;
  onClick?: () => void;
}

export interface FabProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'onClick'>,
    VariantProps<typeof mainStyles> {
  /** Main button icon. */
  icon: ReactNode;
  'aria-label': string;
  /** Main click handler (used when there are no speed-dial actions). */
  onClick?: () => void;
  /** Optional speed-dial actions; when present the main button toggles them. */
  actions?: FabAction[];
}

export function Fab({ size = 'm', className, icon, onClick, actions, ...rest }: FabProps) {
  const [open, setOpen] = useState(false);
  const hasMenu = Boolean(actions && actions.length > 0);
  const rootRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const menuId = `${id}-menu`;

  // Close the speed dial on Escape or a click outside it.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    // Expandable Gap (main ↔ list) and List Gap (between items).
    <div
      ref={rootRef}
      className="relative inline-flex flex-col-reverse items-end gap-(--buttons-fab-expandable-gap)"
    >
      <BaseButton
        className={cn(mainStyles({ size }), className)}
        onClick={hasMenu ? () => setOpen((v) => !v) : onClick}
        aria-expanded={hasMenu ? open : undefined}
        aria-controls={hasMenu && open ? menuId : undefined}
        {...rest}
      >
        {icon}
      </BaseButton>
      {hasMenu && open ? (
        <ul id={menuId} className="flex flex-col-reverse gap-(--buttons-fab-menu-list-gap)">
          {actions?.map((action, i) => (
            // Item Gap (label ↔ button).
            // biome-ignore lint/suspicious/noArrayIndexKey: actions are a static, ordered list
            <li key={i} className="flex items-center justify-end gap-(--buttons-fab-menu-item-gap)">
              {/* The label names the icon-only item button. */}
              <span id={`${id}-item-${i}`} className={labelStyles}>
                {action.label}
              </span>
              <BaseButton
                className={itemStyles}
                aria-labelledby={`${id}-item-${i}`}
                onClick={() => {
                  action.onClick?.();
                  setOpen(false);
                }}
              >
                {action.icon}
              </BaseButton>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
