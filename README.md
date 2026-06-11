# Thinking Hats

A public LineZero Studio prototype for turning Six Thinking Hats notes into a concise decision brief.

Live site: https://thinking-hats.vercel.app

Example demo: https://thinking-hats.vercel.app/demo

Repository: https://github.com/LineZero-Studio/thinking-hats

## What This Is

Thinking Hats is a small Next.js app that walks a decision through six thinking modes, then produces a structured decision brief. The public site has a landing page at `/` and an example-only demo at `/demo` so anyone can explore the flow without an API key, account, or access code.

This is an independent public prototype that references the Six Thinking Hats methodology developed by Dr. Edward de Bono. It is not an official Edward de Bono, de Bono Group, or Six Thinking Hats training product.

## Features

- Six hat walkthrough using prepared prompts
- Example LinkedIn campaign decision flow
- Final Decision Brief screen
- Optional live OpenAI generation through a server-side API route
- Local browser draft persistence
- Markdown copy/export support in live AI mode
- Vercel-friendly deployment

## Quick Start

```bash
npm install
npm run dev
```

Open http://127.0.0.1:3000.

Open http://127.0.0.1:3000/demo to view the example-only demo.

## Environment Setup

Create a local environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

### Example-Only Mode

Use this for a public demo that does not call OpenAI:

```env
EXAMPLE_ONLY_DEMO=true
NEXT_PUBLIC_GITHUB_URL=https://github.com/LineZero-Studio/thinking-hats
```

In this mode:

- `/demo` opens the prepared LinkedIn example.
- No OpenAI request is made.
- No access code is required.
- The final brief is static example content.

### Live AI Mode

Use this when you want to build a live-AI version with your own OpenAI API key. The public `/demo` route is intentionally static, but the repo still includes the server-side `/api/brief` route and live-AI components for custom builds.

```env
EXAMPLE_ONLY_DEMO=false
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.5
OPENAI_REASONING_EFFORT=low
OPENAI_FALLBACK_MODEL=gpt-5-mini
MVP_ACCESS_CODE=choose-a-private-demo-code
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-org/your-fork
```

The `/api/brief` route requires both `OPENAI_API_KEY` and `MVP_ACCESS_CODE`. The access code is a simple cost-control gate for no-login deployments. If either value is missing, the brief API returns unavailable instead of calling OpenAI.

## Deploying To Vercel

1. Fork or clone this repo.
2. Import the repo into Vercel.
3. For a public demo, set:

```env
EXAMPLE_ONLY_DEMO=true
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-org/your-fork
```

4. For live AI, set the Live AI Mode variables above instead.
5. Deploy.

For the public LineZero Studio demo, we recommend keeping `EXAMPLE_ONLY_DEMO=true` so visitors can explore the app without creating API cost or needing an access code.

## Privacy Notes

In example-only mode, user notes are not sent to OpenAI.

In live AI mode, decision notes are sent from the server-side API route to OpenAI to generate the brief. This app does not store prompts or responses server-side. Drafts are saved only in the user's browser local storage. Vercel Analytics may record page-view level analytics if enabled by the deployment.

Do not enter confidential client information, secrets, legal/medical details, HR issues, high-stakes financial information, or highly sensitive personal information.

## Branding

The project ships with LineZero Studio branding by default. To adapt it for another use:

- Replace `public/design/linezero-logo.svg`.
- Update app metadata in `app/layout.tsx`.
- Update the GitHub link with `NEXT_PUBLIC_GITHUB_URL`.
- Adjust colors and type tokens in `design/colors_and_type.css`.

## Scripts

```bash
npm run dev
npm run build
npm run start
```

## License

MIT License. See [LICENSE](./LICENSE).
