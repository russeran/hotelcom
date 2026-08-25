import { useState } from "react";
import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";

export default function ComplaintUpdate({ complaint, updateComplaint, onClose }) {
    const [updateComplaints, setUpdateComplaint] = useState({
        date: complaint.date || "",
        room: complaint.room || "",
        name: complaint.name || "",
        issue: complaint.issue || "",
        solution: complaint.solution || "",
        status: complaint.status || "",
        user: complaint.user || ""

    });

    function handleSubmit(e) {
        e.preventDefault();
        updateComplaint(complaint._id, updateComplaints);
        if (onClose) onClose();
    }

    function handleChange(e) {
        const newUpdateComplaint = { ...updateComplaints,
            [e.target.name]: e.target.value

        };

        setUpdateComplaint(newUpdateComplaint);

    }

    return (
        <div className="complaint-update">
         <Form onSubmit={handleSubmit}>
             <Form.Group controlId="formComplaintRoom">
                 <Form.Label>Room</Form.Label>
                 <Form.Control type="text" name="room" value={updateComplaints.room} onChange={handleChange} />
             </Form.Group>
             <Form.Group controlId="formComplaintName">
                 <Form.Label>Name</Form.Label>
                 <Form.Control type="text" name="name" value={updateComplaints.name} onChange={handleChange} />
             </Form.Group>
             <Form.Group controlId="formComplaintIssue">
                 <Form.Label>Issue</Form.Label>
                 <Form.Control type="text" name="issue" value={updateComplaints.issue} onChange={handleChange} />
             </Form.Group>
             <Form.Group controlId="formComplaintSolution">
                 <Form.Label>Solution</Form.Label>
                 <Form.Control type="text" name="solution" value={updateComplaints.solution} onChange={handleChange} />
             </Form.Group>
             <Form.Group controlId="formComplaintStatus">
                 <Form.Label>Status</Form.Label>
                 <Form.Control type="text" name="status" value={updateComplaints.status} onChange={handleChange} />
             </Form.Group>
             <Form.Group controlId="formComplaintUser">
                 <Form.Label>User</Form.Label>
                 <Form.Control type="text" name="user" value={updateComplaints.user} onChange={handleChange} />
             </Form.Group>
             <br />
             <Button variant="primary" type="submit">
                 Save
             </Button>
             {onClose && (
                 <>
                     {' '}
                     <Button variant="outline-secondary" type="button" onClick={onClose}>
                         Cancel
                     </Button>
                 </>
             )}
         </Form>
        </div>
    );
}
