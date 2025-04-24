# Full-Stack-Firebase-Project

A full-stack cross-platform app using **Next.js** (web) and **Expo (React Native)** (mobile), powered by **Firebase** for authentication, notifications, and real-time data.

## 🔑 Features

- Google Sign-In Authentication  
- User Profiles with Protected Routes  
- Firebase Cloud Messaging (Push Notifications)  
- Tab Navigation (Expo Router)  
- Light/Dark Theme Support  
- Cross-platform via `react-native-web`

## ⚙️ Tech Stack

- **Frontend:** Next.js, React Native (Expo), Material UI  
- **Backend:** Firebase (Auth, Firestore, FCM, Functions)  
- **Styling:** Emotion, CSS Modules  
- **Tools:** Expo Router, Babel, ESLint, Jest

## 🚀 Getting Started

### 1. Clone & Install

```
git clone https://github.com/yourusername/Full-Stack-Firebase-Project.git
cd web
npm install
cd ../mobile
npm install
```
### 2. Set Up Firebase
Create a .env file in both web/ and mobile/:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
# ... other Firebase config
```
### 3. Run the Apps
Web:
```
cd web
npm run dev
```
Mobile:
```
cd mobile
npm run start
```
📦 Build
Web: 
```
npm run build
npm start
```
Mobile: 
```
expo build:[android|ios]
```
