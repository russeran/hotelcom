import { useState } from "react";
import "./ComplaintForm.css"
import { Row, Col, Form, Button } from "react-bootstrap";

const BLANK = { room: "", name: "", issue: "", solution: "", status: "Open", department: "Front Desk" };
const DEPARTMENTS = ['Front Desk', 'Housekeeping', 'Maintenance', 'Food & Beverage', 'Security', 'Concierge'];

export default function ComplaintForm({ addComplaint }) {
    const [newComplaint, setNewComplaint] = useState(BLANK);

    function handleAddComplaint(e) {
        e.preventDefault();
        addComplaint(newComplaint);
        setNewComplaint(BLANK);
    }

    function handleChange(e) {
        setNewComplaint({ ...newComplaint, [e.target.name]: e.target.value });
    }

    return (
        <Form className="complaint-form" onSubmit={handleAddComplaint}>
            <Row className="g-2">
                <Col md={2}>
                    <Form.Label>Room</Form.Label>
                    <Form.Control type="number" name="room" placeholder="205" value={newComplaint.room} onChange={handleChange} required />
                </Col>
                <Col md={3}>
                    <Form.Label>Guest</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Guest name" value={newComplaint.name} onChange={handleChange} required />
                </Col>
                <Col md={4}>
                    <Form.Label>Issue</Form.Label>
                    <Form.Control type="text" name="issue" placeholder="Describe the issue" value={newComplaint.issue} onChange={handleChange} required />
                </Col>
                <Col md={3}>
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" value={newComplaint.status} onChange={handleChange}>
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                    </Form.Select>
                </Col>
            </Row>
            <Row className="g-2 mt-1 align-items-end">
                <Col md={5}>
                    <Form.Label>Solution</Form.Label>
                    <Form.Control type="text" name="solution" placeholder="Optional" value={newComplaint.solution} onChange={handleChange} />
                </Col>
                <Col md={4}>
                    <Form.Label>Handling department</Form.Label>
                    <Form.Select name="department" value={newComplaint.department} onChange={handleChange}>
                        {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Button className="w-100" variant="primary" type="submit">Log Complaint</Button>
                </Col>
            </Row>
        </Form>
    );
}
