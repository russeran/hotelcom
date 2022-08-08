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


    function handleAddComplain(evt) {
        evt.preventDefault();
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

    function handleInputChange(evt) {
        const newNEWComplaint = { ...newComplaint,
            [evt.target.name]: evt.target.value
        };
        
        setNewComplaint(newNEWComplaint);

    }
 
    
    return (
        <form onSubmit={handleAddComplain}>
            <div className="form-container"  id="new-complaint" >
                <h3>NEW GUEST COMPLAINT</h3>
                <div className="form-item">
                    <label>Date</label>
                    <input type="text" name="date" value={newComplaint.date} onChange={handleInputChange} required />
                </div>

                <div className="form-item">
                    <label>Room</label>
                    <input type="text" name="room" value={newComplaint.room} onChange={handleInputChange} required />
                </div>

                <div className="form-item">
                    <label>Name</label>
                    <input type="text" name="name" value={newComplaint.name} onChange={handleInputChange} required />
                </div>

                <div className="form-item">
                    <label>Complaint</label>
                    <input type="text" name="complaint" value={newComplaint.complaint} onChange={handleInputChange} required />
                </div>
                <div className="form-item">
                    <label>Solution</label>
                    <input type="text" name="solution" value={newComplaint.solution} onChange={handleInputChange} required />
                </div>
                <div className="form-item">
                    <label>Status</label>
                    <input type="text" name="status" value={newComplaint.status} onChange={handleInputChange} required />
                </div>

                <div className="form-item">
                    <label>User</label>
                    <input type="text" name="user" value={newComplaint.user} onChange={handleInputChange} required />
                </div>

                <div className="form-item">
                    <button type="submit">ADD</button>
                </div>
            </div>
        </form>
    );


       
}
