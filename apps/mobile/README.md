# @make-the-change/mobile

> The Mobile Application for Make the CHANGE users.

[![Expo](https://img.shields.io/badge/Expo-55-black)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.78-blue)](https://reactnative.dev/)

## 🚀 Features

- **Biodiversity Investment**: Browse and support projects on the go.
- **Portfolio Tracking**: Real-time updates on your impact and points.
- **Marketplace**: Redeem points for eco-friendly products.
- **Native Experience**: Smooth, gesture-based interactions via Expo Router.

## 🛠️ Tech Stack

- **Framework**: Expo 55 + Expo Router
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **Data**: TanStack Query (React Query)
- **Auth**: Supabase Auth
- **Navigation**: File-based routing

## 📦 Project Structure

```bash
app/
├── (tabs)/          # Main tab navigation
│   ├── index.tsx    # Home
│   ├── projects.tsx # Invest
│   └── products.tsx # Shop
└── _layout.tsx      # Root layout
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 20+
- iOS Simulator (Mac) or Android Emulator
- Expo Go app (Physical device)

### Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env
```
Required:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Development

```bash
# Start Metro bundler
pnpm dev

# Press 'i' for iOS Simulator
# Press 'a' for Android Emulator
```

## 🤝 Dependencies
Internal:
- `@make-the-change/core`: Uses shared types and business logic.
