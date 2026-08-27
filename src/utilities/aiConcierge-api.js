import sendRequest from './send-request';

const BASE_PATH = '/api/ai-concierge';

export async function startConversation() {
    return sendRequest(`${BASE_PATH}/start`, 'POST');
}

export async function verifyGuest(sessionId, roomNumber, lastName) {
    return sendRequest(`${BASE_PATH}/verify`, 'POST', { sessionId, roomNumber, lastName });
}

export async function sendMessage(sessionId, message) {
    return sendRequest(`${BASE_PATH}/chat`, 'POST', { sessionId, message });
}

export async function endConversation(sessionId, satisfaction) {
    return sendRequest(`${BASE_PATH}/end`, 'POST', { sessionId, satisfaction });
}

export async function getConversations(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return sendRequest(`${BASE_PATH}/conversations${queryString ? `?${queryString}` : ''}`);
}

export async function getConversation(id) {
    return sendRequest(`${BASE_PATH}/conversations/${id}`);
}

export async function getStats() {
    return sendRequest(`${BASE_PATH}/stats`);
}
