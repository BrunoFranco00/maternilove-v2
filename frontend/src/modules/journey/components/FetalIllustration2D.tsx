'use client';

/**
 * Ilustração 2.5D abstrata — forma orgânica com degradê, glow e sombra interna.
 * Não utiliza imagem médica.
 */
export function FetalIllustration2D() {
  return (
    <div
      className="relative w-full aspect-square rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #F8D7E4 0%, #E8B8D0 40%, #D4A5C8 70%, #C8A0C0 100%)',
        boxShadow: 'inset 0 4px 20px rgba(255,255,255,0.5), inset 0 -2px 12px rgba(142,14,58,0.08), 0 0 32px rgba(194,24,91,0.15)',
      }}
    >
      {/* Forma orgânica central — blob-like */}
      <div
        className="absolute inset-[15%] rounded-[42%]"
        style={{
          background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(255,255,255,0.9) 0%, rgba(248,215,228,0.8) 30%, rgba(232,184,208,0.6) 60%, rgba(194,24,91,0.2) 100%)',
          boxShadow: 'inset 0 2px 12px rgba(255,255,255,0.6), 0 0 24px rgba(194,24,91,0.12)',
          transform: 'rotate(-8deg)',
        }}
      />
      {/* Glow suave externo */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(194,24,91,0.06) 100%)',
        }}
      />
    </div>
  );
}
