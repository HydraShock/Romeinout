const DUST_PARTICLES = [
  { x: '8%', y: '20%', size: 3, opacity: 0.11, blur: 9, driftX: 8, driftY: -24, duration: 19, delay: -4.2 },
  { x: '16%', y: '36%', size: 4, opacity: 0.09, blur: 11, driftX: -6, driftY: -28, duration: 22, delay: -8.6 },
  { x: '24%', y: '64%', size: 2, opacity: 0.08, blur: 8, driftX: 7, driftY: -22, duration: 17, delay: -5.4 },
  { x: '32%', y: '46%', size: 5, opacity: 0.1, blur: 12, driftX: -8, driftY: -26, duration: 24, delay: -13.1 },
  { x: '42%', y: '26%', size: 3, opacity: 0.07, blur: 7, driftX: 5, driftY: -20, duration: 18, delay: -2.8 },
  { x: '51%', y: '58%', size: 4, opacity: 0.1, blur: 10, driftX: 8, driftY: -30, duration: 21, delay: -11.7 },
  { x: '58%', y: '18%', size: 2, opacity: 0.06, blur: 6, driftX: -4, driftY: -18, duration: 16, delay: -1.6 },
  { x: '64%', y: '72%', size: 6, opacity: 0.1, blur: 14, driftX: -7, driftY: -34, duration: 26, delay: -15.2 },
  { x: '71%', y: '40%', size: 3, opacity: 0.08, blur: 9, driftX: 6, driftY: -24, duration: 20, delay: -9.4 },
  { x: '78%', y: '52%', size: 4, opacity: 0.11, blur: 11, driftX: -9, driftY: -27, duration: 23, delay: -6.9 },
  { x: '84%', y: '28%', size: 2, opacity: 0.07, blur: 7, driftX: 5, driftY: -19, duration: 18, delay: -3.5 },
  { x: '88%', y: '68%', size: 5, opacity: 0.09, blur: 12, driftX: -6, driftY: -30, duration: 25, delay: -12.3 },
  { x: '93%', y: '44%', size: 3, opacity: 0.08, blur: 8, driftX: 4, driftY: -23, duration: 19, delay: -10.1 },
  { x: '12%', y: '78%', size: 2, opacity: 0.06, blur: 6, driftX: 5, driftY: -16, duration: 17, delay: -7.5 },
];

export default function HeroAtmosphere() {
  return (
    <div className="hero-atmosphere" aria-hidden="true">
      <div className="hero-atmo-rays" />
      <div className="hero-atmo-sweep" />
      <div className="hero-atmo-title-glow" />
      <div className="hero-atmo-dust">
        {DUST_PARTICLES.map((particle, index) => (
          <span
            key={`hero-dust-${index + 1}`}
            className="hero-atmo-dust-particle"
            style={{
              '--dust-x': particle.x,
              '--dust-y': particle.y,
              '--dust-size': `${particle.size}px`,
              '--dust-opacity': particle.opacity,
              '--dust-blur': `${particle.blur}px`,
              '--dust-drift-x': `${particle.driftX}px`,
              '--dust-drift-y': `${particle.driftY}px`,
              '--dust-duration': `${particle.duration}s`,
              '--dust-delay': `${particle.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
