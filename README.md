# Project 3: Intel Site Localization - Adapting Your Website for RTL Languages
You'll adapt your Intel Journey webpage to support right-to-left (RTL) languages and improve its accessibility and interactivity. 

You'll modify the layout, integrate Bootstrap, and add a subscription form to enhance user engagement.

## Local run (127.0.0.1)

1. Install dependencies:

	npm install

2. Create local SMTP config:

	cp .env.example .env

3. Edit `.env` and set valid SMTP values:

	- `SMTP_HOST`
	- `SMTP_PORT`
	- `SMTP_SECURE`
	- `SMTP_USER`
	- `SMTP_PASS`
	- optional: `FROM_EMAIL`

4. Start server:

	npm start

5. Open in browser:

	http://127.0.0.1:3000

## Subscription confirmation flow

- The page includes a subscription form at the bottom.
- Submitting the form sends a POST request to `/api/subscribe`.
- The server sends a confirmation email to the entered address using SMTP settings from environment variables.
