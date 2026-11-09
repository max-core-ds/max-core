/**
 * Figma's text styles trim the line box to the cap height (`leadingTrim:
 * CAP_HEIGHT`). The `type-*` utilities carry the CSS equivalent, but
 * `text-box-trim` only applies to block containers — bare text inside a flex
 * container (a button's label) isn't one. Wrap such a label in an element with
 * this class: as a flex item it is blockified, so the trim applies and the
 * label's box is its cap height, centred / padded exactly as in Figma.
 * Browsers without `text-box` keep the full line box.
 */
export const capTrim = '[text-box:trim-both_cap_alphabetic]';
