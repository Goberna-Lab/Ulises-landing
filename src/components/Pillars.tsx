import './Pillars.css'

const PILLARS = [
  {
    id: '01',
    title: 'Cuántos',
    body: 'La meta real de tu circunscripción, calculada sobre el padrón vigente. No un estimado de gabinete.',
    figure: '412,350',
    caption: 'Meta · Lima Norte · 1.ª vuelta',
  },
  {
    id: '02',
    title: 'Quiénes',
    body: 'Cada contacto que entra por WhatsApp, Facebook o SMS queda clasificado como duro, blando o flotante.',
    figure: '31 · 52 · 17',
    caption: 'Duro · Blando · Flotante (%)',
  },
  {
    id: '03',
    title: 'Dónde',
    body: 'Cada registro geolocalizado, con su brigada, su ruta y su puerta. Sin duplicados.',
    figure: '12,406',
    caption: 'Registros geolocalizados hoy',
  },
]

function Pillars() {
  return (
    <section className="pillars" id="propuestas" data-tone="light">
      <div className="pillars-inner">
        <p className="pillars-eyebrow">Ulises · Cuarto de guerra</p>
        <h2 className="pillars-title">
          Toda campaña
          <br />
          necesita 03 cosas.
        </h2>

        <ol className="pillars-grid">
          {PILLARS.map((pillar) => (
            <li key={pillar.id} className="pillar">
              <span className="pillar-id">{pillar.id}</span>
              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-body">{pillar.body}</p>
              <div className="pillar-figure">
                <span className="pillar-value">{pillar.figure}</span>
                <span className="pillar-caption">{pillar.caption}</span>
              </div>
            </li>
          ))}
        </ol>

        <p className="pillars-note">
          Hasta hoy, las tres vivían separadas.
        </p>
      </div>
    </section>
  )
}

export default Pillars
