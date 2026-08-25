import sendRequest from "./send-request";

const BASE_URL = "/api/messages";

export function getAllMessages(channel) {
    const qs = channel ? `?channel=${encodeURIComponent(channel)}` : '';
    return sendRequest(`${BASE_URL}/index${qs}`);
}

export function sendMessage(text, channel = 'General') {
    return sendRequest(`${BASE_URL}/create`, "POST", { text, channel });
}
