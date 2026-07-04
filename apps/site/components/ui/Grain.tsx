/**
 * Fixed film-grain overlay. The noise is an inline SVG feTurbulence (see the
 * `.grain-overlay::after` rule) so there is no image request. Breaks up flat
 * surfaces and gradient banding so glows read as light, not fill.
 */
export function Grain(): React.ReactElement {
  return <div aria-hidden className="grain-overlay" />;
}
