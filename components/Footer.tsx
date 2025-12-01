import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[color:var(--brand)] text-white mt-12 pt-16 pb-8">
      <div className="container-pad">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 md:col-span-1">
            <img src="/images/logosion.png" alt="Sion Energia" className="h-10 w-auto mb-6" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
            <p className="text-sm text-white/70">
              Energia limpa, economia real e compromisso com o futuro.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Institucional</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Sobre a Sion</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trabalhe Conosco</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LGPD / DPO</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>0800 000 0000</li>
              <li>contato@sionenergia.com.br</li>
              <li className="pt-2">
                <div className="flex gap-4">
                  {/* Social placeholders */}
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[color:var(--brand-accent)] transition-colors cursor-pointer">IG</div>
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[color:var(--brand-accent)] transition-colors cursor-pointer">LI</div>
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[color:var(--brand-accent)] transition-colors cursor-pointer">FB</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-white/5 rounded border border-white/10 text-xs text-white/60">ANEEL Autorizada</div>
            <div className="px-3 py-1 bg-white/5 rounded border border-white/10 text-xs text-white/60">LGPD Compliance</div>
            <div className="px-3 py-1 bg-white/5 rounded border border-white/10 text-xs text-white/60">Site Seguro SSL</div>
          </div>
          <p className="text-xs text-white/50 text-center md:text-right">
            © 2025 Sion Energia. Todos os direitos reservados.<br />
            Sion Energia – CNPJ 35.710.362/0001-50<br />
            R. Dr. Manoel Pedro, 365 – 21º Andar – Cabral, Curitiba – PR, 80035-030
          </p>
        </div>
      </div>
    </footer>
  )
}
