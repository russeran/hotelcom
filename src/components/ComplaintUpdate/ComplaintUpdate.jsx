import { useState } from "react";
import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";

export default function ComplaintUpdate({ complaint, updateComplaint }) {
    const [updateComplaints, setUpdateComplaint] = useState({
        date: "",
        room: "",
        name: "",
        issue: "",
        solution: "",
        status: "",
        user: ""

    });

    function handleSubmit(e) {
        e.preventDefault();
        updateComplaint(complaint._id, updateComplaints);
        setUpdateComplaint({
            date: "",
            room: "",
            name: "",
            issue: "",
            solution: "",
            status: "",
            user: ""
        });
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
             <Form.Group controlId="formComplaintDate">
                 <Form.Label>Date</Form.Label>
                 <Form.Control type="text" name="date" value={updateComplaints.date} onChange={handleChange} />
             </Form.Group>
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
             <Button variant="primary" type="submit">
                 Update
             </Button>
         </Form>
        </div>
    );
}