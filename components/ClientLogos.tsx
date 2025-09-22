export default function ClientLogos(){
  const logos = [
    { src: '/images/cliente1.png', alt: 'Cliente 1' },
    { src: '/images/cliente2.png', alt: 'Cliente 2' },
    { src: '/images/cliente3.png', alt: 'Cliente 3' },
    { src: '/images/cliente4.png', alt: 'Cliente 4' },
  ]
  return (
    <section className="bg-white">
      <div className="container-pad py-8">
        <div className="text-center text-sm text-muted mb-4">Empresas atendidas no Brasil</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
          {logos.map((l, i)=>(
            <div key={i} className="flex items-center justify-center">
              <img src={l.src} alt={l.alt} className="h-[12.5rem] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
