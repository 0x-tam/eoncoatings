# Enquiry delivery

The preview provides a validated email-draft journey with the original visible fields, conditional optional company field, phone/email links, and a link to EON's existing protected form. Preparing a draft does not send anything. The visitor reviews and sends through their email application. No live enquiry was submitted during development.

The original Contact Form 7 form is 6101, observed version 6.1.7. Visible fields: text-239, radio-86, text-216, tel-22, email-929, textarea-756. It uses an icon CAPTCHA and kc_honeypot. A copied hidden challenge is not a supported integration. Raw form markup and the discovery record are in evidence/source.

## Owner setup before replacing the live domain

Keep WordPress on a separate stable HTTPS backend origin. Set EON_FORM_BACKEND_ORIGIN and EON_FRONTEND_ORIGIN server-side in the eventual form endpoint configuration. Preserve CF7, the mail recipient/SMTP, its conditional-field plugin, CAPTCHA and honeypot. Integrate the live challenge using its supported flow, validate required fields against the actual backend, and add hosting-supported rate limiting. Confirm the phone-field length mismatch before release. The existing original-form link must then point to the stable backend, not to the replaced frontend domain.

lib/eon/cf7-adapter.ts is a typed integration seam, not a deployed mail endpoint. It refuses a same-origin backend loop, requires live verification input, times out, and recognizes only mail_sent as confirmed delivery. Fixture tests cover validation, spam, failed/unknown status, HTTP failure, missing challenge and timeout. These tests never contact EON and do not prove real delivery.

Remaining dependency: owner-authorised staging recipient and backend/anti-bot configuration. Until that is available, direct delivery from the redesigned form is unverified. The private design preview is usable through the email and phone alternatives.

WhatsApp's original public URL retains the domestic zero after the country code. Account availability could not be verified without messaging, so the preview uses confirmed phone and email paths instead. The displayed phone is preserved; tel:+97125639468 follows UAE international numbering.
