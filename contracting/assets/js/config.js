// ============================================================================
// Contracting & Onboarding — connection config (2026-08-04)
// Fill these in once the backend (Code.gs Web App) is deployed — see
// estado-proyecto.md section 16 for the full steps. Until ENDPOINT_URL is set,
// both preview-contracting.html and reports.html keep using the static data
// in shared-data.js (today's behavior).
// ============================================================================

// Apps Script Web App URL (ends in /exec) — from Deploy > New deployment > Web app.
const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbzBMQEN1SJL3YexLWeLQ_j9jogFY4P-SP5ibjDAvALEevL1Ag6LtU1pl8P3j4mTbneW/exec'; // deployed 2026-08-04

// Same OAuth Client ID already used by login.html / google-config.js on the
// main site (Allcaremar.com New Site) — per Jesus (2026-08-04), reuse it here
// instead of creating a new one. Just needs this domain added to "Authorized
// JavaScript origins" in Google Cloud Console (same project, existing Client ID).
const GOOGLE_CLIENT_ID = '564752963603-nanb8q4atdnmrl70s4mg8ljom7md3336.apps.googleusercontent.com'; // same Client ID as login.html/google-config.js on the main site

// Who can open preview-contracting.html / reports.html (Google Workspace
// login gate). Kept here too (in addition to the Config sheet server-side)
// so the frontend can show/hide the UI immediately without waiting on a
// round trip — the REAL enforcement happens server-side in Code.gs either way.
const AUTHORIZED_REPORT_EMAILS = [
  'mrodriguez@allcaremar.com',
  'info@allcaremar.com',
  'jcabreja@allcaremar.com',
  'epeguero@allcaremar.com',
  'acastillo@allcaremar.com',
];
