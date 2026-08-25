import sendRequest from "./send-request";

const BASE_URL = "/api/messages";

export function getAllMessages() {
    return sendRequest(`${BASE_URL}/index`);
}

export function sendMessage(text) {
    return sendRequest(`${BASE_URL}/create`, "POST", { text });
}
