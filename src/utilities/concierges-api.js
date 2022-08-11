import sendRequest from "./send-request";

const BASE_URL = "/api/concierges";

export function getAllConcierges() {
    return sendRequest(`${BASE_URL}/index`);
}

export function addAConcierge(conciergeForm) {
    return sendRequest(`${BASE_URL}/create`, "POST", conciergeForm);
}