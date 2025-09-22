export const metadata = {
  title: 'Política de Privacidade — Helexia & Sion',
  description: 'Política de privacidade e proteção de dados (LGPD) para a LP Helexia & Sion no Mato Grosso do Sul.'
}

export default function Privacy(){
  return (
    <main className="container-pad py-12">
      <style dangerouslySetInnerHTML={{__html:'#brand-header{display:none !important;}'}} />
      <h1 className="section-title">Política de Privacidade</h1>
      <p className="section-sub">Helexia & Sion — Geração Compartilhada (MS)</p>

      <section className="mt-6 space-y-4 text-sm leading-7">
        <p>
          Esta Política de Privacidade descreve como Helexia e Sion ("nós") coletam, utilizam, compartilham e protegem dados pessoais dos interessados em aderir à energia com desconto por meio de geração compartilhada no Mato Grosso do Sul. Cumprimos a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD) e demais normas aplicáveis ao setor elétrico.
        </p>

        <h2 className="text-lg font-bold mt-8">1. Controladores e Escopo</h2>
        <p>
          A Helexia é responsável pela geração de energia (usinas), enquanto a Sion administra o consórcio/cooperativa e a comercialização junto à distribuidora. Para fins de LGPD, Helexia e Sion podem atuar como controladoras conjuntas quando definirem, em conjunto, as finalidades e os meios de tratamento.
        </p>

        <h2 className="text-lg font-bold mt-8">2. Dados Pessoais Coletados</h2>
        <ul className="list-disc pl-5">
          <li>Identificação e contato: nome, e-mail, telefone, CPF/CNPJ.</li>
          <li>Dados de consumo e faturamento: valor médio da fatura, CEP e informações relacionadas à unidade consumidora.</li>
          <li>Dados de navegação e UTM: origem da visita, dados de campanha, gclid (quando disponível).</li>
          <li>Documentos de suporte: imagem/PDF de fatura (opcional) e demais documentos necessários para análise e adesão.</li>
        </ul>

        <h2 className="text-lg font-bold mt-8">3. Finalidades de Uso</h2>
        <ul className="list-disc pl-5">
          <li>Contato comercial: entrar em contato por telefone, e-mail e aplicativos de mensagens (incl. WhatsApp) para apresentar proposta, confirmar dados e realizar adesão.</li>
          <li>Análise de elegibilidade e cálculo de desconto: estimar desconto sobre TE+TUSD, simular economia e verificar disponibilidade técnica e regulatória.</li>
          <li>Prevenção à fraude e segurança: validar identidade, prevenir abusos e cumprir obrigações legais e regulatórias.</li>
          <li>Melhoria de serviços e estatísticas: analisar uso do site, campanhas e conversões (via tags/UTM/GTM).</li>
        </ul>

        <h2 className="text-lg font-bold mt-8">4. Bases Legais</h2>
        <p>
          Tratamos dados com base em: (i) execução de procedimentos preliminares relacionados a contrato a pedido do titular (art. 7º, V), (ii) consentimento (art. 7º, I), quando aplicável — ex.: comunicações e marketing, e (iii) legítimo interesse (art. 7º, IX) para ações de prospecção compatíveis com expectativas do titular, respeitados seus direitos e opt-out.
        </p>

        <h2 className="text-lg font-bold mt-8">5. Consulta a Fontes Públicas e Bureaus</h2>
        <p>
          Para ofertar condições personalizadas, podemos consultar bases públicas e, quando pertinente, bureaus de crédito, exclusivamente para confirmar dados, verificar riscos e viabilidade da proposta, sempre com fundamento legal adequado e respeitando os direitos dos titulares.
        </p>

        <h2 className="text-lg font-bold mt-8">6. Compartilhamento</h2>
        <ul className="list-disc pl-5">
          <li>Entre Helexia e Sion para operação do consórcio/cooperativa e comercialização.</li>
          <li>Prestadores de serviços (ex.: CRM, hospedagem, atendimento) sob contrato, com obrigações de confidencialidade e segurança.</li>
          <li>Autoridades e órgãos reguladores quando exigido por lei.</li>
        </ul>

        <h2 className="text-lg font-bold mt-8">7. Transferências Internacionais</h2>
        <p>
          Alguns provedores podem estar fora do Brasil. Nesses casos, adotamos salvaguardas adequadas conforme a LGPD (ex.: cláusulas contratuais específicas e padrões de segurança).
        </p>

        <h2 className="text-lg font-bold mt-8">8. Segurança e Retenção</h2>
        <p>
          Implementamos medidas técnicas e organizacionais para proteger dados contra acessos não autorizados. Retemos dados pelo tempo necessário para as finalidades aqui descritas ou para cumprimento de obrigações legais/regulatórias e exercício regular de direitos.
        </p>

        <h2 className="text-lg font-bold mt-8">9. Direitos do Titular</h2>
        <p>
          Você pode solicitar: confirmação do tratamento, acesso, correção, anonimização, portabilidade, eliminação, informação sobre compartilhamentos e revisão de decisões automatizadas. Pode também se opor a tratamentos baseados em legítimo interesse e revogar consentimentos.
        </p>

        <h2 className="text-lg font-bold mt-8">10. Comunicações</h2>
        <p>
          Ao enviar seus dados, você autoriza nosso contato por telefone, e-mail e aplicativos de mensagens (incl. WhatsApp) para propostas, esclarecimentos e conclusão da contratação. Você pode solicitar interrupção dessas comunicações a qualquer momento pelos canais de atendimento.
        </p>

        <h2 className="text-lg font-bold mt-8">11. Cookies e Tags</h2>
        <p>
          Utilizamos cookies e tags (via GTM) para medir performance e melhorar a experiência. Você pode gerenciar preferências no navegador. Em campanhas, podemos usar parâmetros UTM e gclid.
        </p>

        <h2 className="text-lg font-bold mt-8">12. Atualizações desta Política</h2>
        <p>
          Podemos atualizar esta Política para refletir mudanças legais, regulatórias ou operacionais. A versão vigente estará sempre disponível neste endereço.
        </p>

        <h2 className="text-lg font-bold mt-8">13. Contato do Encarregado (DPO)</h2>
        <p>
          Para exercer seus direitos ou esclarecer dúvidas, entre em contato: <a className="underline" href="mailto:dpo@helexia-sion.example">dpo@helexia-sion.example</a>.
        </p>

        <div className="mt-8 text-xs text-muted">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </div>
      </section>
    </main>
  )
}
