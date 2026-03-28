export function Motif({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 60 + 38 * Math.cos(rad);
        const y = 60 + 38 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="3" fill="currentColor" opacity="0.5" />;
      })}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 60 + 22 * Math.cos(rad);
        const y = 60 + 22 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="2" fill="currentColor" opacity="0.4" />;
      })}
      <circle cx="60" cy="60" r="5" fill="currentColor" opacity="0.6" />
      <circle cx="60" cy="60" r="11" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <circle cx="60" cy="60" r="26" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.2" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.15" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 60 + 12 * Math.cos(rad);
        const y1 = 60 + 12 * Math.sin(rad);
        const x2 = 60 + 34 * Math.cos(rad);
        const y2 = 60 + 34 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.75" opacity="0.2" />;
      })}
    </svg>
  );
}
