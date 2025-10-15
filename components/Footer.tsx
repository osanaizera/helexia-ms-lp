import Link from 'next/link'

export default function Footer(){
  return (
    <footer className="bg-[color:var(--brand)] text-white mt-12">
      <div className="container-pad py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/images/logosion.png" alt="Sion" className="h-8 w-auto" onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none' }} />
          </div>
          <nav className="flex gap-4 text-sm text-white/80">
            <Link href="/privacidade" className="hover:text-white" aria-label="Política de Privacidade">Política de Privacidade</Link>
            <a href="#" className="hover:text-white" aria-label="Contatos">Contatos</a>
            <a href="#" className="hover:text-white" aria-label="LGPD/DPO">LGPD/DPO</a>
          </nav>
          <a href="#leadform" className="btn btn-primary px-7 py-3">Simular minha economia</a>
        </div>
        <p className="text-xs text-white/60 mt-6">Estimativas sujeitas à análise da fatura e disponibilidade na região.</p>
      </div>
    </footer>
  )
}
