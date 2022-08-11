import sendRequest from "./send-request";

const BASE_URL = "/api/tasks";

export function getAllTasks() {
    return sendRequest(`${BASE_URL}/index`);
}

export function addATask(taskForm) {
    return sendRequest(`${BASE_URL}/create`, "POST", taskForm);
}