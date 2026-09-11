# Contact integration: source verified 11 September 2026

The live contact page uses Contact Form 7 6.1.7, form 6101, container post 6096. The public namespace advertises POST feedback. No enquiry, CAPTCHA response or mail test was submitted. Reading an endpoint does not verify delivery.

Sources: https://eoncoatings.com/contact-us/ and https://eoncoatings.com/wp-json/contact-form-7/v1/contact-forms/6101/feedback/schema . Immutable responses are in raw/contact-us.html and raw/cf7-schema.json.

| Label | Wire field | Live rule |
|---|---|---|
| Name | text-239 | Required, maximum 400 |
| Type | radio-86 | Exactly one Residential or Business |
| Company Name | text-216 | Optional, maximum 400, shown for Business |
| Phone Number | tel-22 | Required telephone, 6 to 12 characters |
| Email | email-929 | Required email, maximum 400 |
| Message | textarea-756 | Optional, maximum 2000 |

The published phone placeholder exceeds its own maximum. Do not silently truncate or strip digits. The business landline can be linked as +97125639468, while the source WhatsApp destination is 971025639468 and retains the domestic zero. A normalized WhatsApp destination is not proof this landline has an active WhatsApp account. Owner verification is required before promoting it as a working chat channel.

The source includes a human-selected icon CAPTCHA, a honeypot and conditional-field state. CAPTCHA answer values in raw evidence must never be copied into implementation as verification. Source markup is not a strong independent server anti-bot design, and arbitrary client-supplied hidden fields must not be trusted.

A real server adapter requires:

1. A stable HTTPS WordPress backend that survives replacing the public frontend. Configure the origin and form ID explicitly. Do not point a new production frontend back to its own replaced contact path.
2. A genuine live challenge bootstrap and session store. Issue the challenge to the visitor, preserve the corresponding backend session as required by the actual plugin, accept the visitor answer, atomically consume the session, and let the live backend validate it. Alternatively configure an owner-approved replacement anti-bot provider and matching backend validation. This seam does not implement that provider.
3. Server-side rate limiting, request-origin checks, validation matching the live schema, bounded requests and retained input on failure. Never retry uncertain mail submissions automatically.
4. Confirm the actual CF7 recipient, sender domain, mail transport, anti-bot plugins and delivery logs. These settings are not public. Perform one authorized staging enquiry after configuration and confirm receipt before calling delivery verified.
5. Render success only after the configured backend returns mail_sent. Phrase it as accepted by the mail service; that response alone cannot prove inbox receipt. Surface validation, spam, timeout and mail_failed responses honestly.

cf7-server-adapter.ts is a fail-closed integration seam, not a deployed endpoint. Its injected challenge consumer and limiter still require production implementations. adapter.test.cjs runs only fixtures with injected fetch, no network. Seven tests pass for wire mapping, exact success detection, invalid origin/config, live field bounds, expiry/rate gates, field collision protection, rejection and timeout. The existing workspace email-draft preview does not become a working submitted enquiry by copying this file.

Run the tests with: node --test /private/tmp/eon-life-well-kept/content/adapter.test.cjs . The checked build is in build/. The owner should integrate the TypeScript source into the actual server runtime and test the production wrappers separately.
