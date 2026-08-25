import "./NoteForm.css";
import { useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';

const BLANK = { user: '', note: '' };

export default function NoteForm({ addNote }) {
    const [newNote, setNewNote] = useState(BLANK);

    function handleAddNote(e) {
        e.preventDefault();
        addNote(newNote);
        setNewNote(BLANK);
    }

    function handleInputChange(e) {
        setNewNote({ ...newNote, [e.target.name]: e.target.value });
    }

    return (
        <Form onSubmit={handleAddNote} className="note-form">
            <Row className="g-2 align-items-end">
                <Col md={3}>
                    <Form.Label>Author</Form.Label>
                    <Form.Control type="text" name="user" placeholder="Your name" value={newNote.user} onChange={handleInputChange} required />
                </Col>
                <Col md={7}>
                    <Form.Label>Note</Form.Label>
                    <Form.Control type="text" name="note" placeholder="What should the next shift know?" value={newNote.note} onChange={handleInputChange} required />
                </Col>
                <Col md={2}>
                    <Button type="submit" variant="primary" className="w-100">Add Note</Button>
                </Col>
            </Row>
        </Form>
    );
}
