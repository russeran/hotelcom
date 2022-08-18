import {useState} from "react";
import './ConciergeForm.css'
import { FormControl, FormLabel, Button, Form } from "react-bootstrap";


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


    return (  
    <>
        <Form className="new-concierge"  onSubmit={handleAddConcierge}>
        <span>
                    <FormLabel  className="con-form-items" >Type</FormLabel>
                    <FormControl  className="con-form-items" type="text" name="type" value={newConcierge.type} onChange={handleInputChange} required />
                    <FormLabel className="con-form-items" >Name</FormLabel>
                    <FormControl  className="con-form-items" type="text" name="name" value={newConcierge.name} onChange={handleInputChange} required />
                    <FormLabel className="con-form-items" >Price</FormLabel>
                    <FormControl  className="con-form-items" type="text" name="price" value={newConcierge.price} onChange={handleInputChange} required />
                    <FormLabel className="con-form-items" >Trip</FormLabel>
                    <FormControl  className="con-form-items" type="text" name="trip" value={newConcierge.trip} onChange={handleInputChange} required />
               
                    <FormLabel className="con-form-items" >Note</FormLabel>
                    <FormControl  className="con-form-items" type="text" name="note" value={newConcierge.note} onChange={handleInputChange} required />
                    <FormLabel className="con-form-items" >User</FormLabel>
                    <FormControl className="con-form-items"  type="text" name="user" value={newConcierge.user} onChange={handleInputChange} required />
                    <Button  className="con-form-items comp-button" variant="success" type="submit">ADD</Button>
                    </span>
        </Form>
       
        </>

    );

}
