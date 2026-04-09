# 🚲 Amsterdam Tour by Sheersho (React + Vite)

A simple web app to explore an Amsterdam tour route stop by stop.  
Built with **React** + **Vite** for fast development.

---

## 🧭 Project Overview (Plain English)

This app helps a user:

- 👋 Start from a landing/home page
- 🗺️ View tour stops
- 📍 Open details for each stop
- 🔁 Move through the route easily

Think of it like a mini digital tour guide for Amsterdam.

---

## 🛠️ Tech Stack

- ⚛️ **React** — UI components
- ⚡ **Vite** — fast dev server + build tool
- 🧹 **ESLint** — code quality checks
- 💅 **CSS** — styling

---

## 📁 Folder Guide

> Main folders/files you’ll likely use:

- `src/App.jsx` → app routing/layout entry
- `src/components/` → UI pages/components
  - `LandingPage.jsx` → first screen
  - `AllStopsPage.jsx` → list of all stops
  - `StopPage.jsx` → single stop details
- `src/data/tourdata.js` → tour stop data
- `public/` → static files (images/icons)
- `README.md` → this guide

---

## ▶️ How to Run the Project (Mac)

### 1) Install dependencies
```bash
npm install
```

### 2) Start development server
```bash
npm run dev
```

### 3) Open in browser
Vite will show a local URL, usually:

- `http://localhost:5173/`

---

## 🧪 Useful Commands

```bash
# Start dev server
npm run dev

# Build production files
npm run build

# Preview production build locally
npm run preview

# Run lint checks
npm run lint
```

---

## 🧭 How to Navigate the App

- Start on the **Landing page** 👋
- Go to **All Stops** to see the full tour list 🗂️
- Click a stop to open **Stop details** 📍
- Use navigation controls to move around 🔄

---

## ✍️ For New Developers

If you’re new to this project, edit in this order:

1. `src/data/tourdata.js` → change stop content
2. `src/components/*.jsx` → adjust UI screens
3. styles (`.css`) → tweak look and feel

---

## 🚀 Deployment Notes

This project is ready to deploy on **Cloudflare Pages**.

Use these settings in Cloudflare Pages:

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/` (leave default unless you deploy from a subfolder)

Client-side routing is handled with [`public/_redirects`](/Users/sheersho/Documents/amsterdam-tour/public/_redirects), so routes like `/tour` and `/access` resolve correctly on refresh.

To create deployable files locally:

```bash
npm run build
```

Output is generated in the `dist/` folder.

---

## ❓Troubleshooting

- If app doesn’t start:
  - Check Node is installed: `node -v`
  - Remove `node_modules` and reinstall:
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```
- If port is busy:
  - Vite will suggest another port automatically.

---

Happy building! 🎉
