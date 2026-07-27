const SHEET_NAME = "Answers";
const NOTIFY_EMAIL = "info@allcaremar.com";

// ============================================================================
// Gate de Firma — Confidentiality Agreement (Jotform)
// ============================================================================
// Requiere una API Key de Jotform guardada en Script Properties:
// Extensiones > Apps Script > Configuración del proyecto > Propiedades del script
// Nombre: JOTFORM_API_KEY   Valor: <la key que genera Jesus en jotform.com/myaccount/api>
// ============================================================================
const JOTFORM_FORM_ID = '262074897196068';
const JOTFORM_EMAIL_FIELD = 'emailAddress'; // "name" del campo q25_emailAddress en Jotform
const JOTFORM_CACHE_KEY = 'jotform_signed_emails_v1';
const JOTFORM_CACHE_TTL = 300; // 5 min — evita golpear la API de Jotform en cada login

function doGet(e) {
  const action = (e.parameter.action || '').toString();
  if (action === 'checkSignature') {
    const force = (e.parameter.force || '') === '1';
    return checkSignature_(e.parameter.email || '', force);
  }
  return jsonOutput_({ result: 'error', message: 'Unknown action' });
}

// force=true ignora el cache de 5 min y consulta Jotform en vivo. Se usa solo
// justo después de que un agente firma (?justSigned=1 en el dashboard), para
// no quedar atrapado esperando a que expire el cache de otros agentes.
function checkSignature_(rawEmail, force) {
  const email = (rawEmail || '').toString().trim().toLowerCase();
  if (!email) return jsonOutput_({ signed: false });

  try {
    const signedMap = getSignedEmailMap_(force);
    if (signedMap[email]) {
      return jsonOutput_({ signed: true, signedAt: signedMap[email] });
    }
    return jsonOutput_({ signed: false });
  } catch (err) {
    // Si Jotform/API falla, NO dejamos pasar al agente — se responde signed:false
    // y el frontend reintenta en la próxima carga. Se loguea el error para diagnóstico.
    console.error('checkSignature_ error: ' + err.toString());
    return jsonOutput_({ signed: false, error: err.toString() });
  }
}

function getSignedEmailMap_(force) {
  const cache = CacheService.getScriptCache();
  if (!force) {
    const cached = cache.get(JOTFORM_CACHE_KEY);
    if (cached) return JSON.parse(cached);
  }

  const apiKey = PropertiesService.getScriptProperties().getProperty('JOTFORM_API_KEY');
  if (!apiKey) throw new Error('Falta JOTFORM_API_KEY en Script Properties');

  const map = {};
  const limit = 100;
  let offset = 0;

  while (true) {
    const url = 'https://api.jotform.com/form/' + JOTFORM_FORM_ID + '/submissions'
      + '?apiKey=' + encodeURIComponent(apiKey)
      + '&limit=' + limit
      + '&offset=' + offset
      + '&orderby=created_at';
    const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const json = JSON.parse(resp.getContentText());
    const content = (json && json.content) || [];

    content.forEach(function (sub) {
      const answers = sub.answers || {};
      Object.keys(answers).forEach(function (qid) {
        const a = answers[qid];
        if (a && a.name === JOTFORM_EMAIL_FIELD && a.answer) {
          const em = a.answer.toString().trim().toLowerCase();
          if (em && !map[em]) map[em] = sub.created_at || new Date().toISOString();
        }
      });
    });

    if (content.length < limit) break;
    offset += limit;
    if (offset > 5000) break; // salvaguarda
  }

  cache.put(JOTFORM_CACHE_KEY, JSON.stringify(map), JOTFORM_CACHE_TTL);
  return map;
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    const params = e.parameter;
    const firstName = params.firstName || "";
    const lastName  = params.lastName  || "";
    const phone     = params.phone     || "";
    const email     = params.email     || "";
    const ageRange  = params.ageRange  || "";
    const interest  = params.interest  || "";
    const message   = params.message   || "";
    const lang      = params.lang      || "en";
    const timestamp = new Date();

    sheet.appendRow([timestamp, firstName, lastName, phone, email, ageRange, interest, message, lang]);

    sendNotificationEmail({ firstName, lastName, phone, email, ageRange, interest, message, timestamp });

    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function sendNotificationEmail(data) {
  const subject = "New Request - Allcare Mar Website";
  const body =
    "A new request for a free consultation was received via the website:\n\n" +
    "Name: " + data.firstName + " " + data.lastName + "\n" +
    "Phone Number: " + data.phone + "\n" +
    "Email: " + (data.email || "None") + "\n" +
    "Age Range: " + data.ageRange + "\n" +
    "Interest In: " + data.interest + "\n" +
    "Message: " + (data.message || "None") + "\n" +
    "Date Received: " + data.timestamp.toLocaleString("es-US", { timeZone: "America/New_York" }) + "\n";

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}
