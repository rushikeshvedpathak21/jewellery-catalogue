# Jewellery Catalogue Website

A complete React + Vite + Tailwind CSS jewellery catalogue website for a small local jewellery shop in India.

## What is included

- Public home page
- Catalogue, search, category, product detail, wishlist, and new arrivals pages
- Admin dashboard with login protection
- Products, categories, settings, and feature management screens
- Multilingual UI: English, Hindi, Marathi
- Feature flags with editable disabled messages
- WhatsApp inquiry flow
- Recently viewed and wishlist storage
- Supabase-ready backend integration
- Demo/localStorage fallback so the project runs even before Supabase is connected

## Tech stack

- React + Vite
- Tailwind CSS
- React Router v6
- Supabase
- react-i18next
- papaparse
- lucide-react
- qrcode.react

## Run locally

```bash
npm install
npm run dev
```

Create a `.env` file from `.env.example` and add your Supabase credentials when ready.

## Supabase setup

1. Create the tables using `supabase-schema.sql`
2. Seed defaults using `supabase-seed.sql`
3. Create a public Storage bucket named `product-images`
4. Add the environment variables in Vercel or your local `.env`

## Admin login

Default credentials:

- Username: `admin`
- Password: `jewels123`

The session is stored in localStorage.

## Notes

- No cart, checkout, or payment flow is included.
- All inquiries go through WhatsApp only.
- The app is mobile responsive.
- Feature flags are editable from the admin panel.

## Deploy to Vercel

1. Push this project to GitHub
2. Import the repo in Vercel
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. Deploy

## Changing the admin password

Edit `src/services/auth.js` and replace the `USERNAME` and `PASSWORD` constants.

## Feature Management

Open `/admin/features` to turn site features on or off and update disabled messages in all three languages.
