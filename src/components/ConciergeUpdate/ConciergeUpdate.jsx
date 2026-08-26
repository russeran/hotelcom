import { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

export default function ConciergeUpdate({ concierge, updateConcierge, onClose }) {
    const [form, setForm] = useState({
        type: concierge.type || "",
        name: concierge.name || "",
        price: concierge.price ?? "",
        trip: concierge.trip || "",
        note: concierge.note || "",
        address: concierge.address || "",
        phone: concierge.phone || "",
        url: concierge.url || "",
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        updateConcierge(concierge._id, form);
        if (onClose) onClose();
    }

    return (
        <Form onSubmit={handleSubmit} className="concierge-update">
            <Row className="g-2">
                <Col xs={6}>
                    <Form.Label>Type</Form.Label>
                    <Form.Control name="type" value={form.type} onChange={handleChange} />
                </Col>
                <Col xs={6}>
                    <Form.Label>Price</Form.Label>
                    <Form.Control name="price" value={form.price} onChange={handleChange} />
                </Col>
                <Col xs={12}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control name="name" value={form.name} onChange={handleChange} />
                </Col>
                <Col xs={12}>
                    <Form.Label>Trip</Form.Label>
                    <Form.Control name="trip" value={form.trip} onChange={handleChange} />
                </Col>
                <Col xs={12}>
                    <Form.Label>Address</Form.Label>
                    <Form.Control name="address" value={form.address} onChange={handleChange} />
                </Col>
                <Col xs={6}>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control name="phone" value={form.phone} onChange={handleChange} />
                </Col>
                <Col xs={6}>
                    <Form.Label>Website</Form.Label>
                    <Form.Control name="url" value={form.url} onChange={handleChange} />
                </Col>
                <Col xs={12}>
                    <Form.Label>Note</Form.Label>
                    <Form.Control name="note" value={form.note} onChange={handleChange} />
                </Col>
            </Row>
            <div className="d-flex gap-2 mt-3">
                <Button size="sm" variant="primary" type="submit">Save</Button>
                {onClose && <Button size="sm" variant="outline-secondary" type="button" onClick={onClose}>Cancel</Button>}
            </div>
        </Form>
    );
}
