// ============================================================================
// Session + API calls for portal pages that talk to a real backend
// (sales-report.html, events.html, events-admin.html).
//
// The "UI session" is still the usual one (localStorage, see login.html /
// dashboard-agentes.html: guard()) — that is NOT changed or duplicated here.
//
// What's new is that, whenever a page needs to talk to the API
// (../App Reporte de Ventas/api), it asks Google Identity Services for a
// fresh id_token (silent: if the browser already has an active Google
// session, no popup appears) and sends it as
// "Authorization: Bearer <token>" — the backend verifies it on every
// request, never trusting whatever localStorage claims.
// ============================================================================

import { GOOGLE_CLIENT_ID, isEmailAllowed } from "../../google-config.js";

export function guard() {
  const raw = localStorage.getItem('acm_gsession');
  if (!raw) { window.location.href = '../login.html'; return null; }
  let session;
  try { session = JSON.parse(raw); }
  catch (e) { localStorage.removeItem('acm_gsession'); window.location.href = '../login.html'; return null; }
  if (!isEmailAllowed(session.email) || !session.localExp || Date.now() > session.localExp) {
    localStorage.removeItem('acm_gsession');
    window.location.href = '../login.html';
    return null;
  }
  return session;
}

let _tokenResolve = null;

function _onCredential(response) {
  if (_tokenResolve) { _tokenResolve(response.credential); _tokenResolve = null; }
}

export function getFreshIdToken() {
  return new Promise((resolve, reject) => {
    if (typeof google === 'undefined' || !google.accounts) { reject(new Error('gis_not_loaded')); return; }
    _tokenResolve = resolve;
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: _onCredential,
      auto_select: true,
      cancel_on_tap_outside: false
    });
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed && notification.isNotDisplayed() || notification.isSkippedMoment && notification.isSkippedMoment()) {
        if (_tokenResolve) { _tokenResolve = null; reject(new Error('silent_auth_failed')); }
      }
    });
    setTimeout(() => { if (_tokenResolve) { _tokenResolve = null; reject(new Error('timeout')); } }, 6000);
  });
}

export async function apiFetch(apiBase, path, options = {}) {
  let token;
  try { token = await getFreshIdToken(); }
  catch (e) { window.location.href = '../login.html'; throw e; }

  const resp = await fetch(apiBase + path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Authorization': 'Bearer ' + token,
      ...(options.body && !(options.body instanceof Blob) ? { 'Content-Type': 'application/json' } : {})
    }
  });
  if (resp.status === 401) { window.location.href = '../login.html'; throw new Error('unauthorized'); }
  return resp;
}

export async function apiJson(apiBase, path, options = {}) {
  const resp = await apiFetch(apiBase, path, options);
  if (!resp.ok) {
    let detail = resp.statusText;
    try { detail = (await resp.json()).detail || detail; } catch (e) {}
    throw new Error(detail);
  }
  if (resp.status === 204) return null;
  return resp.json();
}

export async function apiDownload(apiBase, path, filename) {
  const resp = await apiFetch(apiBase, path);
  if (!resp.ok) throw new Error('download_failed');
  const blob = await resp.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
