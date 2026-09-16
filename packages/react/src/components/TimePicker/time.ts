// Pure time-string helpers for the Time Picker. Canonical values are 24-hour
// strings, "HH:mm" or "HH:mm:ss". Ported from the baseui-cn logic (dependency-free)
// so the picker can be a native Max Core component with no vendored runtime.

export type TimeValue = string;
export type TimeFormat = '12h' | '24h';
export type TimeFormatPreset = 'short' | 'medium' | 'full' | 'iso';
export type TimeStep = 1 | 5 | 10 | 15 | 30;

export type TimeValueParts = {
  hour: number;
  minute: number;
  second: number;
};

export type TimeMatcher =
  | TimeValue
  | { from?: TimeValue; to?: TimeValue }
  | ((value: TimeValue) => boolean);

export type TimeFormatOptions = {
  format?: TimeFormat;
  formatPreset?: TimeFormatPreset;
  displayFormat?: string;
  showSeconds?: boolean;
};

export const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
export const HOURS_24 = Array.from({ length: 24 }, (_, index) => index);
export const PERIODS = ['AM', 'PM'] as const;

export function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function partsToSeconds(parts: TimeValueParts): number {
  return parts.hour * 3600 + parts.minute * 60 + parts.second;
}

export function serializeTime(parts: TimeValueParts, showSeconds: boolean): TimeValue {
  const value = `${pad(parts.hour)}:${pad(parts.minute)}`;
  return showSeconds ? `${value}:${pad(parts.second)}` : value;
}

function stepTimeParts(
  parts: TimeValueParts,
  minuteStep: TimeStep,
  secondStep: TimeStep,
  showSeconds: boolean,
): TimeValueParts {
  let hour = parts.hour;
  let minute = parts.minute;
  let second = showSeconds ? Math.round(parts.second / secondStep) * secondStep : 0;

  if (second >= 60) {
    second = 0;
    minute += 1;
  }

  minute = Math.round(minute / minuteStep) * minuteStep;
  if (minute >= 60) {
    minute = 0;
    hour = (hour + 1) % 24;
  }

  return { hour, minute, second };
}

function hasSeconds(value: TimeValue | null | undefined): boolean {
  return Boolean(value && value.trim().split(':').length === 3);
}

export function parseTimeValue(value: TimeValue | null | undefined): TimeValueParts | null {
  if (!value) return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = match[3] ? Number(match[3]) : 0;
  if (hour > 23 || minute > 59 || second > 59) return null;
  return { hour, minute, second };
}

export function isValidTimeValue(value: unknown): value is TimeValue {
  return typeof value === 'string' && parseTimeValue(value) !== null;
}

export function compareTimeValues(left: TimeValue, right: TimeValue): -1 | 0 | 1 {
  const leftParts = parseTimeValue(left);
  const rightParts = parseTimeValue(right);
  if (!leftParts || !rightParts) {
    throw new TypeError('compareTimeValues requires valid 24-hour time strings');
  }

  const difference = partsToSeconds(leftParts) - partsToSeconds(rightParts);
  return difference === 0 ? 0 : difference < 0 ? -1 : 1;
}

export function clampTimeToStep(
  value: TimeValue,
  minuteStep: TimeStep = 1,
  secondStep: TimeStep = 1,
): TimeValue | null {
  const parts = parseTimeValue(value);
  if (!parts) return null;
  return serializeTime(
    stepTimeParts(parts, minuteStep, secondStep, hasSeconds(value)),
    hasSeconds(value),
  );
}

function getDisplayPattern({
  format = '12h',
  formatPreset = 'medium',
  displayFormat,
  showSeconds = false,
}: TimeFormatOptions): string {
  if (displayFormat) return displayFormat;
  if (formatPreset === 'iso') return showSeconds ? 'HH:mm:ss' : 'HH:mm';
  if (formatPreset === 'full') return format === '12h' ? 'hh:mm:ss a' : 'HH:mm:ss';

  const seconds = showSeconds ? ':ss' : '';
  if (formatPreset === 'short') {
    return format === '12h' ? `h:mm${seconds} a` : `H:mm${seconds}`;
  }
  return format === '12h' ? `hh:mm${seconds} a` : `HH:mm${seconds}`;
}

