# TrueFeedback

An anonymous messaging platform where anyone can send you honest, anonymous feedback via your personal link.

## Tech Stack

- Next.js (App Router) + TypeScript
- NextAuth (credentials) for auth
- MongoDB + Mongoose
- Zod + React Hook Form
- Tailwind CSS + shadcn/ui
- Resend (email verification) + Groq AI (message suggestions)

## Features

- Sign up with email OTP verification
- Anonymous message board at `/u/[username]`
- Dashboard: copy link, toggle acceptance, view & delete messages
- AI-suggested message prompts

## Getting Started

```bash
git clone https://github.com/deepanshu210306/TrueFeedback.git
cd TrueFeedback/truefeedback
npm install
npm run dev
```

Open http://localhost:3000

## Environment Variables

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
RESEND_API_KEY=your_resend_api_key
GROQ_API_KEY=your_groq_api_key
```

## Author

Deepanshu
