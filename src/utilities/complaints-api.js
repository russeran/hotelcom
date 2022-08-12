import sendRequest from "./send-request";

const BASE_URL = "/api/complaints";

export function getAllComplaints() {
    return sendRequest(`${BASE_URL}/index`);
}
export function addAComplaint(complaintForm) {
    console.log(complaintForm)
    return sendRequest(`${BASE_URL}/create`, "POST", complaintForm);
}

export function deleteAComplaint(complaint) {

    return sendRequest(`${BASE_URL}/delete/${complaint}`, "DELETE");
}

export function updateAComplaint(complaint) {
    return sendRequest(`${BASE_URL}/update/${complaint}`, "PATCH");
}