// Functional Time Picker — vendored from baseui-cn (built on @base-ui/react) and
// styled through the Max Core theme bridge in `@max-core/tokens/baseui.css`.
// Consumers must import that stylesheet once for the picker to render correctly.
export {
  TimePicker,
  TimePickerInput,
  TimePickerDialog,
  // Time-string helpers (canonical 24h "HH:mm" / "HH:mm:ss" values)
  parseTimeValue,
  formatTimeValue,
  isValidTimeValue,
  clampTimeToStep,
  compareTimeValues,
  type TimePickerProps,
  type TimePickerInputProps,
  type TimePickerDialogProps,
  type TimeValue,
  type TimeFormat,
  type TimePickerMode,
  type TimePickerVariant,
  type TimePickerOrientation,
  type TimePickerSize,
  type TimePickerView,
  type TimeValueParts,
  type TimeMatcher,
  type TimeFormatPreset,
  type TimePickerActionConfig,
  type TimePickerClassNames,
} from '../../baseui/ui/time-picker.js';
