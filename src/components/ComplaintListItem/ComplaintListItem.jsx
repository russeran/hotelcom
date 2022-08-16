import "./ComplaintListItems.css";
import { Card, ListGroup, Button } from "react-bootstrap";


export default function ComplaintListItem({ complaint, handleDelete, updateComplaint }) {
   
  

    return (

 <>


<Card className="card" style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{complaint.date}</Card.Title>
        <Card.Title variant="info"  >{complaint.room}-{complaint.name}</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item className="card-labels" >ISSUE</ListGroup.Item>
      <ListGroup.Item className="content">{complaint.issue}</ListGroup.Item>
      <ListGroup.Item className="card-labels"  >SOLUTION</ListGroup.Item>
        <ListGroup.Item className="content" >{complaint.solution}</ListGroup.Item>
        <ListGroup.Item className="card-labels"  >STATUS</ListGroup.Item>
        <ListGroup.Item>{complaint.status}</ListGroup.Item>
       
        
      </ListGroup>
      <Card.Body>
        <ListGroup.Item>{complaint.user}</ListGroup.Item>
      <Button  variant="danger"  onClick={()=> handleDelete(complaint._id)} >DELETE</Button>
      </Card.Body>
    </Card>

 
    
    </>
    );
}