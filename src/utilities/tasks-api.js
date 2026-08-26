import sendRequest from "./send-request";

const BASE_URL = "/api/tasks";

export function getAllTasks() {
    return sendRequest(`${BASE_URL}/index`);
}

export function addATask(taskForm) {
    return sendRequest(`${BASE_URL}/create`, "POST", taskForm);
}

export function updateATask(taskId, updatedTask) {
    return sendRequest(`${BASE_URL}/${taskId}`, "PUT", updatedTask);
}

export function acknowledgeATask(taskId) {
    return sendRequest(`${BASE_URL}/${taskId}/acknowledge`, "PUT");
}

export function deleteATask(taskId) {
    return sendRequest(`${BASE_URL}/delete/${taskId}`, "DELETE");
}
