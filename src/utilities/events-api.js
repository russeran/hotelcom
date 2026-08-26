import sendRequest from "./send-request";

const BASE_URL = "/api/events";

export function getNearbyEvents() {
    return sendRequest(BASE_URL);
}
