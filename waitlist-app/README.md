# STAVLOS Waitlist App

Viral referral waitlist system for STAVLOS.

## Setup Instructions

### 1. Install Dependencies

Already done! but if needed:
```bash
npm install
```

### 2. Configure Environment Variables

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=Japonendeutch@gmail.com
NEXT_PUBLIC_URL=http://localhost:3000
```

### 3. Set Up Database

1. Go to your Supabase project
2. Open the SQL Editor
3. Run the SQL from `schema.sql`

This will create:
- `waitlist` table
- Auto-increment referral trigger
- `waitlist_with_rank` view
- Performance indexes

### 4. Configure Resend

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use resend's test domain)
3. Get your API key
4. Update `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

### Public Page (`/`)
- Email signup form
- Referral tracking via URL parameter (`?ref=CODE`)
- Success state with:
  - User's rank and badge
  - Referral link
  - Progress bar (2+ referrals = 10% off)
  - Leaderboard preview

### Admin Dashboard (`/admin`)
- Total signups with trends
- Referral statistics
- Rank distribution
- CSV export

**Access:** Currently open, but should be protected with auth for Abraham only.

## Gamification System

### Badges (Based on Rank)
- **1-100**: FOUNDING MEMBER ⭐ (€5/mo forever)
- **101-1,000**: EARLY BIRD 🐦 (€5/mo for 12 months)
- **1,001-2,000**: PIONEER 🚀 (€5/mo for 12 months)
- **2,001+**: STAVLOS SCHOLAR 📚 (€8/mo)

### Referral Rewards
- **2+ referrals** = Additional 10% off for 12 months
- Stacks with rank-based pricing

**Example:** Rank #500 + 2 referrals = €4.50/mo (€5 × 0.9)

## Email Automation

### Welcome Email (Immediate)
Sent right after signup with:
- User's rank
- Badge status
- Referral link
- Personal message from Abraham

### Status Unlock Emails
Special emails for top 2,000 users:
- Top 100: Founding Member email
- Top 1,000: Early Bird email
- Top 2,000: Pioneer email

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Deploy to production
vercel --prod
```

### Custom Domain
Point `waitlist.stavlos.com` to your Vercel deployment.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend
- **Deployment**: Vercel

## File Structure

```
waitlist-app/
├── app/
│   ├── page.tsx              # Main signup page (dual-state)
│   ├── admin/page.tsx        # Admin dashboard
│   ├── api/
│   │   ├── signup/route.ts   # Signup API
│   │   └── admin/export/route.ts  # CSV export
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── supabase.ts           # Supabase client
│   ├── email.ts              # Email automation
│   └── referral.ts           # Referral utilities
├── middleware.ts             # Route protection
├── schema.sql                # Database schema
└── .env.local                # Environment variables
```

## Next Steps

1. ✅ Add your Supabase credentials
2. ✅ Run the schema.sql in Supabase
3. ✅ Add your Resend API key
4. ✅ Test the signup flow
5. ✅ Test referral tracking
6. ✅ Check emails are sending
7. ✅ Deploy to Vercel
8. ⏳ Implement proper admin authentication

## Notes

- No AI costs (pure Supabase + Resend)
- Completely separate from main product app
- Lightweight and fast
- Built for viral growth

---

Built by Abraham, 14 🚀
