# FDL Chatbot

## Gemini API key
- The Gemini API key must be stored in the server environment as `GEMINI_API_KEY`.
- The chatbot client calls `app/api/chatbot/route.ts`, and that route makes the Gemini request server-side so the key does not ship to the browser or the repo.

## System prompt
- Update the assistant prompt in `lib/chatbot/systemPrompt.ts`.

## Handoff contact details
- WhatsApp / direct contact number: `07869 022673`
- Email fallback: `fdlbespokeuk@gmail.com`
- Update these in `components/chatbot/FDLChatbot.tsx`.
- The shared public email also exists in `lib/siteContent.ts`.

## Runtime configuration
- Set `GEMINI_API_KEY` in:
  - local `.env.local`
  - Vercel Production environment variables
- The chatbot route currently uses `gemini-2.5-flash-lite`.

## Local testing
1. Start the site locally.
2. Open any public page and launch the chatbot from the bottom-right bubble.
3. Run a full lead flow by giving the bot:
   - vehicle
   - service
   - name
   - phone or email
4. Confirm the assistant response stays clean on screen and the handoff card appears underneath it.
5. Click `Send via WhatsApp` and confirm the enquiry body is prefilled correctly.
6. Click `Email instead` and confirm the subject and body are prefilled correctly.
7. Confirm the chatbot does not appear on `/admin/*`.

## Deviation from the brief
- The chatbot is mounted site-wide for public pages only and intentionally hidden on `/admin/*` to match the repo's shared layout structure and avoid placing the public enquiry assistant inside the admin area.
- The original brief asked for a hardcoded client-side Gemini key. The implementation now uses a server-side route plus `GEMINI_API_KEY` to avoid exposing the key in git or in the browser bundle.
