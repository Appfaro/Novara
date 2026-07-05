export default function Logo({ size = 28, light = false }: { size?: number; light?: boolean }) {
  const peakColor = light ? '#ffffff' : '#0a0a0a';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Pico izquierdo: la "N" de Novara */}
      <path d="M6 82 L38 12 L60 58 L52 74 L38 46 L24 82 Z" fill={peakColor} />
      {/* Trazo dorado: movimiento / check mirando al frente */}
      <path d="M45 68 L60 58 L94 8 L64 84 Z" fill="#c9a24a" />
    </svg>
  );
}
