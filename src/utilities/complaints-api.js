import sendRequest from "./send-request";

const BASE_URL = "/api/complaints";

export function getAllComplaints() {
    return sendRequest(`${BASE_URL}/index`);
}
export function addAComplaint(complaintForm) {
    console.log(complaintForm)
    return sendRequest(`${BASE_URL}/create`, { method: "POST" }, complaintForm);
}