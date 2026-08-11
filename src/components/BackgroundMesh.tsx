/**
 * Lienzo light — grid sutil tipo product-tool (Cal + Vercel/Linear light).
 * Sin aurora/mesh colorido en theme inicial.
 */
export function BackgroundMesh() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-canvas"
      aria-hidden="true"
    >
      {/* Dot grid muy sutil */}
      <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Soft vignette — ancla el contenido sin drama */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,0,0,0.03)_0%,transparent_55%)]" />
    </div>
  );
}
