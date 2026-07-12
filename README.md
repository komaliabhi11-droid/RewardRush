# Reward Rush

A premium Firebase-powered earning and rewards dashboard. Users complete offers, spin a reward wheel, claim daily check-ins, earn referral bonuses, and withdraw their balance via UPI or redeem code.

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs to dist/
npm run preview    # preview production build
```

---

## Project Structure

```
RewardRush/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── firebase.json
├── netlify.toml
├── README.md
├── .gitignore
│
├── netlify/
│   └── functions/
│       └── cpx-postback.js     # Serverless CPX Research postback handler
│
└── src/
    ├── main.tsx                # React entry point
    ├── App.tsx                 # Root component — all state & handlers
    ├── index.css               # Tailwind v4 + brand theme tokens
    ├── types.ts                # Shared TypeScript interfaces
    │
    ├── css/
    │   ├── style.css           # Custom classes (glass, wheel, marquee…)
    │   ├── animations.css      # @keyframes and animation utilities
    │   └── responsive.css      # Responsive / breakpoint overrides
    │
    ├── firebase/
    │   ├── config.ts           # Firebase app init + exports
    │   ├── auth.ts             # Auth helpers (sign-up, sign-in, Google, sign-out)
    │   └── database.ts         # Realtime Database helpers
    │
    ├── utils/
    │   └── index.ts            # generateReferralCode()
    │
    ├── components/
    │   ├── CustomAppLogo.tsx
    │   ├── BottomTabItem.tsx
    │   ├── AnimationOverlay.tsx
    │   └── modals/
    │       ├── ShareModal.tsx
    │       ├── WithdrawModal.tsx
    │       └── TermsModal.tsx
    │
    └── screens/
        ├── AuthScreen.tsx
        ├── DailyCheckInView.tsx
        ├── OffersTab.tsx
        ├── TransactionsTab.tsx
        ├── SarvesTab.tsx
        ├── SupportTab.tsx
        ├── ProfileTab.tsx
        ├── PersonalDetailsView.tsx
        ├── AddressDetailsView.tsx
        └── PayoutDetailsView.tsx
```

---

## Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Frontend   | React 19 + TypeScript + Vite 7                    |
| Styling    | Tailwind CSS v4 + custom CSS                      |
| Auth       | Firebase Authentication (email/password + Google) |
| Database   | Firebase Realtime Database                        |
| Survey SDK | CPX Research                                      |
| Serverless | Netlify Functions (CPX postback)                  |

---

## Deploy to Netlify

1. Push this folder to a GitHub repo
2. Connect the repo at [app.netlify.com](https://app.netlify.com)
3. Build settings are pre-configured in `netlify.toml`
4. Add environment variables in Netlify dashboard:
   - `FIREBASE_DATABASE_URL`
   - `FIREBASE_SERVICE_ACCOUNT_JSON`
   - `CPX_SECRET_KEY` *(optional)*

The CPX postback URL will be:
```
https://<your-site>.netlify.app/.netlify/functions/cpx-postback
```

---

## Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # set public dir to "dist", SPA rewrites to index.html
npm run build
firebase deploy --only hosting
```
