import { useState } from "react";
import './ConciergeForm.css'
import { Row, Col, Form, Button } from "react-bootstrap";

const BLANK = { type: "", name: "", price: "", trip: "", note: "", address: "", phone: "", url: "" };

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
            <Row className="g-2">
                <Col md={2}>
                    <Form.Label>Type</Form.Label>
                    <Form.Control type="text" name="type" placeholder="Tour, Dining…" value={newConcierge.type} onChange={handleInputChange} required />
                </Col>
                <Col md={4}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Griffith Observatory" value={newConcierge.name} onChange={handleInputChange} required />
                </Col>
                <Col md={2}>
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="text" name="price" placeholder="$" value={newConcierge.price} onChange={handleInputChange} />
                </Col>
                <Col md={4}>
                    <Form.Label>Trip</Form.Label>
                    <Form.Control type="text" name="trip" placeholder="Distance / time" value={newConcierge.trip} onChange={handleInputChange} />
                </Col>
            </Row>
            <Row className="g-2 mt-1">
                <Col md={3}>
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" name="address" placeholder="2800 E Observatory Rd" value={newConcierge.address} onChange={handleInputChange} />
                </Col>
                <Col md={2}>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" name="phone" placeholder="(213) 473-0800" value={newConcierge.phone} onChange={handleInputChange} />
                </Col>
                <Col md={4}>
                    <Form.Label>Website</Form.Label>
                    <Form.Control type="text" name="url" placeholder="https://…" value={newConcierge.url} onChange={handleInputChange} />
                </Col>
                <Col md={3}>
                    <Form.Label>Note</Form.Label>
                    <Form.Control type="text" name="note" placeholder="Insider tip" value={newConcierge.note} onChange={handleInputChange} />
                </Col>
            </Row>
            <div className="d-flex justify-content-end mt-3">
                <Button variant="primary" type="submit">Add Recommendation</Button>
            </div>
        </Form>
    );
}
