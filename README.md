# TrustLoom AI — Complete Research Web Application

**Project title:** A Multi-Feature Interpretable Machine Learning Framework for Identifying Spam Bots and Fake Followers in Social Networks.

TrustLoom AI is a research-oriented web application for analyzing social-account features, classifying likely spam/bot accounts, showing feature evidence, reviewing scan history, and auditing user actions. It is designed for Cresci-style datasets and now includes server-side OAuth integration scaffolding for authorized Meta (Facebook Pages and linked Instagram professional accounts) and X profile metrics. Live connections require your own developer-app credentials, approved permissions, and provider-side configuration; see `SOCIAL_INTEGRATION_SETUP.md`.

## Stack

- **Frontend:** Next.js (React), responsive CSS, Framer Motion, GSAP, Lenis, Three.js
- **React Bits-style effects:** local cursor spotlight component (`client/src/Spotlight.jsx`). React Bits is a source-component collection, not a single required runtime package; use the official repo to add additional components selectively.
- **Backend:** Node.js + Express
- **ML:** Python, pandas, NumPy, scikit-learn; optional LightGBM
- **Security:** bcrypt password hashes, JWT sessions, mandatory TOTP MFA, rate limiting, Helmet, encrypted local store, hash-chained audit events
- **Firebase:** optional Firebase Admin SDK / Cloud Firestore mirror for scan records, user metadata, and audit events

## User roles

- **Administrator (`admin`)** — user creation and role management, dashboard, datasets/scans, settings, audit log, and payment-request review. The Upgrade Plan navigation item is intentionally hidden for admins.
- **Product Manager (`manager`)** — review permitted dashboards, scans, reports, and analysis trends.
- **Security Analyst (`analyst`)** — account analysis, bulk scans, explanations, reports, audit review, and Upgrade Plan.

The backend enforces role restrictions on protected API endpoints; hiding a navigation item alone is not treated as security.

## Quick start (Windows / PowerShell)

1. Install Node.js LTS and Python 3.10+.
2. Extract the ZIP and open the `TrustLoom_AI_Complete` directory in VS Code.
3. Copy `server/.env.example` to `server/.env` and replace `JWT_SECRET` and `ENC_KEY` with your own generated values. Do not commit `.env` or service-account files.
4. Open a terminal in the project root and run:

   ```powershell
   npm run install:all
   npm run dev
   ```

5. Open **http://localhost:3000**. The Express API runs on **http://localhost:5050** and Next.js rewrites `/api/*` to it.
6. Demo accounts are created on a fresh local database: `admin@demo.com`, `manager@demo.com`, and `analyst@demo.com`; the demo password is `Demo@12345`. First login prompts for authenticator MFA setup. Change/remove demo accounts before any deployment.

If the install command fails, run `npm install` separately in the project root, `server`, and `client`, then retry `npm run dev`.

## Firebase Firestore setup

Firebase credentials are intentionally **not bundled** in the ZIP. Configure your own Firebase project:

1. In Firebase Console, create/select a project and enable **Cloud Firestore**.
2. In Google Cloud / Firebase project settings, create a service account key for a server-side service. Keep the downloaded JSON private and never put it in the frontend.
3. Either set `FIREBASE_SERVICE_ACCOUNT_PATH` in `server/.env` to the local path of that JSON file, or set `FIREBASE_SERVICE_ACCOUNT_JSON` to the complete JSON string. Use one method only.
4. Restart the server. Visit `http://localhost:5050/api/health`; `firebase: true` and `storage: "firestore+encrypted-local"` indicate Firestore initialized successfully.
5. Firestore receives mirrored `scans`, `users`, and `audit` documents. The encrypted local store remains the current app's primary store/fallback; this implementation is **not** a full migration of every read/write to Firestore. Configure restrictive IAM and Firestore rules for any additional client-side access.

