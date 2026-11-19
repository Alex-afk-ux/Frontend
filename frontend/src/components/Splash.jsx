// Salpicadura de agua: gotas que saltan + ondas en el agua.
// Es solo CSS: se anima cuando el contenedor padre recibe :hover (ver index.css).
const DROPS = Array.from({ length: 14 }, (_, i) => {
  const side = i % 2 === 0 ? -1 : 1
  const k = Math.floor(i / 2)
  return {
    x: side * (18 + k * 15 + ((i * 7) % 11)), // desplazamiento horizontal (px)
    up: -(52 + ((i * 13) % 44)), // altura máxima del salto (px)
    fall: 8 + ((i * 5) % 14), // dónde acaba, algo por debajo del origen
    size: 6 + ((i * 3) % 7),
    delay: (i % 5) * 35,
  }
})

export default function Splash() {
  return (
    <div className="splash" aria-hidden="true">
      <span className="ripple" />
      <span className="ripple ripple-2" />
      {DROPS.map((d, i) => (
        <span
          key={i}
          className="drop"
          style={{
            '--x': `${d.x}px`,
            '--up': `${d.up}px`,
            '--fall': `${d.fall}px`,
            width: d.size,
            height: d.size * 1.3,
            animationDelay: `${d.delay}ms`,
          }}
        />
      ))}
    </div>
  )
}
