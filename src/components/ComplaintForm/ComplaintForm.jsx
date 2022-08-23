import { useState } from "react";

import "./ComplaintForm.css"
import Form from "react-bootstrap/Form";
import { FormControl, FormLabel, Table, Button } from "react-bootstrap";



export default function ComplaintForm({ addComplaint }) {
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

        

    function handleFormControlChange(e) {
        const newNEWComplaint = { ...newComplaint,
            [e.target.name]: e.target.value
        };
        
        setNewComplaint(newNEWComplaint);

    }

  

 
    
    return (
        <div>
        <Form className="new-complaint"  onSubmit={handleAddComplaint}>
           
             <thead>
                <tr>
                <div className="form-element">
                <th className="form-item">
                    <FormLabel>Date</FormLabel>
                    <FormControl type="datetime-local" name="date" value={newComplaint.date} onChange={handleFormControlChange} required />
                </th>
                </div>
                <div className="form-element" >
                <th className="form-item">
                    <FormLabel>Room</FormLabel>
                    <FormControl type="number" name="room" value={newComplaint.room} onChange={handleFormControlChange} required />
                </th>
                </div>
                <div className="form-element">

                <th className="form-item">
                    <FormLabel>Name</FormLabel>
                    <FormControl type="text" name="name" value={newComplaint.name} onChange={handleFormControlChange} required />
                </th>
                </div>
                <div className="form-element">
                <th className="form-item">
                    <FormLabel>Issue</FormLabel>
                    <FormControl type="text" name="issue" value={newComplaint.issue} onChange={handleFormControlChange} required />
                </th>
                </div>
                <div className="form-element">
               
                <th className="form-item">
                    <FormLabel>Solution</FormLabel>
                    <FormControl type="text" name="solution" value={newComplaint.solution} onChange={handleFormControlChange} required />
                </th>
                </div>
                <div className="form-element">
                <th className="form-item">
                    <FormLabel>Status</FormLabel>
                    <FormControl type="text" name="status" value={newComplaint.status} onChange={handleFormControlChange} required />
                </th>
                </div>
                <div className="form-element">
                
                <th className="form-item">
                    <FormLabel>User</FormLabel>
                    <FormControl type="text" name="user" value={newComplaint.user} onChange={handleFormControlChange} required />
                </th>
                </div>
                <br />
                <div className="form-element">
                <th className="form-item">
                    <Button className="comp-button" variant="success" type="submit">ADD</Button>
                </th>
                </div>
                </tr>
                
                </thead>
                
            
        </Form>
       
        </div>
    );


       
}