Never put Firebase Admin service-account JSON in a `VITE_` or `NEXT_PUBLIC_` variable. Those prefixes expose values to browsers.

## GSAP, Lenis, Three.js, React Bits

- GSAP and Lenis are declared in `client/package.json` and initialized in `client/src/MotionRuntime.jsx`.
- Three.js is used by the existing network-globe visualization in `client/src/Extra.jsx`.
- `client/src/Spotlight.jsx` is a local pointer spotlight interaction. React Bits components are typically copied/installed individually from the official source repository; follow component-specific dependencies and licensing rather than installing an unofficial package with the same name.
- Motion respects `prefers-reduced-motion`; the layout is responsive and the spotlight disables on coarse pointers.

Official references:
- GSAP: https://github.com/greensock/GSAP
- Lenis: https://github.com/darkroomengineering/lenis
- React Bits: https://github.com/DavidHDev/react-bits
- Three.js: https://threejs.org/
- Next.js: https://nextjs.org/
- Firebase Admin SDK: https://firebase.google.com/docs/admin/setup

## Training a model

Install Python packages:

```powershell
python -m pip install pandas numpy scikit-learn lightgbm
```

The included starter script currently accepts **two CSV files** (one genuine, one fake/spam) whose columns include account features such as `followers_count`, `friends_count`, `statuses_count`, `created_at`, `description`, and `default_profile_image` where available:

```powershell
python ml/train.py path\to\genuine_users.csv path\to\fake_users.csv
```

It writes `server/model.json` and `server/model_mlp.json`; these generated model files are ignored by Git. The training script is a baseline, not a complete parser for every archive/layout in the Cresci-2015 and Cresci-2017 releases. Inspect each dataset's schema and label definition before training. Do not assume that unrelated JSON/CSV exports share the same label semantics.

## Security and data notes

- The archive you supplied contained a credential-like value in an example environment file. This clean package removes that value; **revoke/rotate any API key that was ever committed, shared, or uploaded**, then add your replacement only to your private `server/.env`.
- The default demo accounts/password are for local evaluation only.
- Generate and retain a stable 32-byte `ENC_KEY` (64 hexadecimal characters). If you change it, the local encrypted database cannot be decrypted.
- The audit chain is tamper-evident within this application; it is not a distributed blockchain.
- Machine-learning predictions are probabilistic signals, not proof that a person/account is malicious. Validate on held-out and cross-dataset splits and report precision, recall, F1, ROC-AUC, and confusion matrices rather than accuracy alone.
- This package does not include your original Cresci archive files; upload/train with your own copies and keep raw datasets out of source control.

## Official social account integrations (Meta + X)

The server includes OAuth connection routes for Meta (Facebook Pages and linked Instagram professional accounts), standalone Instagram Login for the authorizing professional account, and X. Provider access tokens are stored only in the server's encrypted local database and are not returned to the browser. The current integration fetches authorized profile/Page metadata and the public metrics returned by each API; it does **not** claim access to private follower lists or every account on a platform.

### Configure Meta

