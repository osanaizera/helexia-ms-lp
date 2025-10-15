export const metadata = {
  title: 'Política de Privacidade — Sion',
  description: 'Política de privacidade e proteção de dados (LGPD) para a LP Sion no Mato Grosso do Sul.'
}

export default function Privacy(){
  return (
    <main className="container-pad py-12">
      <style dangerouslySetInnerHTML={{__html:'#brand-header{display:none !important;}'}} />
      <h1 className="section-title">Política de Privacidade</h1>
      <p className="section-sub">Sion — Geração Compartilhada (MS)</p>

      <section className="mt-6 space-y-4 text-sm leading-7">
        <p>
          Esta Política de Privacidade descreve como a Sion ("nós") coleta, utiliza, compartilha e protege dados pessoais dos interessados em aderir à energia com desconto por meio de geração compartilhada no Mato Grosso do Sul. Cumprimos a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD) e demais normas aplicáveis ao setor elétrico.
        </p>

        <h2 className="text-lg font-bold mt-8">1. Controladores e Escopo</h2>
        <p>
          A Sion é responsável pela estruturação e gestão do consórcio/cooperativa e pela comercialização junto à distribuidora, incluindo atendimento aos participantes e coordenação operacional. 
        </p>

        <h2 className="text-lg font-bold mt-8">2. Dados Pessoais Coletados</h2>
        <ul className="list-disc pl-5">
          <li><b>Identificação e contato</b>: nome, e-mail, telefone (WhatsApp), CPF/CNPJ.</li>
          <li><b>Consumo e faturamento</b>: valor médio da fatura, CEP, cidade e informações relacionadas à unidade consumidora.</li>
          <li><b>Navegação e campanhas</b>: parâmetros UTM (utm_source, utm_medium, etc.), <code>gclid</code>, <code>fbclid</code>, <code>msclkid</code>, <b>referrer</b> e <b>URL de aterrissagem</b>.</li>
          <li><b>Arquivos opcionais</b>: imagem/PDF da fatura para agilizar a análise (máx. 5MB), que pode ser armazenada de forma temporária para validação.</li>
          <li><b>Preferências de plano</b> e <b>valor informado</b> para estimativa de desconto e elaboração de proposta.</li>
        </ul>

        <h2 className="text-lg font-bold mt-8">3. Finalidades de Uso</h2>
        <ul className="list-disc pl-5">
          <li><b>Contato comercial</b>: entrar em contato por telefone, e-mail e aplicativos de mensagens (incl. WhatsApp) para apresentar proposta, confirmar dados e realizar adesão.</li>
          <li><b>Elegibilidade e cálculo</b>: estimar desconto sobre TE+TUSD, simular economia e verificar disponibilidade técnica/regulatória.</li>
          <li><b>Prevenção à fraude e segurança</b>: validar identidade, prevenir abusos e cumprir obrigações legais e regulatórias.</li>
          <li><b>Mensuração e melhoria</b>: analisar uso do site, campanhas e conversões (ex.: Google Analytics 4 via Tag Manager) e aprimorar a experiência.</li>
        </ul>

        <h2 className="text-lg font-bold mt-8">4. Bases Legais</h2>
        <ul className="list-disc pl-5">
          <li><b>Procedimentos preliminares ao contrato</b> (art. 7º, V): análise de elegibilidade, simulação e elaboração de proposta a pedido do titular.</li>
          <li><b>Consentimento</b> (art. 7º, I): envio de comunicações de marketing, quando aplicável, e uso de cookies/analytics não essenciais (mediante banner de consentimento).</li>
          <li><b>Legítimo interesse</b> (art. 7º, IX): prospecção compatível com expectativas do titular, mensuração de performance agregada e segurança — com possibilidade de oposição.</li>
          <li><b>Cumprimento de obrigação legal/regulatória</b> (art. 7º, II): atendimento a solicitações de autoridades e normas do setor elétrico.</li>
        </ul>

        <h2 className="text-lg font-bold mt-8">5. Consulta a Fontes Públicas e Bureaus</h2>
        <p>
          Para ofertar condições personalizadas, podemos consultar bases públicas e, quando pertinente, bureaus de crédito, exclusivamente para confirmar dados, verificar riscos e viabilidade da proposta, sempre com fundamento legal adequado e respeitando os direitos dos titulares.
        </p>

        <h2 className="text-lg font-bold mt-8">6. Compartilhamento</h2>
        <ul className="list-disc pl-5">
          <li><b>Sion</b>: operação do consórcio/cooperativa e comercialização.</li>
          <li><b>CRM e automação</b> (ex.: HubSpot): gestão de leads e comunicações.</li>
          <li><b>Hospedagem/infra</b> (ex.: Vercel, provedores cloud): disponibilização do site e serviços de backend.</li>
          <li><b>Google</b> (GA4, Tag Manager, reCAPTCHA, Google Sheets Apps Script): mensuração, antispam e roteamento seguro de dados (quando aplicável).</li>
          <li><b>Atendimento e canais</b>: provedores de e-mail, telefonia e WhatsApp.</li>
          <li><b>Autoridades e órgãos reguladores</b>: quando exigido por lei.</li>
        </ul>

        <h2 className="text-lg font-bold mt-8">7. Transferências Internacionais</h2>
        <p>
          Alguns provedores podem estar fora do Brasil (ex.: EUA/UE). Nesses casos, adotamos salvaguardas adequadas conforme a LGPD (cláusulas contratuais específicas, padrões de segurança e auditoria de fornecedores).
        </p>

        <h2 className="text-lg font-bold mt-8">8. Segurança e Retenção</h2>
        <p>
          Implementamos medidas técnicas e organizacionais para proteger dados contra acessos não autorizados, tais como controle de acesso, criptografia em trânsito e políticas de retenção. Retemos dados pelo tempo necessário às finalidades aqui descritas e/ou para cumprimento de obrigações legais/regulatórias e exercício regular de direitos.
        </p>
        <ul className="list-disc pl-5">
          <li><b>Leads não convertidos</b>: até 24 meses após o último contato útil, salvo oposição anterior.</li>
          <li><b>Contratos/adesões</b>: prazos previstos em lei/regulação aplicável (ex.: até 10 anos para guarda de documentos fiscais).</li>
          <li><b>Logs técnicos</b>: prazos reduzidos conforme necessidade de segurança e auditoria.</li>
        </ul>

        <h2 className="text-lg font-bold mt-8">9. Direitos do Titular</h2>
        <p>
          Você pode solicitar: confirmação do tratamento, acesso, correção, anonimização, portabilidade, eliminação, informação sobre compartilhamentos e revisão de decisões automatizadas. Pode também se opor a tratamentos baseados em legítimo interesse e revogar consentimentos. Para exercer seus direitos, utilize os canais informados no item 13.
        </p>

        <h2 className="text-lg font-bold mt-8">10. Comunicações</h2>
        <p>
          Ao enviar seus dados, você autoriza nosso contato por telefone, e-mail e aplicativos de mensagens (incl. WhatsApp) para propostas, esclarecimentos e conclusão da contratação. Você pode solicitar interrupção dessas comunicações (opt-out) a qualquer momento pelos canais de atendimento.
        </p>

        <h2 className="text-lg font-bold mt-8">11. Cookies e Tags</h2>
        <p>
          Utilizamos cookies e tags (via Google Tag Manager) para medir performance (Google Analytics 4), segurança antispam (Google reCAPTCHA) e melhorar a experiência. As <b>preferências de consentimento</b> podem ser gerenciadas pelo banner do site e/ou no seu navegador. Em campanhas, utilizamos parâmetros UTM e identificadores de cliques (gclid/fbclid/msclkid) para atribuição.
        </p>
        <ul className="list-disc pl-5">
          <li><b>GA4</b>: page views e eventos de conversão desta LP; podemos usar também envio do lado do servidor (Measurement Protocol).</li>
          <li><b>GTM</b>: orquestração de tags e respeito às escolhas de consentimento.</li>
          <li><b>reCAPTCHA</b>: proteção contra abuso de formulário (quando aplicável).</li>
          <li><b>Planilhas Google</b>: como etapa de roteamento seguro de dados para processamento (quando aplicável).</li>
        </ul>

        <h2 className="text-lg font-bold mt-8">12. Crianças e Adolescentes</h2>
        <p>
          Esta LP não se destina a menores de 18 anos e não coletamos intencionalmente dados de crianças e adolescentes. Caso identifiquemos cadastros dessa natureza sem autorização adequada, adotaremos as medidas para exclusão segura.
        </p>

        <h2 className="text-lg font-bold mt-8">13. Atualizações desta Política</h2>
        <p>
          Podemos atualizar esta Política para refletir mudanças legais, regulatórias ou operacionais. A versão vigente estará sempre disponível neste endereço.
        </p>

        <h2 className="text-lg font-bold mt-8">14. Contato do Encarregado (DPO)</h2>
        <p>
          Para exercer seus direitos ou esclarecer dúvidas, entre em contato: <a className="underline" href="mailto:dpo@sion.example">dpo@sion.example</a>.
        </p>

        <div className="mt-8 text-xs text-muted">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </div>
      </section>
    </main>
  )
}
