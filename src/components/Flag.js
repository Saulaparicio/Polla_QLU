/**
 * Flag — renders a country SVG flag by ISO 3166-1 alpha-2 code.
 * Flags are served from /public/flags/<CODE>.svg
 *
 * Usage:
 *   <Flag code="AR" />                    // default 28×21
 *   <Flag code="PA" size={40} />          // custom size (height auto via aspect ratio)
 *   <Flag code="FR" className="rounded" /> // extra classes
 */
export default function Flag({ code, size = 28, className = "" }) {
  if (!code) return null;

  const upper = code.toUpperCase();

  return (
    <img
      src={`/flags/${upper}.svg`}
      alt={upper}
      width={Math.round(size * (4 / 3))}
      height={size}
      style={{
        display: "inline-block",
        objectFit: "cover",
        borderRadius: 3,
        flexShrink: 0,
      }}
      className={className}
      loading="lazy"
      onError={(e) => { e.currentTarget.style.display = "none"; }}
    />
  );
}
