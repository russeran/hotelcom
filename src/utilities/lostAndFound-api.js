import sendRequest from './send-request';

const BASE_URL = '/api/lost-and-found';

export function getAllItems() {
    return sendRequest(`${BASE_URL}/index`);
}

export function getItemsByStatus(status) {
    return sendRequest(`${BASE_URL}/index?status=${status}`);
}

export function getItem(id) {
    return sendRequest(`${BASE_URL}/${id}`);
}

export function createItem(itemData) {
    return sendRequest(`${BASE_URL}/create`, 'POST', itemData);
}

export function updateItem(id, updates) {
    return sendRequest(`${BASE_URL}/${id}`, 'PUT', updates);
}

export function deleteItem(id) {
    return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}

export function claimItem(id, claimData) {
    return sendRequest(`${BASE_URL}/${id}/claim`, 'POST', claimData);
}
