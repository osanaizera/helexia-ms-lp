export default function ClientLogos(){
  const logos = [
    { src: '/images/logoGrajagan.png', alt: 'Grajagan' },
    { src: '/images/logokfcarnes.png', alt: 'KFCarnes' },
    { src: '/images/logomcdonalds.png', alt: 'McDonalds' },
    { src: '/images/logosicredi.png', alt: 'Sicredi' },
    { src: '/images/logosubway.png', alt: 'Subway' },
    { src: '/images/logotoyota.png', alt: 'Toyota' },
  ]
  return (
    <section className="bg-white overflow-hidden">
      <div className="container-pad py-8">
        <div className="text-center text-sm text-muted mb-8">Empresas atendidas no Brasil</div>
        
        <div className="relative flex w-full overflow-hidden mask-linear-gradient">
          <div className="flex animate-scroll min-w-full shrink-0 items-center justify-around gap-16 px-8">
            {logos.map((l, i)=>(
              <div key={i} className="flex items-center justify-center w-[150px]">
                <img src={l.src} alt={l.alt} className="max-h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="flex animate-scroll min-w-full shrink-0 items-center justify-around gap-16 px-8" aria-hidden="true">
            {logos.map((l, i)=>(
              <div key={i} className="flex items-center justify-center w-[150px]">
                <img src={l.src} alt={l.alt} className="max-h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
