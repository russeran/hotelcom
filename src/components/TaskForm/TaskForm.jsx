import './TaskForm.css';
import { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

const BLANK = { status: 'Open', department: '', room: '', user: '', task: '' };

export default function TaskForm({ addTask }) {
    const [newTask, setNewTask] = useState(BLANK);

    function handleAddTask(e) {
        e.preventDefault();
        addTask(newTask);
        setNewTask(BLANK);
    }

    function handleInputChange(e) {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    }

    return (
        <Form onSubmit={handleAddTask} className="task-form">
            <Row className="g-2 align-items-end">
                <Col md={2}>
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" value={newTask.status} onChange={handleInputChange}>
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Done</option>
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Form.Label>Department</Form.Label>
                    <Form.Control type="text" name="department" placeholder="Housekeeping" value={newTask.department} onChange={handleInputChange} required />
                </Col>
                <Col md={1}>
                    <Form.Label>Room</Form.Label>
                    <Form.Control type="text" name="room" placeholder="101" value={newTask.room} onChange={handleInputChange} />
                </Col>
                <Col md={2}>
                    <Form.Label>Assignee</Form.Label>
                    <Form.Control type="text" name="user" placeholder="Name" value={newTask.user} onChange={handleInputChange} required />
                </Col>
                <Col md={3}>
                    <Form.Label>Task</Form.Label>
                    <Form.Control type="text" name="task" placeholder="Describe the task" value={newTask.task} onChange={handleInputChange} required />
                </Col>
                <Col md={2}>
                    <Button type="submit" variant="primary" className="w-100">Add Task</Button>
                </Col>
            </Row>
        </Form>
    );
}
