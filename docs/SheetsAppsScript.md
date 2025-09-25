Integração com Google Sheets via Apps Script (Web App)

Resumo
- Este Web App recebe um POST JSON do site, opcionalmente grava a fatura (base64) no Drive e adiciona uma linha na planilha com os dados do lead e o link do arquivo.

Passo a passo
1) Abra sua planilha no Google Sheets.
2) Extensões > Apps Script.
3) Cole o script abaixo substituindo FOLDER_ID (pasta no Drive para faturas). Opcionalmente, ajuste SHEET_NAME.
4) Deploy > New deployment > Web app > Anyone with the link. Copie a URL e coloque em SHEETS_WEB_APP_URL no .env.local.

Script (Apps Script)
```
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Leads') || ss.insertSheet('Leads');

    // Colunas exemplo; ajuste conforme preferir
    // Cabeçalho (só adiciona se estiver vazio)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp','Nome','Email','Telefone','Documento','Tipo Doc','CEP','Cidade','Segmento','Plano',
        'Fatura Média','% Desconto Estimado','Economia Estimada (R$)','Lead Source','utm_source','utm_medium','utm_campaign','utm_term','utm_content',
        'Referrer','Landing URL','GCLID','FBCLID','MSCLKID','Link Fatura'
      ]);
    }

    var lead = data.lead || {};
    var file = data.file || null;
    var fileUrl = '';
    if (file && file.base64 && file.name) {
      var folder = DriveApp.getFolderById('FOLDER_ID');
      var blob = Utilities.newBlob(Utilities.base64Decode(file.base64), file.contentType || 'application/octet-stream', file.name);
      var created = folder.createFile(blob);
      created.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = created.getUrl();
    }

    var utm = lead.utm || {};
    sheet.appendRow([
      new Date(),
      lead.fullname || '',
      lead.email || '',
      lead.phone || '',
      lead.document || '',
      lead.documentType || '',
      lead.cep || '',
      lead.city || '',
      lead.segment || '',
      lead.plan || '',
      lead.avgBillValue || '',
      lead.estimatedDiscountPct || '',
      lead.estimatedSaving || '',
      lead.leadSource || '',
      utm.utm_source || '',
      utm.utm_medium || '',
      utm.utm_campaign || '',
      utm.utm_term || '',
      utm.utm_content || '',
      lead.referrer || '',
      lead.landingUrl || '',
      lead.gclid || '',
      lead.fbclid || '',
      lead.msclkid || '',
      fileUrl
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, fileUrl: fileUrl }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

Configuração no projeto
- Em .env.local, defina:
```
SHEETS_WEB_APP_URL=https://script.google.com/macros/s/SEU_DEPLOY_ID/exec
```

Como funciona o envio
- No submit do formulário, o site primeiro envia ao /api/lead (HubSpot). Em seguida, envia para /api/sheets, que repassa ao Web App do Apps Script com o JSON e, se houver, a fatura em base64.

