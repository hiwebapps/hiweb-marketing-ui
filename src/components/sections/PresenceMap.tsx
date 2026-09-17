import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import './PresenceMap.css';

type PresenceMapProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type MarkerDef = {
  id: string;
  label: string;
  detail: string;
  location: [number, number];
  size: number;
};

const CYAN: [number, number, number] = [0.004, 0.906, 1];
const ARC: [number, number, number] = [0.004, 0.75, 0.92];

const MARKERS: MarkerDef[] = [
  {
    id: 'mexico',
    label: 'México',
    detail: 'Mérida · Cancún · Monterrey',
    location: [23.63, -102.55],
    size: 0.09,
  },
  {
    id: 'usa',
    label: 'Estados Unidos',
    detail: 'Clientes cross-border',
    location: [39.83, -98.58],
    size: 0.08,
  },
  {
    id: 'canada',
    label: 'Canadá',
    detail: 'Operación remota',
    location: [56.13, -106.35],
    size: 0.07,
  },
];

/**
 * Dark presence section — auto-rotating dotted globe with MX / US / CA markers.
 */
export function PresenceMap({
  eyebrow = 'Mapa global',
  title = 'Presencia con clientes en Norteamérica',
  description = 'Operamos desde Mérida, Cancún y Monterrey con alcance cross-border en México, Estados Unidos y Canadá. La auditoría puede ser remota.',
  ctaLabel = 'Agenda tu auditoría',
  ctaHref = '/contacto',
}: PresenceMapProps) {
  const titleParts = title.split(/(Norteamérica)/i);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const phiRef = useRef(2.55);
  const thetaRef = useRef(0.22);
  const dragRef = useRef({
    active: false,
    x: 0,
    y: 0,
    phi: 2.55,
    theta: 0.22,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let pointerId: number | null = null;

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(2, window.devicePixelRatio || 1),
      width: 800,
      height: 800,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 1.35,
      mapSamples: 18000,
      mapBrightness: 5.2,
      mapBaseBrightness: 0.04,
      baseColor: [0.72, 0.78, 0.86],
      markerColor: CYAN,
      glowColor: [0.04, 0.12, 0.18],
      scale: 1.05,
      markerElevation: 0.035,
      markers: MARKERS.map((item) => ({
        id: item.id,
        location: item.location,
        size: item.size,
        color: CYAN,
      })),
      arcs: [
        { id: 'mx-us', from: MARKERS[0].location, to: MARKERS[1].location, color: ARC },
        { id: 'us-ca', from: MARKERS[1].location, to: MARKERS[2].location, color: ARC },
        { id: 'ca-mx', from: MARKERS[2].location, to: MARKERS[0].location, color: ARC },
      ],
      arcColor: ARC,
      arcWidth: 0.55,
      arcHeight: 0.28,
    });

    const resize = () => {
      const side = Math.min(stage.clientWidth, 640);
      canvas.style.width = `${side}px`;
      canvas.style.height = `${side}px`;
      globe.update({ width: side * 2, height: side * 2 });
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    const tick = () => {
      if (!dragRef.current.active && !reduced) {
        phiRef.current += 0.0028;
      }
      globe.update({ phi: phiRef.current, theta: thetaRef.current });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onPointerDown = (event: PointerEvent) => {
      pointerId = event.pointerId;
      stage.setPointerCapture(pointerId);
      dragRef.current = {
        active: true,
        x: event.clientX,
        y: event.clientY,
        phi: phiRef.current,
        theta: thetaRef.current,
      };
      stage.classList.add('is-dragging');
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragRef.current.active) return;
      const dx = event.clientX - dragRef.current.x;
      const dy = event.clientY - dragRef.current.y;
      phiRef.current = dragRef.current.phi + dx / 180;
      thetaRef.current = Math.max(
        -0.55,
        Math.min(0.65, dragRef.current.theta + dy / 260),
      );
    };

    const endDrag = () => {
      if (pointerId != null) {
        try {
          stage.releasePointerCapture(pointerId);
        } catch {
          /* already released */
        }
      }
      pointerId = null;
      dragRef.current.active = false;
      stage.classList.remove('is-dragging');
    };

    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      stage.removeEventListener('pointerdown', onPointerDown);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerup', endDrag);
      stage.removeEventListener('pointercancel', endDrag);
      globe.destroy();
    };
  }, []);

  return (
    <section className="presence-map" id="presencia" aria-label="Presencia global">
      <div className="presence-map__grid" aria-hidden="true" />

      <div className="presence-map__inner">
        <header className="presence-map__header">
          <p className="presence-map__badge">{eyebrow}</p>
          <h2 className="presence-map__title">
            {titleParts.map((part, index) =>
              /norteamérica/i.test(part) ? (
                <span key={index} className="presence-map__accent">
                  {part}
                </span>
              ) : (
                <span key={index}>{part}</span>
              ),
            )}
          </h2>
          <p className="presence-map__lead">{description}</p>
        </header>

        <div ref={stageRef} className="presence-map__stage" role="img" aria-label="Globo interactivo con México, Estados Unidos y Canadá">
          <canvas ref={canvasRef} className="presence-map__canvas" />

          {MARKERS.map((item) => (
            <div
              key={item.id}
              className={`presence-map__pin presence-map__pin--${item.id}`}
            >
              <span className="presence-map__pin-dot" aria-hidden="true" />
              <div className="presence-map__pin-card">
                <p className="presence-map__pin-label">{item.label}</p>
                <p className="presence-map__pin-detail">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="presence-map__footer">
          <a className="presence-map__cta" href={ctaHref}>
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