export function formatTimeValue(
  value: TimeValue | null | undefined,
  options: TimeFormatOptions = {},
): string {
  const parts = parseTimeValue(value);
  if (!parts) return '';

  const hour12 = parts.hour % 12 || 12;
  const tokens: Record<string, string> = {
    HH: pad(parts.hour),
    H: String(parts.hour),
    hh: pad(hour12),
    h: String(hour12),
    mm: pad(parts.minute),
    ss: pad(parts.second),
    a: parts.hour >= 12 ? 'PM' : 'AM',
  };
  return getDisplayPattern(options).replace(
    /HH|hh|mm|ss|H|h|a/g,
    (token) => tokens[token] ?? token,
  );
}

export function stepOptions(step: TimeStep): number[] {
  return Array.from({ length: Math.ceil(60 / step) }, (_, index) => index * step).filter(
    (value) => value < 60,
  );
}

function normalizeCanonicalValue(
  value: TimeValue | null | undefined,
  showSeconds: boolean,
  minuteStep: TimeStep,
  secondStep: TimeStep,
): TimeValue | null {
  const parts = parseTimeValue(value);
  if (!parts) return null;
  return serializeTime(stepTimeParts(parts, minuteStep, secondStep, showSeconds), showSeconds);
}

export function nowValue(
  showSeconds: boolean,
  minuteStep: TimeStep,
  secondStep: TimeStep,
): TimeValue {
  const now = new Date();
  return (
    normalizeCanonicalValue(
      serializeTime(
        { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() },
        showSeconds,
      ),
      showSeconds,
      minuteStep,
      secondStep,
    ) ?? (showSeconds ? '00:00:00' : '00:00')
  );
}

function matcherMatches(value: TimeValue, matcher: TimeMatcher): boolean {
  if (typeof matcher === 'function') return matcher(value);
  if (typeof matcher === 'string') {
    const left = parseTimeValue(value);
    const right = parseTimeValue(matcher);
    return Boolean(left && right && partsToSeconds(left) === partsToSeconds(right));
  }

  const valueParts = parseTimeValue(value);
  const from = parseTimeValue(matcher.from);
  const to = parseTimeValue(matcher.to);
  if (!valueParts) return false;

  const seconds = partsToSeconds(valueParts);
  return (!from || seconds >= partsToSeconds(from)) && (!to || seconds <= partsToSeconds(to));
}

export function isUnavailable(
  value: TimeValue,
  minTime: TimeValue | undefined,
  maxTime: TimeValue | undefined,
  disabledTimes: TimeMatcher | TimeMatcher[] | undefined,
): boolean {
  const parts = parseTimeValue(value);
  if (!parts) return true;

  const seconds = partsToSeconds(parts);
  const min = parseTimeValue(minTime);
  const max = parseTimeValue(maxTime);
  if (min && seconds < partsToSeconds(min)) return true;
  if (max && seconds > partsToSeconds(max)) return true;

  const matchers = disabledTimes
    ? Array.isArray(disabledTimes)
      ? disabledTimes
      : [disabledTimes]
    : [];
  return matchers.some((matcher) => matcherMatches(value, matcher));
}

/**
 * Nearest selectable value to `preferred`, honouring min/max/disabled and the
 * step grid. When the exact minute (or second) is unavailable, falls back to the
 * next available step so changing the hour never lands on a blocked slot.
 */
export function getSelectableValue(
  preferred: TimeValueParts,
  showSeconds: boolean,
  minuteStep: TimeStep,
  secondStep: TimeStep,
  minTime: TimeValue | undefined,
  maxTime: TimeValue | undefined,
  disabledTimes: TimeMatcher | TimeMatcher[] | undefined,
  allowMinuteFallback = true,
  allowSecondFallback = true,
): TimeValue | null {
  const minutes = allowMinuteFallback
    ? [preferred.minute, ...stepOptions(minuteStep).filter((value) => value !== preferred.minute)]
    : [preferred.minute];
  const seconds = showSeconds
    ? allowSecondFallback
      ? [preferred.second, ...stepOptions(secondStep).filter((value) => value !== preferred.second)]
      : [preferred.second]
    : [0];

  for (const minute of minutes) {
    for (const second of seconds) {
      const candidate = serializeTime({ hour: preferred.hour, minute, second }, showSeconds);
      if (!isUnavailable(candidate, minTime, maxTime, disabledTimes)) return candidate;
    }
  }
  return null;
}
