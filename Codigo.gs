const SHEET_NAME = "Answers";
const NOTIFY_EMAIL = "info@allcaremar.com";

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
    "Date Recivied: " + data.timestamp.toLocaleString("es-US", { timeZone: "America/New_York" }) + "\n";

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}
