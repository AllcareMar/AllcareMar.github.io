// ============================================================================
// Allcare Mar Agency — Google Sign-In (Google Identity Services) configuration
// ============================================================================
// 1. Go to https://console.cloud.google.com and select/create the project
//    linked to your allcaremar.com Google Workspace.
// 2. APIs & Services -> OAuth consent screen -> User Type: INTERNAL
//    (this alone blocks any non-allcaremar.com account at Google's own
//    sign-in screen, before this site ever sees a token).
// 3. APIs & Services -> Credentials -> Create Credentials -> OAuth client ID
//    -> Application type: Web application.
// 4. Add Authorized JavaScript origins: your GitHub Pages URL
//    (e.g. https://yourorg.github.io) and http://localhost:PORT for testing.
// 5. Copy the Client ID below. See GOOGLE_SETUP.md for the full guide.
// ============================================================================

export const GOOGLE_CLIENT_ID = "564752963603-nanb8q4atdnmrl70s4mg8ljom7md3336.apps.googleusercontent.com";
export const WORKSPACE_DOMAIN = "allcaremar.com";
