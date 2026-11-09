/**
 * Validation → color mapping for the selection controls (Checkbox, Radio,
 * Switch). Figma gives each a 4-value Validation axis (Default, Error, Warning,
 * Success) that recolors the control: the resting border/tint, the unchecked
 * Hover/Pressed fills, and the checked/indeterminate fill all take the
 * validation color.
 *
 * Hover/Pressed apply to the unchecked (off) control only — Figma has no
 * interaction variants for the checked state. Checkbox + Radio use light tints
 * so unchecked never reads as checked (round-1 Figma change, 2026-11): Default
 * `accent/surface` (hover) / `accent/subtle` (pressed) with `border/accent`;
 * the other validations keep their `status/<tone>/subtle` fill. The Switch
 * track keeps its solid hover fill, as the master.
 *
 * Every class is a full literal (see utils/tone.ts for why interpolation would
 * break Tailwind's static extraction).
 */

export type Validation = 'default' | 'error' | 'warning' | 'success';

// Checkbox box: resting border + tint; unchecked Hover/Pressed fills;
// data-checked / data-indeterminate flip to the solid validation fill.
// `data-[unchecked]:not-data-[indeterminate]` scopes hover/press to the empty box.
export const checkboxValidation: Record<Validation, string> = {
  default:
    'border-[var(--border-default)] bg-[var(--bg-default)] ' +
    'data-[unchecked]:not-data-[indeterminate]:hover:border-[var(--border-accent)] data-[unchecked]:not-data-[indeterminate]:hover:bg-[var(--accent-surface)] ' +
    'data-[unchecked]:not-data-[indeterminate]:active:border-[var(--border-accent)] data-[unchecked]:not-data-[indeterminate]:active:bg-[var(--accent-subtle)] ' +
    'data-[checked]:border-[var(--border-accent)] data-[checked]:bg-[var(--accent-default)] data-[indeterminate]:border-[var(--border-accent)] data-[indeterminate]:bg-[var(--accent-default)]',
  error:
    'border-[var(--status-danger-border)] bg-[var(--status-danger-subtle)] ' +
    'data-[checked]:bg-[var(--status-danger-default)] data-[indeterminate]:bg-[var(--status-danger-default)]',
  warning:
    'border-[var(--status-warning-border)] bg-[var(--status-warning-subtle)] ' +
    'data-[checked]:bg-[var(--status-warning-default)] data-[indeterminate]:bg-[var(--status-warning-default)]',
  success:
    'border-[var(--status-success-border)] bg-[var(--status-success-subtle)] ' +
    'data-[checked]:bg-[var(--status-success-default)] data-[indeterminate]:bg-[var(--status-success-default)]',
};

// Radio box: resting border + tint (bg/surface for Default), kept when checked —
// only the dot (a bg-current child, colored by the `text-` class here) appears.
// Unchecked Hover/Pressed = the same light tints as the Checkbox. (The master's
// Radio Hover still binds `accent/hover` — flagged to the designer; we follow
// the written round-1 rule.) Pressed keeps `border/default`, as the master.
export const radioValidation: Record<Validation, string> = {
  default:
    'border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--accent-default)] ' +
    'data-[unchecked]:hover:border-[var(--border-accent)] data-[unchecked]:hover:bg-[var(--accent-surface)] ' +
    'data-[unchecked]:active:border-[var(--border-default)] data-[unchecked]:active:bg-[var(--accent-subtle)]',
  error:
    'border-[var(--status-danger-border)] bg-[var(--status-danger-subtle)] text-[var(--status-danger-default)]',
  warning:
    'border-[var(--status-warning-border)] bg-[var(--status-warning-subtle)] text-[var(--status-warning-default)]',
  success:
    'border-[var(--status-success-border)] bg-[var(--status-success-subtle)] text-[var(--status-success-default)]',
};

// Switch track: Off = surface (Default) or subtle tint + validation border;
// Off Hover/Pressed = the hover fill; On = solid validation fill.
export const switchValidation: Record<Validation, string> = {
  default:
    'border-[var(--border-default)] bg-[var(--bg-surface)] ' +
    'data-[unchecked]:hover:bg-[var(--accent-hover)] data-[unchecked]:active:bg-[var(--accent-hover)] ' +
    'data-[checked]:bg-[var(--accent-default)]',
  error:
    'border-[var(--status-danger-border)] bg-[var(--status-danger-subtle)] ' +
    'data-[unchecked]:hover:bg-[var(--status-danger-hover)] data-[unchecked]:active:bg-[var(--status-danger-hover)] ' +
    'data-[checked]:bg-[var(--status-danger-default)]',
  warning:
    'border-[var(--status-warning-border)] bg-[var(--status-warning-subtle)] ' +
    'data-[unchecked]:hover:bg-[var(--status-warning-hover)] data-[unchecked]:active:bg-[var(--status-warning-hover)] ' +
    'data-[checked]:bg-[var(--status-warning-default)]',
  success:
    'border-[var(--status-success-border)] bg-[var(--status-success-subtle)] ' +
    'data-[unchecked]:hover:bg-[var(--status-success-hover)] data-[unchecked]:active:bg-[var(--status-success-hover)] ' +
    'data-[checked]:bg-[var(--status-success-default)]',
};

// Switch knob: the validation color when off, on-accent when on. Pressed (off)
// turns it into a frosted glass knob — overlay/default white @ 20% + a tone
// stroke + background blur. Requires the track to carry `group/switch`.
export const switchKnobValidation: Record<Validation, string> = {
  default:
    'border-[var(--accent-default)] bg-[var(--accent-default)] ' +
    'group-active/switch:data-[unchecked]:border-[var(--border-accent)] group-active/switch:data-[unchecked]:bg-[var(--overlay-default-white)]/20 ' +
    'data-[checked]:border-transparent data-[checked]:bg-[var(--text-on-accent)]',
  error:
    'border-[var(--status-danger-default)] bg-[var(--status-danger-default)] ' +
    'group-active/switch:data-[unchecked]:bg-[var(--overlay-default-white)]/20 ' +
    'data-[checked]:border-transparent data-[checked]:bg-[var(--text-on-accent)]',
  warning:
    'border-[var(--status-warning-default)] bg-[var(--status-warning-default)] ' +
    'group-active/switch:data-[unchecked]:bg-[var(--overlay-default-white)]/20 ' +
    'data-[checked]:border-transparent data-[checked]:bg-[var(--text-on-accent)]',
  success:
    'border-[var(--status-success-default)] bg-[var(--status-success-default)] ' +
    'group-active/switch:data-[unchecked]:bg-[var(--overlay-default-white)]/20 ' +
    'data-[checked]:border-transparent data-[checked]:bg-[var(--text-on-accent)]',
};
