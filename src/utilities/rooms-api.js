import sendRequest from "./send-request";

const BASE_URL = "/api/rooms";

export const ROOM_STATUSES = ['Vacant Clean', 'Vacant Dirty', 'Occupied', 'Inspected', 'Out of Order'];

export function getAllRooms() {
    return sendRequest(BASE_URL);
}

export function addRoom(room) {
    return sendRequest(BASE_URL, "POST", room);
}

export function updateRoom(roomId, updates) {
    return sendRequest(`${BASE_URL}/${roomId}`, "PUT", updates);
}

export function deleteRoom(roomId) {
    return sendRequest(`${BASE_URL}/${roomId}`, "DELETE");
}
