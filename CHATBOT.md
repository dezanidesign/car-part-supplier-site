# FDL Chatbot

## Gemini API key
- The Gemini API key is hardcoded in `components/chatbot/FDLChatbot.tsx`.
- This setup relies on the key being domain-restricted to `fdlbespoke.co.uk` in Google Cloud Console.

## System prompt
- Update the assistant prompt in `lib/chatbot/systemPrompt.ts`.

## Handoff contact details
- WhatsApp / direct contact number: `07869 022673`
- Email fallback: `fdlbespokeuk@gmail.com`
- Update these in `components/chatbot/FDLChatbot.tsx`.
- The shared public email also exists in `lib/siteContent.ts`.

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
