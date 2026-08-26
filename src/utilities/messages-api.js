import sendRequest from "./send-request";

const BASE_URL = "/api/messages";

export function getAllMessages(channel, opts = {}) {
    const params = new URLSearchParams();
    if (channel) params.set('channel', channel);
    if (opts.before) params.set('before', opts.before);
    if (opts.limit) params.set('limit', opts.limit);
    const qs = params.toString();
    return sendRequest(`${BASE_URL}/index${qs ? `?${qs}` : ''}`);
}

export function getChannelSummary() {
    return sendRequest(`${BASE_URL}/channels`);
}

export function sendMessage(text, channel = 'General') {
    return sendRequest(`${BASE_URL}/create`, "POST", { text, channel });
}
