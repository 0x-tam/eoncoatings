"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnquiry = validateEnquiry;
exports.parseResponse = parseResponse;
exports.createCF7ServerAdapter = createCF7ServerAdapter;
const fieldMap = { name: 'text-239', type: 'radio-86', company: 'text-216', phone: 'tel-22', email: 'email-929', message: 'textarea-756' };
const message = (kind, text) => ({ kind, message: text });
function validateEnquiry(input) {
    const bad = [];
    if (typeof input.name !== 'string' || !input.name.trim() || input.name.length > 400)
        bad.push('name');
    if (input.type !== 'Residential' && input.type !== 'Business')
        bad.push('type');
    if (input.company !== undefined && (typeof input.company !== 'string' || input.company.length > 400))
        bad.push('company');
    if (typeof input.phone !== 'string' || input.phone.length < 6 || input.phone.length > 12 || !/[0-9]/.test(input.phone) || !/^[+0-9(). -]+$/.test(input.phone))
        bad.push('phone');
    if (typeof input.email !== 'string' || input.email.length > 400 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))
        bad.push('email');
    if (input.message !== undefined && (typeof input.message !== 'string' || input.message.length > 2000))
        bad.push('message');
    return bad;
}
function parseResponse(body) {
    if (!body || typeof body !== 'object')
        return message('failed', 'Delivery was not confirmed. Your details have been preserved.');
    const r = body;
    if (r.status === 'mail_sent')
        return message('sent', 'Your enquiry was accepted by the mail service.');
    if (r.status === 'validation_failed') {
        const fields = Array.isArray(r.invalid_fields) ? r.invalid_fields.flatMap(f => f && typeof f.field === 'string' ? [f.field] : []) : [];
        return { kind: 'invalid', message: 'Please check the highlighted fields. Your details have been preserved.', fields };
    }
    if (r.status === 'spam' || r.status === 'aborted')
        return message('rejected', 'The enquiry could not be verified. Please retry or contact EON directly.');
    return message('failed', 'Delivery was not confirmed. Your details have been preserved.');
}
function createCF7ServerAdapter(config, deps) {
    let backend = null, frontend = null;
    try {
        backend = new URL(config.backendOrigin);
        frontend = new URL(config.frontendOrigin);
    }
    catch { /* Unconfigured adapter fails closed. */ }
    const configured = backend?.protocol === 'https:' && frontend?.protocol === 'https:' && backend.origin !== frontend.origin && backend.pathname === '/' && !backend.search && !backend.hash && !backend.username && !backend.password && Number.isInteger(config.formId) && config.formId > 0;
    return async function submit(input, context) {
        if (!configured || !backend || !frontend)
            return message('unavailable', 'The online enquiry service requires owner configuration. Phone and email remain available.');
        if (context.origin !== frontend.origin)
            return message('rejected', 'This enquiry origin is not allowed.');
        const fields = validateEnquiry(input);
        if (fields.length)
            return { kind: 'invalid', fields, message: 'Please check the fields. The current form requires a phone number of 6 to 12 characters.' };
        if (!context.challengeSessionId || !context.challengeAnswer)
            return message('invalid', 'Please complete the live human-verification challenge.');
        try {
            if (!await deps.allowRequest(context.clientKey))
                return message('rejected', 'Please wait before trying again. Your details have been preserved.');
            const challenge = await deps.consumeChallenge(context.challengeSessionId, context.challengeAnswer);
            if (!challenge)
                return message('invalid', 'The live verification has expired. Refresh it and retry.');
            const payload = new FormData();
            for (const [key, value] of Object.entries(challenge.formFields)) {
                if (Object.values(fieldMap).includes(key))
                    return message('failed', 'The challenge configuration could not be verified.');
                payload.set(key, value);
            }
            // Form identity must match the server configuration and the genuine issued challenge.
            if (payload.get('_wpcf7') !== String(config.formId) || !payload.get('_wpcf7_unit_tag'))
                return message('failed', 'The challenge configuration could not be verified.');
            for (const [key, field] of Object.entries(fieldMap))
                payload.set(field, String(input[key] || ''));
            const controller = new AbortController(), timer = setTimeout(() => controller.abort(), config.timeoutMs ?? 12000);
            try {
                const response = await deps.fetcher(new URL(`/wp-json/contact-form-7/v1/contact-forms/${config.formId}/feedback`, backend), { method: 'POST', body: payload, redirect: 'error', signal: controller.signal, headers: challenge.cookieHeader ? { Cookie: challenge.cookieHeader } : undefined });
                if (!response.ok)
                    return message('failed', 'Delivery was not confirmed. Your details have been preserved.');
                return parseResponse(await response.json());
            }
            catch {
                return message(controller.signal.aborted ? 'timeout' : 'failed', 'Delivery was not confirmed. Your details have been preserved.');
            }
            finally {
                clearTimeout(timer);
            }
        }
        catch {
            return message('failed', 'The enquiry service is unavailable. Your details have been preserved.');
        }
    };
}
