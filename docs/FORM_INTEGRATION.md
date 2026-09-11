# Enquiry delivery

The current preview provides a functional email-draft journey, telephone and email links, and a link to EON's existing protected form. It does not claim to send mail. Validation preserves input; the visitor reviews and sends the draft in their email application.

The current EON contact page uses Contact Form 7 form 6101 with a human-selected icon challenge and honeypot. Its public schema requires phone length 6 to 12, even though its own example is longer. Name, email and enquiry type are required. Company is optional. The preview asks for a message to make the email useful and limits it to the live 2000-character bound.

## Implemented server adapter

app/api/enquiry/route.ts is a server-only endpoint. GET reports enabled:false while unconfigured. POST then returns 503 and never reports success or sends a request. When explicitly configured, it issues a genuine challenge through the owner gateway, validates origin and field bounds, consumes a one-use challenge, applies the gateway's rate-limit decision, and posts mapped fields to CF7. Only mail_sent is accepted as backend success. Timeouts are not retried.

Required runtime values:

- EON_WP_BACKEND_ORIGIN: stable HTTPS WordPress origin that remains separate from the new public frontend.
- EON_FRONTEND_ORIGIN: exact allowed frontend origin.
- EON_CHALLENGE_GATEWAY: HTTPS gateway base URL ending in a slash.
- EON_CHALLENGE_SECRET: server-only Bearer credential for that gateway.

Gateway contract, authenticated server-to-server JSON POST:

- issue: returns sessionId, instructions and options [{id,label,image?}]. Images must be HTTPS. Issue a genuine backend verification challenge, not a copied static answer.
- allow: accepts clientKey and returns {allowed:boolean}. Apply durable atomic rate limits.
- consume: accepts sessionId and the visitor's answer, atomically consumes the session and returns {valid:true,challenge:{formFields,cookieHeader?}} only for a valid live session. Preserve real CF7 identity and plugin fields. It must not override enquiry fields.

The gateway and stable WordPress backend are owner dependencies, not services provisioned by this website. Current secrets are deliberately unset. Verify CF7 recipient, sender domain, mail transport and anti-bot settings, then authorize a staging receipt test before enabling direct delivery. No live enquiry was submitted during development. Fixture success is not inbox delivery proof.

Evidence: assets/source-2026-09-11/FORM_ADAPTER_REQUIREMENTS.md and raw source responses. Seven adapter fixtures cover field mapping, exact acceptance, bounds, origin, missing configuration, verification/rate gates, field injection and timeout. Production endpoint checks are recorded separately in QA_REPORT.md.
