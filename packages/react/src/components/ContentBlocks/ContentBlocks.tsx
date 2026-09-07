import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Draggable placeholder blocks for composing slot content (headings, body copy,
// media). Padding X matches -- Atoms/Content Blocks/Padding X (2px).

export interface HeadingBlockProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode;
}

export function HeadingBlock({ children = 'Heading', className, ...rest }: HeadingBlockProps) {
  return (
    <div
      className={cn(
        'px-[var(--spacing-02)] text-xl font-bold text-[var(--text-primary)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TextBlockProps extends ComponentPropsWithoutRef<'p'> {
  children?: ReactNode;
}

export function TextBlock({
  children = 'Body text placeholder.',
  className,
  ...rest
}: TextBlockProps) {
  return (
    <p
      className={cn(
        'px-[var(--spacing-02)] text-sm font-light text-[var(--text-secondary)]',
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
}

export interface ImagePlaceholderProps extends ComponentPropsWithoutRef<'div'> {}

export function ImagePlaceholder({ className, ...rest }: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'flex aspect-video w-full flex-col items-center justify-center gap-[var(--spacing-04)]',
        'rounded-[var(--radius-md)] bg-[var(--bg-subtle)] text-[var(--text-muted)]',
        className,
      )}
      {...rest}
    >
      <ImageIcon />
      <span className="text-xs font-light">Image</span>
    </div>
  );
}

function ImageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="size-[var(--size-32)]"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path
        d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
