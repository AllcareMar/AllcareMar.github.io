// ============================================================================
// Allcare Mar Agency — unified API (Daily Sales Report + Events)
// ============================================================================
// Runs on the agency's own server (Docker + Tailscale), folder
// "App Reporte de Ventas/api" in the Claude Project. Deployed and live as of
// 2026-08-06 — same domain/port already used by Daily Sales Report, the API
// lives on the same app behind the /api prefix, no new port needed.
// ============================================================================

export const API_BASE = "https://server-bayonne.tailed39b8.ts.net:10000/api";

export function apiReady() {
  return typeof API_BASE === "string" && /^https?:\/\//.test(API_BASE);
}
