// ============================================================================
// Session + API calls for portal pages that talk to a real backend
// (sales-report.html, events.html, events-admin.html).
//
// The "UI session" is still the usual one (localStorage, see login.html /
// dashboard-agentes.html: guard()) — that is NOT changed or duplicated here.
//
// Token strategy (updated 2026-08-10): login.html mints a long-lived (15-day)
// session token right at login time (POST /api/auth/session, see
// api/auth.py) and stores it alongside the rest of the local session. Every
// call to this API sends THAT token — not a raw Google id_token — so it
// never depends on Google's silent one-tap refresh during the normal 15-day
// window. That silent refresh (google.accounts.id.prompt()) is suppressed by
// Google after it's been used once in a browser (anti-abuse behavior on
// their end, not something we control); relying on it for every page load
// was causing agents to get intermittently bounced back to the dashboard
// right after opening Sales Report/Events, whenever it silently failed.
//
// The old Google-id_token-refresh dance is kept only as a rare fallback, for
// sessions created before this fix (no cached api token yet) or if the
// exchange in login.html happened to fail (API briefly unreachable at login
// time).
// ============================================================================

import { GOOGLE_CLIENT_ID, isEmailAllowed } from "../../../google-config.js";
import { API_BASE } from "./api-config.js";

function _getRawSession() {
  const raw = localStorage.getItem('acm_gsession');
  if (!raw) return null;
  try { return JSON.parse(raw); }
  catch (e) { localStorage.removeItem('acm_gsession'); return null; }
}

export function guard() {
  const session = _getRawSession();
  if (!session) { window.location.href = '../../../login.html'; return null; }
  if (!isEmailAllowed(session.email) || !session.localExp || Date.now() > session.localExp) {
    localStorage.removeItem('acm_gsession');
    window.location.href = '../../../login.html';
    return null;
  }
  return session;
}

// 60s safety buffer before real expiry.
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;

function _cachedApiToken() {
  const session = _getRawSession();
  if (!session || !session.apiToken || !session.apiTokenExp) return null;
  if (Date.now() > session.apiTokenExp - TOKEN_EXPIRY_BUFFER_MS) return null;
  return session.apiToken;
}

function _cachedGoogleIdToken() {
  const session = _getRawSession();
  if (!session || !session.idToken || !session.idTokenExp) return null;
  if (Date.now() > session.idTokenExp - TOKEN_EXPIRY_BUFFER_MS) return null;
  return session.idToken;
}

let _tokenResolve = null;

function _onCredential(response) {
  if (_tokenResolve) { _tokenResolve(response.credential); _tokenResolve = null; }
}

// Silent fallback for the rare case there's no usable cached Google id_token
// either (agent has had the tab/session open for over an hour AND doesn't
// have a session token yet). Only called from _getGoogleIdTokenForExchange()
// below.
function _promptForFreshToken() {
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
    setTimeout(() => { if (_tokenResolve) { _tokenResolve = null; reject(new Error('timeout')); } }, 10000);
  });
}

async function _getGoogleIdTokenForExchange() {
  const cached = _cachedGoogleIdToken();
  if (cached) return cached;
  return _promptForFreshToken();
}

async function _exchangeForApiToken(googleIdToken) {
  const resp = await fetch(API_BASE + '/auth/session', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + googleIdToken }
  });
  if (!resp.ok) throw new Error('session_exchange_failed');
  const data = await resp.json();
  const session = _getRawSession();
  if (session) {
    session.apiToken = data.session_token;
    session.apiTokenExp = Date.now() + (data.expires_in * 1000);
    session.idToken = googleIdToken;
    session.idTokenExp = Date.now() + 55 * 60 * 1000; // Google id_tokens last ~1h; 55min is a safe estimate.
    localStorage.setItem('acm_gsession', JSON.stringify(session));
  }
  return data.session_token;
}

// Normal path (99% of calls): reuse the 15-day session token login.html
// already minted. Only if that's missing/expired (old session from before
// this fix, or login.html's own exchange failed) do we fall back to getting
// a Google id_token and exchanging it here instead.
export async function getApiSessionToken() {
  const cached = _cachedApiToken();
  if (cached) return cached;

  const googleIdToken = await _getGoogleIdTokenForExchange();
  return _exchangeForApiToken(googleIdToken);
}

export async function apiFetch(apiBase, path, options = {}) {
  let token;
  try { token = await getApiSessionToken(); }
  catch (e) { window.location.href = '../../../login.html'; throw e; }

  // No Content-Type for FormData (file uploads) - the browser sets its own
  // multipart boundary automatically, and only if we don't set the header
  // ourselves first. Blob bodies (downloads) don't need it either.
  const skipContentType = options.body instanceof Blob || options.body instanceof FormData;
  const resp = await fetch(apiBase + path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Authorization': 'Bearer ' + token,
      ...(options.body && !skipContentType ? { 'Content-Type': 'application/json' } : {})
    }
  });
  if (resp.status === 401) { window.location.href = '../../../login.html'; throw new Error('unauthorized'); }
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
