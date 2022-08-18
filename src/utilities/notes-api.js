import sendRequest from "./send-request";

const BASE_URL = "/api/notes";

export function getAllNotes() {
    return sendRequest(`${BASE_URL}/index`);
}

export function addANote(noteForm) {
    return sendRequest(`${BASE_URL}/create`, "POST", noteForm);
}

export function deleteANote(note) {

    return sendRequest(`${BASE_URL}/delete/${note}`, `DELETE`);
}