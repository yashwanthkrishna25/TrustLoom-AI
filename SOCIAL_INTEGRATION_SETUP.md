# TrustLoom AI — Connect Meta (Facebook/Instagram) and X

This guide connects the existing Express API to official provider APIs. It does not use passwords or scrape social sites.

## 1. Configure local environment

1. Open `server/.env` (create it by copying `server/.env.example` if needed).
2. Keep your existing `JWT_SECRET`, `ENC_KEY`, Firebase settings, and Groq settings unchanged.
3. Add provider credentials only to `server/.env`:

```dotenv
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_GRAPH_VERSION=v26.0
META_REDIRECT_URI=http://localhost:5050/api/integrations/meta/callback

X_CLIENT_ID=your_x_oauth2_client_id
X_CLIENT_SECRET=your_x_client_secret_if_your_app_type_has_one
X_REDIRECT_URI=http://localhost:5050/api/integrations/x/callback
```

Never add secrets to `client/.env`, `NEXT_PUBLIC_*`, or any browser code. Do not send secrets in chat.

## 2. Meta: Facebook Pages + Instagram professional account

1. Sign in to [Meta for Developers](https://developers.facebook.com/) and create an app suitable for your use case.
2. Add/configure Facebook Login (Web) for the app.
3. Register this exact Valid OAuth Redirect URI for local testing:
   `http://localhost:5050/api/integrations/meta/callback`
4. Copy the App ID and App Secret into `META_APP_ID` and `META_APP_SECRET` in `server/.env`.
5. Add the Facebook account and any test users/testers to the app roles while the app is in development mode.
6. For Instagram data, the account must be a Business or Creator account, and the current flow expects it to be linked to a Facebook Page. A personal Instagram account will not appear in this flow.
7. The integration asks for `public_profile`, `pages_show_list`, `pages_read_engagement`, `instagram_basic`, and `instagram_manage_insights`. Only permissions granted to the app and account are available. Some permissions/data require Meta App Review or Advanced Access before external customers can use them.

## 3. X account

1. Sign in to the [X Developer Portal](https://developer.x.com/) and create an app/project with API access enabled.
2. Configure OAuth 2.0 user authentication with PKCE. Add this exact callback URL:
   `http://localhost:5050/api/integrations/x/callback`
3. Copy the OAuth 2.0 Client ID into `X_CLIENT_ID`. If the portal issues a client secret for your app type, put it in `X_CLIENT_SECRET`; do not guess or generate a fake one.
4. The app requests `users.read` and `offline.access` and reads the authenticated user's profile and public metrics. X API access level, rate limits, and billing can restrict requests.

## 4. Start and test

From the project root, run:

```powershell
npm run dev
```

Open `http://localhost:3000`, sign in, open **Integrations**, and choose **Connect Meta** or **Connect X**. Approve the provider consent screen. Return to the app and confirm the account name and available metrics appear. Use **Refresh data** to fetch the latest available profile data.

If the button says OAuth is not configured, check that `server/.env` has the required values and restart the server. If the provider says `redirect_uri mismatch`, the registered URI must match the URI above exactly, including protocol, host, port, path, and trailing slash behavior.

## 5. Before public production launch

- Replace localhost callback URLs with exact HTTPS production URLs and register them in both developer consoles.
- Complete each provider's app review/verification and privacy/data-deletion requirements.
- Add durable OAuth-state storage for multi-instance deployments, token revocation when disconnecting, access-token expiry/revocation handling, encrypted token-specific key rotation, monitoring, and rate-limit/backoff logic.
- Add consent and data-retention controls and only request the minimum scopes needed.
- Never interpret an ML score as proof that an account is a bot. Platform APIs do not grant unrestricted access to all followers or private information.

The current integration stores tokens in the existing AES-256-GCM encrypted local database and does not return tokens to the frontend. OAuth state is held in memory, so finish the OAuth flow against the same running backend process.

## Account Search & Threat Investigation page

The dashboard includes an **Account Search** navigation item. It uses the authenticated server-side integration token and keeps secrets out of browser code.

- **X:** connect X first, then search an X username. The API calls X's `/2/users/by/username/:username` endpoint for the profile fields allowed by your access tier and token permissions.
- **Meta:** search is limited to Facebook Pages and linked Instagram Business/Creator accounts returned by the Meta authorization you granted. This Facebook Login flow cannot search every public Instagram profile by arbitrary username.
- **Analysis:** available fields are passed to the existing local model and simple indicator checks. Because the model was trained on historical Twitter datasets, its probability is an investigative signal—not a validated verdict for every live platform account.
- **Network graph:** the current connected-node illustration is explicitly labelled illustrative. It is not a real follower graph; showing real relationships requires platform endpoints and permissions that provide that data.
- **Report:** the page can export the returned profile, indicators, model result, data-source notes, and timestamp as JSON.

If a search fails, first check that the platform is connected under **Integrations**, then check the provider developer console for endpoint access, token permissions, rate limits, and app review requirements. Do not add provider secrets to client-side files.
