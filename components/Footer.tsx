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
              <li>contato@sionenergia.com.br</li>
              <li className="pt-2">
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/sionenergia/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[color:var(--brand-accent)] transition-colors" aria-label="Instagram">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  </a>
                  <a href="https://www.facebook.com/SionEnergia/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[color:var(--brand-accent)] transition-colors" aria-label="Facebook">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                  </a>
                  <a href="https://www.linkedin.com/company/sion-energia/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[color:var(--brand-accent)] transition-colors" aria-label="LinkedIn">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" /></svg>
                  </a>
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
