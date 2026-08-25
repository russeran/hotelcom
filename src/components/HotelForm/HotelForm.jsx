import { Row, Col, Form } from "react-bootstrap";

export default function HotelForm({ searchDate, setCheckin_date, setCheckout_date, checkin_date, checkout_date }) {
    return (
        <Row className="g-2 align-items-end">
            <Col md={4}>
                <Form.Label>Check-in</Form.Label>
                <Form.Control
                    value={checkin_date}
                    type="text"
                    placeholder="YYYY-MM-DD"
                    onChange={(e) => setCheckin_date(e.target.value)}
                />
            </Col>
            <Col md={4}>
                <Form.Label>Check-out</Form.Label>
                <Form.Control
                    value={checkout_date}
                    type="text"
                    placeholder="YYYY-MM-DD (press Enter)"
                    onChange={(e) => setCheckout_date(e.target.value)}
                    onKeyPress={searchDate}
                />
            </Col>
        </Row>
    );
}
