import {useState} from "react";
import './ConciergeForm.css'
import { FormControl, FormLabel, Table, Button, Form } from "react-bootstrap";


export default function ConciergeForm({addConcierge}) {
    const [newConcierge, setNewConcierge] = useState({
        type: "",
        name: "",
        price: "",
        trip: "",
        note:"",
        user: "",
    });

    function handleAddConcierge(evt){
        evt.preventDefault();
        addConcierge(newConcierge);
        setNewConcierge({
          type: "",
          name: "",
          price: "",
          trip: "",
          note:"",
          user: "",

        });
    }

    function handleInputChange(evt) {
        const newNewConcierge = {...newConcierge,
          [evt.target.name]: evt.target.value
        };

        setNewConcierge(newNewConcierge);
    }


    return (  <div>
        <Form className="new-concierge"  onSubmit={handleAddConcierge}>
           
             <thead>
                <tr>
                <div className="form-element">
                <th className="form-item">
                    <FormLabel>Type</FormLabel>
                    <FormControl type="text" name="type" value={newConcierge.type} onChange={handleInputChange} required />
                </th>
                </div>
                <div className="form-element" >
                <th className="form-item">
                    <FormLabel>Name</FormLabel>
                    <FormControl type="text" name="name" value={newConcierge.name} onChange={handleInputChange} required />
                </th>
                </div>
                <div className="form-element">

                <th className="form-item">
                    <FormLabel>Price</FormLabel>
                    <FormControl type="text" name="price" value={newConcierge.price} onChange={handleInputChange} required />
                </th>
                </div>
                <div className="form-element">
                <th className="form-item">
                    <FormLabel>Trip</FormLabel>
                    <FormControl type="text" name="trip" value={newConcierge.trip} onChange={handleInputChange} required />
                </th>
                </div>
                <div className="form-element">
               
                <th className="form-item">
                    <FormLabel>Note</FormLabel>
                    <FormControl type="text" name="note" value={newConcierge.note} onChange={handleInputChange} required />
                </th>
                </div>
                <div className="form-element">
                
                <th className="form-item">
                    <FormLabel>User</FormLabel>
                    <FormControl type="text" name="user" value={newConcierge.user} onChange={handleInputChange} required />
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