1. Create an app at [Meta for Developers](https://developers.facebook.com/) and add the Facebook Login product.
2. In the app's valid OAuth redirect URI settings, add exactly `http://localhost:5050/api/integrations/meta/callback` for local development.
3. Copy the app ID and app secret into `server/.env` as `META_APP_ID` and `META_APP_SECRET`. Keep the secret on the server only.
4. The app requests `public_profile`, `pages_show_list`, `pages_read_engagement`, `instagram_basic`, and `instagram_manage_insights`. The exact available data depends on the app mode, permissions, review status, Page access, and linked Instagram account type. Instagram API access here is for professional Business/Creator accounts, not personal Instagram accounts.
5. For external customers, complete Meta App Review/Advanced Access as required, provide the required privacy policy and data deletion handling, and use an HTTPS production callback URI.

### Configure standalone Instagram Login

1. In Meta for Developers, configure the Instagram API with Instagram Login for a professional Business/Creator account and add the required permissions.
2. Register the exact redirect URI shown in `META_INSTAGRAM_REDIRECT_URI`. For local development, Meta may reject `localhost`; use a temporary HTTPS tunnel such as ngrok, then put that exact HTTPS callback into both Meta's Instagram Login setup and `server/.env`.
3. Set `META_INSTAGRAM_APP_ID`, `META_INSTAGRAM_APP_SECRET`, and `META_INSTAGRAM_REDIRECT_URI` in `server/.env`. Never put the app secret in frontend code.
4. Keep the tunnel running while testing. If its URL changes, update both places and restart the server.
5. The standalone Instagram Login flow returns only the authorized account's API-supported fields (username, account type, and media count in this starter). It does not provide an official bot verdict or unrestricted access to arbitrary Instagram users.

### Configure X

1. Create an app in the [X Developer Portal](https://developer.x.com/).
2. Enable OAuth 2.0 user authentication with PKCE and register exactly `http://localhost:5050/api/integrations/x/callback` as the callback/redirect URI.
3. Set the app's client ID as `X_CLIENT_ID`; if X provides a client secret for your app type, set `X_CLIENT_SECRET`. Use the user-context scope `users.read` and refresh-token scope `offline.access`.
4. X API access tiers, rate limits, and billing determine whether requests are available. The integration cannot bypass those requirements.

### Environment and testing

Copy `server/.env.example` to `server/.env` (if not already present), fill in the credentials, then restart `npm run dev`. Sign in, open **Integrations**, and connect each provider. The callbacks must match the redirect URIs registered with the providers character-for-character. Localhost URLs are only for local development; production must use HTTPS. Do not commit `.env`, share client secrets, or put OAuth tokens in frontend environment variables.

The OAuth routes are a local-development integration scaffold. Before public production launch, add durable OAuth state storage, provider token revocation on disconnect, token-encryption/key rotation policy, account deletion/data-retention workflows, production HTTPS, and provider app review/compliance checks.

## Account Search & Threat Investigation

Open **Account Search** after signing in. Search an X username using a connected X OAuth integration, or search an exact Facebook Page / linked Instagram professional username among the Meta assets your connected account can access. The page displays platform-returned profile fields, a model-derived investigative risk signal, visible indicators, model feature contributions, and a JSON report export.

Platform limitations matter: Meta's current Facebook Login flow does not provide unrestricted lookup of every public Instagram profile. The graph in this page is an illustrative network visualization, not a live follower graph. The bot model is trained on historical Twitter datasets and should not be treated as a definitive classifier for modern accounts or other platforms. Live API lookup requires valid provider credentials, permissions, access tier, and available quota.


## Billing and subscriptions

The Upgrade Plan screen is a pricing/feature preview only. This package does **not** process UPI/FamPay payments or activate subscriptions automatically. Before accepting money, integrate a supported merchant payment provider, create orders on the server, verify payment status with signed webhooks/provider APIs, and enforce entitlements in protected backend routes. A displayed QR code or user-submitted payment screenshot is not proof of payment.


## UPI subscription checkout (manual review)

- Product Manager and Security Analyst roles can open **Upgrade Plan**, select Pro (₹99/30 days) or Team (₹249/30 days), scan the supplied FamApp UPI QR, and submit the transaction reference.
- The page intentionally does not print the payee name or UPI ID as text. The QR still encodes the destination; a UPI app may reveal payee details before the payer confirms.
- Admins review requests in **Payment Reviews**. They must verify the transaction independently in the payment app/bank records before approving. Approval activates the selected plan for 30 days. A submitted reference is not payment proof.
- The static QR workflow is **not automated payment verification** and is not a substitute for a payment gateway with signed webhooks/status APIs for public production use. Bulk-scan API access requires an active Pro/Team subscription. Configure prices and obtain a suitable merchant/payment-provider integration before accepting real customer payments.
