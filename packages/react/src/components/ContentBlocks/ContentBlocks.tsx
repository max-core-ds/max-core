import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

// Draggable placeholder blocks for composing slot content (headings, body copy,
// media). Padding X is -- Atoms/Content Blocks/Padding X (2px) each side
// (276 text in the 280 master). Heading = Heading/H6, body = Body/SM/300 (cap-trimmed).

export interface HeadingBlockProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode;
}

export function HeadingBlock({ children = 'Heading', className, ...rest }: HeadingBlockProps) {
  return (
    <div
      className={cn('px-(--content-blocks-padding-x) type-h6 text-(--text-primary)', className)}
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
        'px-(--content-blocks-padding-x) type-body-sm-300 text-(--text-secondary)',
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
}

// Image Placeholder (2876:2): bg/subtle, square corners, a 48px icon over a
// Caption/300 "Image" label, 8px apart. The master is a fixed 343×200; here it
// fills its container at 16:9.
export interface ImagePlaceholderProps extends ComponentPropsWithoutRef<'div'> {}

export function ImagePlaceholder({ className, ...rest }: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'flex aspect-video w-full flex-col items-center justify-center gap-(--spacing-08)',
        'bg-(--bg-subtle) text-(--text-muted)',
        className,
      )}
      {...rest}
    >
      <ImageIcon />
      <span className="type-caption-300">Image</span>
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
      className="size-(--size-48)"
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
