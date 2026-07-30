// ============================================================================
// Allcare Mar Agency — Google Sign-In (Google Identity Services) configuration
// ============================================================================
// 1. Go to https://console.cloud.google.com and select/create the project
//    linked to your allcaremar.com Google Workspace.
// 2. APIs & Services -> OAuth consent screen -> User Type: EXTERNAL
//    (cambiado de INTERNAL a EXTERNAL para permitir la excepcion de
//    EXTRA_ALLOWED_EMAILS abajo — Carlos Perez usa un Gmail personal, no una
//    cuenta @allcaremar.com. La restriccion real de acceso NO depende de este
//    ajuste de Google: la aplica el codigo de cada pagina via isEmailAllowed()
//    abajo, verificando el dominio + esta lista de excepciones).
// 3. APIs & Services -> Credentials -> Create Credentials -> OAuth client ID
//    -> Application type: Web application.
// 4. Add Authorized JavaScript origins: your GitHub Pages URL
//    (e.g. https://yourorg.github.io) and http://localhost:PORT for testing.
// 5. Copy the Client ID below. See GOOGLE_SETUP.md for the full guide.
// ============================================================================

export const GOOGLE_CLIENT_ID = "564752963603-nanb8q4atdnmrl70s4mg8ljom7md3336.apps.googleusercontent.com";
export const WORKSPACE_DOMAIN = "allcaremar.com";

// Unica excepcion al dominio @allcaremar.com en todo el sitio (login, dashboard,
// resources, firma-requerida): Carlos Perez, agente real que usa un Gmail
// personal en vez de cuenta de Workspace. Pedido explicito de Jesus.
export const EXTRA_ALLOWED_EMAILS = ["carloshealthagent@gmail.com"];

// Verdadero si el email puede entrar al ecosistema de agentes: dominio
// @allcaremar.com, o esta en la lista de excepciones de arriba.
export function isEmailAllowed(email) {
  const e = (email || "").toLowerCase();
  const domain = e.split("@")[1] || "";
  if (domain === WORKSPACE_DOMAIN.toLowerCase()) return true;
  return EXTRA_ALLOWED_EMAILS.map(x => x.toLowerCase()).includes(e);
}
