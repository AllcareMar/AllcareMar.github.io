// ============================================================================
// Session + API calls for portal pages that talk to a real backend
// (sales-report.html, events.html, events-admin.html).
//
// The "UI session" is still the usual one (localStorage, see login.html /
// dashboard-agentes.html: guard()) — that is NOT changed or duplicated here.
//
// Token strategy: login.html now stores the real Google id_token (JWT) it
// received at login time, plus its real expiry (~1h, set by Google). We
// reuse that same token for every API call while it's still valid, instead
// of asking Google for a new one on every click via a silent
// google.accounts.id.prompt(). That silent "One Tap" prompt is suppressed
// by Google after it's been used once in a browser (anti-abuse behavior on
// their end, not something we control) — calling it on every page load was
// causing it to fail almost immediately after login, which redirected the
// agent to login.html, which then saw the (still valid) local session and
// bounced them straight back to the dashboard. Only once the cached token
// actually expires (~1h since last login) do we fall back to the silent
// prompt, and only if that also fails do we send the agent to log in again.
// ============================================================================

import { GOOGLE_CLIENT_ID, isEmailAllowed } from "../../../google-config.js";

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

// 60s safety buffer before Google's real expiry.
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;

function _cachedToken() {
  const session = _getRawSession();
  if (!session || !session.idToken || !session.idTokenExp) return null;
  if (Date.now() > session.idTokenExp - TOKEN_EXPIRY_BUFFER_MS) return null;
  return session.idToken;
}

let _tokenResolve = null;

function _onCredential(response) {
  if (_tokenResolve) { _tokenResolve(response.credential); _tokenResolve = null; }
}

// Silent fallback for the rare case the cached token from login has expired
// (agent has had the tab/session open for over an hour). Only called then —
// see getFreshIdToken() below.
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

export async function getFreshIdToken() {
  const cached = _cachedToken();
  if (cached) return cached;

  const token = await _promptForFreshToken();
  // Persist it so subsequent calls this same visit reuse it too, instead of
  // prompting again for every single API call on the page.
  const session = _getRawSession();
  if (session) {
    session.idToken = token;
    session.idTokenExp = Date.now() + 55 * 60 * 1000; // Google id_tokens last ~1h; 55min is a safe estimate.
    localStorage.setItem('acm_gsession', JSON.stringify(session));
  }
  return token;
}

export async function apiFetch(apiBase, path, options = {}) {
  let token;
  try { token = await getFreshIdToken(); }
  catch (e) { window.location.href = '../../../login.html'; throw e; }

  const resp = await fetch(apiBase + path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Authorization': 'Bearer ' + token,
      ...(options.body && !(options.body instanceof Blob) ? { 'Content-Type': 'application/json' } : {})
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
