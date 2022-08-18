import { Card, ListGroup, Button } from "react-bootstrap";

import "./ConciergeListItem.css"

export default function ConciergeListItem({concierge, handleDelete}){

return (

<>

<Card className="con-card" style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{concierge.type}</Card.Title>
        <Card.Title variant="info"  >{concierge.name}-{concierge.price}</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item className="card-labels" >TRIP</ListGroup.Item>
      <ListGroup.Item className="con-trip">{concierge.trip}</ListGroup.Item>
      <ListGroup.Item className="card-labels"  >NOTE</ListGroup.Item>
        <ListGroup.Item className="con-content" >{concierge.note}</ListGroup.Item>
      
      </ListGroup>
      <Card.Body>
        <ListGroup.Item>{concierge.user}</ListGroup.Item>
      <Button  variant="danger"  onClick={()=> handleDelete(concierge._id)} >DELETE</Button>
      </Card.Body>
    
    </Card>

 
    
    </>
    );




}