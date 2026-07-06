# Allcare Mar Agency — Sitio Web + Intranet de Agentes

Sitio estático para GitHub Pages: sitio informativo público (`index.html`) más una Intranet de
Agentes restringida por Google Workspace (`login.html`, `dashboard-agentes.html`).

## Estructura

- `index.html` — sitio informativo público.
- `login.html` — "Sign in with Google", restringido a cuentas `@allcaremar.com`.
- `dashboard-agentes.html` — panel de 7 herramientas del agente, requiere una sesión activa de Google.
- `google-config.js` — tu OAuth Client ID de Google + dominio de Workspace (complétalo antes de publicar).
- `privacy-security-policy.pdf` — enlazado desde el footer de cada página.

## Antes de publicar

Lee primero [`GOOGLE_SETUP.md`](./GOOGLE_SETUP.md) — el inicio de sesión no funcionará hasta que
configures el OAuth client de Google Cloud y la pantalla de consentimiento restringida a tu
Workspace.

Sin base de datos, sin Firebase, sin autoregistro: el acceso se otorga o se revoca por completo
según si la persona tiene una cuenta activa de Google Workspace `allcaremar.com`.
