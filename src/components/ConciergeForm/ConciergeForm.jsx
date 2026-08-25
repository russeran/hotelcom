import { useState } from "react";
import './ConciergeForm.css'
import { Row, Col, Form, Button } from "react-bootstrap";

const BLANK = { type: "", name: "", price: "", trip: "", note: "", user: "" };

export default function ConciergeForm({ addConcierge }) {
    const [newConcierge, setNewConcierge] = useState(BLANK);

    function handleAddConcierge(evt) {
        evt.preventDefault();
        addConcierge(newConcierge);
        setNewConcierge(BLANK);
    }

    function handleInputChange(evt) {
        setNewConcierge({ ...newConcierge, [evt.target.name]: evt.target.value });
    }

    return (
        <Form className="concierge-form" onSubmit={handleAddConcierge}>
            <Row className="g-2 align-items-end">
                <Col md={2}>
                    <Form.Label>Type</Form.Label>
                    <Form.Control type="text" name="type" placeholder="Tour, Dining…" value={newConcierge.type} onChange={handleInputChange} required />
                </Col>
                <Col md={3}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Griffith Observatory" value={newConcierge.name} onChange={handleInputChange} required />
                </Col>
                <Col md={1}>
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="text" name="price" placeholder="$" value={newConcierge.price} onChange={handleInputChange} />
                </Col>
                <Col md={2}>
                    <Form.Label>Trip</Form.Label>
                    <Form.Control type="text" name="trip" placeholder="Distance / time" value={newConcierge.trip} onChange={handleInputChange} />
                </Col>
                <Col md={2}>
                    <Form.Label>Note</Form.Label>
                    <Form.Control type="text" name="note" placeholder="Tip" value={newConcierge.note} onChange={handleInputChange} />
                </Col>
                <Col md={2}>
                    <Button className="w-100" variant="primary" type="submit">Add</Button>
                </Col>
            </Row>
        </Form>
    );
}
