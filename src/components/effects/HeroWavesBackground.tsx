import GradientWaves from './GradientWaves.jsx';

/**
 * Hiweb-tuned GradientWaves (React Bits) for the hero background.
 * Brand: deep navy haze + purple swell + cyan crests.
 */
export default function HeroWavesBackground() {
  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      {/* Solid base while WebGL boots / if GL fails */}
      <div className="pointer-events-none absolute inset-0 bg-[#070912]" />
      <div className="absolute inset-0">
        <GradientWaves
          horizonColor="#1A1464"
          waveColor="#927AFE"
          crestColor="#E8FBFF"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.8}
          waveRatio={0.9}
          swell={8}
          turbulence={16}
          tilt={1.3}
          zoom={0.9}
          height={5.5}
          fogDepth={17}
          detail="medium"
          brightness={1.15}
          opacity={1.0}
          mouseInteraction
          parallaxStrength={0.5}
          grain={false}
          grainIntensity={0.04}
        />
      </div>
    </div>
  );
}
