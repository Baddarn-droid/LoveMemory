# LoveMemory — Custom Portraits (Frontend)

A professional, art-gallery-style site for custom portraits (pets, families, kids & friends). Next.js 15, Tailwind CSS, and Framer Motion.

## Project structure (repo root)

- **frontend/** — This folder. Next.js app; can be a **public** repo (no API keys here if you use the backend).
- **backend/** — API keys and sensitive routes (OpenAI, Stripe). Keep private or deploy with env vars.
- **Bilder/** — Your images folder (unchanged).

## Setup & run

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment**  
   Create `frontend/.env.local` (never commit it).  
   - **With backend (recommended):** set only `NEXT_PUBLIC_BACKEND_URL=http://localhost:3001` (or your backend URL). No API keys in the frontend.  
   - **Without backend:** set your host’s env vars for `OPENAI_API_KEY` and Stripe keys; the app uses same-origin API routes.

3. **Run in development**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Features

- Create flow: Upload → Generate → Download / Print / Framed (Stripe checkout).
- Categories: Pets, Family, Kids, Couples, Self. Multiple portrait styles.
- Design: charcoal, off-white, Satoshi + Inter.

See repo root **README.md** for an overview of the whole project.
