import sendRequest from "./send-request";

const BASE_URL = "/api/complaints";

export async function addComplaint(complaintData) {
    return sendRequest(BASE_URL, "POST", complaintData);
}