import sendRequest from "./send-request";

const BASE_URL = "/api/notifications";

export function getAllNotifications() {
    return sendRequest(`${BASE_URL}/index`);
}

export function markNotificationRead(notificationId) {
    return sendRequest(`${BASE_URL}/${notificationId}/read`, "PUT");
}

export function deleteNotification(notificationId) {
    return sendRequest(`${BASE_URL}/delete/${notificationId}`, "DELETE");
}
