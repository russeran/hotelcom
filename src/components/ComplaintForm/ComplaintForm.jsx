import { useState } from "react";

import "./ComplaintForm.css"
import Form from "react-bootstrap/Form";
import { FormControl, FormLabel, Table, Button } from "react-bootstrap";



export default function ComplaintForm({ addComplaint, deleteComplaint, complaint, updateComplaint }) {
    const [newComplaint, setNewComplaint] = useState({
        date: "",
        room: "",
        name: "",
        issue: "",
        solution: "",
        status: "",
        user: ""

    });


    function handleAddComplaint(e) {
        e.preventDefault();
        addComplaint(newComplaint);
        setNewComplaint({
            date: "",
            room: "",
            name: "",
            issue: "",
            solution: "",
            status: "",
            user: ""
        });
    }

  function handleUpdateComplaint(e) {
        e.preventDefault();
        updateComplaint(newComplaint);
        setNewComplaint({
            date: "",
            room: "",
            name: "",
            issue: "",
            solution: "",
            status: "",
            user: ""
        });
    }
        

    function handleFormControlChange(e) {
        const newNEWComplaint = { ...newComplaint,
            [e.target.name]: e.target.value
        };
        
        setNewComplaint(newNEWComplaint);

    }

  

 
    
    return (
        <div>
        <Form onSubmit={handleAddComplaint}>
            <Table striped hover id="new-complaint" >
             <thead>
                <tr>
                <th className="form-item">
                    <FormLabel>Date</FormLabel>
                    <FormControl type="text" name="date" value={newComplaint.date} onChange={handleFormControlChange} required />
                </th>

                <th className="form-item">
                    <FormLabel>Room</FormLabel>
                    <FormControl type="number" name="room" value={newComplaint.room} onChange={handleFormControlChange} required />
                </th>

                <th className="form-item">
                    <FormLabel>Name</FormLabel>
                    <FormControl type="text" name="name" value={newComplaint.name} onChange={handleFormControlChange} required />
                </th>
               
                <th className="form-item">
                    <FormLabel>Issue</FormLabel>
                    <FormControl type="text" name="issue" value={newComplaint.issue} onChange={handleFormControlChange} required />
                </th>
               
                <th className="form-item">
                    <FormLabel>Solution</FormLabel>
                    <FormControl type="text" name="solution" value={newComplaint.solution} onChange={handleFormControlChange} required />
                </th>
                <th className="form-item">
                    <FormLabel>Status</FormLabel>
                    <FormControl type="text" name="status" value={newComplaint.status} onChange={handleFormControlChange} required />
                </th>
                
                <th className="form-item">
                    <FormLabel>User</FormLabel>
                    <FormControl type="text" name="user" value={newComplaint.user} onChange={handleFormControlChange} required />
                </th>
            
                <th className="form-item">
                    <Button variant="success" type="submit">ADD</Button>
                </th>
                </tr>
                
                </thead>
                
            </Table>
            
        </Form>
       
        </div>
    );


       
}
