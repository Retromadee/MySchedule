# Firebase production setup

The app reads all Firebase web configuration from Vercel environment variables. Copy `.env.example` to `.env.local` for local development, then set the same values in Vercel for Production, Preview, and Development.

Required variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_DATABASE_URL`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Deploy the contents of `database.rules.json` in Firebase Realtime Database Rules. They ensure every signed-in user can read and write only `/users/{uid}`.

For Google and Apple login, add the Vercel production domain to Firebase Authentication's Authorized domains list. Apple sign-in also requires the Apple Service ID and redirect domain configured in Firebase Authentication.
