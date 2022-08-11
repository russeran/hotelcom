import { useState } from "react";
import "./ComplaintForm.css"



export default function ComplaintForm({ addComplaint}) {
    const [newComplaint, setNewComplaint] = useState({
        date: "",
        room: "",
        name: "",
        complaint: "",
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
            complaint: "",
            solution: "",
            status: "",
            user: ""
        });
    }

    function handleInputChange(e) {
        const newNEWComplaint = { ...newComplaint,
            [e.target.name]: e.target.value
        };
        
        setNewComplaint(newNEWComplaint);

    }
 
    
    return (
        <form onSubmit={handleAddComplaint}>
            <table id="new-complaint" >
             <thead>
                <tr>
                <th className="form-item">
                    <label>Date</label>
                    <input type="text" name="date" value={newComplaint.date} onChange={handleInputChange} required />
                </th>

                <th className="form-item">
                    <label>Room</label>
                    <input type="number" name="room" value={newComplaint.room} onChange={handleInputChange} required />
                </th>

                <th className="form-item">
                    <label>Name</label>
                    <input type="text" name="name" value={newComplaint.name} onChange={handleInputChange} required />
                </th>

                <th className="form-item">
                    <label>Complaint</label>
                    <input type="text" name="complaint" value={newComplaint.complaint} onChange={handleInputChange} required />
                </th>
                <th className="form-item">
                    <label>Solution</label>
                    <input type="text" name="solution" value={newComplaint.solution} onChange={handleInputChange} required />
                </th>
                <th className="form-item">
                    <label>Status</label>
                    <input type="text" name="status" value={newComplaint.status} onChange={handleInputChange} required />
                </th>

                <th className="form-item">
                    <label>User</label>
                    <input type="text" name="user" value={newComplaint.user} onChange={handleInputChange} required />
                </th>
            
                <th className="form-item">
                    <button type="submit">ADD</button>
                </th>
                </tr>
                </thead>
            </table>
        </form>
    );


       
}
