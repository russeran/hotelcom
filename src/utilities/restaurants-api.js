import sendRequest from './send-request';

const BASE_URL = '/api/restaurants';

export function getAllRestaurants() {
    return sendRequest(`${BASE_URL}/index`);
}

export function getRestaurant(id) {
    return sendRequest(`${BASE_URL}/${id}`);
}

export function createRestaurant(restaurantData) {
    return sendRequest(`${BASE_URL}/create`, 'POST', restaurantData);
}

export function updateRestaurant(id, updates) {
    return sendRequest(`${BASE_URL}/${id}`, 'PUT', updates);
}

export function deleteRestaurant(id) {
    return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}

export function addTable(restaurantId, tableData) {
    return sendRequest(`${BASE_URL}/${restaurantId}/tables`, 'POST', tableData);
}

export function removeTable(restaurantId, tableId) {
    return sendRequest(`${BASE_URL}/${restaurantId}/tables/${tableId}`, 'DELETE');
}
