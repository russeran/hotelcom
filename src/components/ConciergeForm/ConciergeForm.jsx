import {useState} from "react";
import './ConciergeForm.css'


export default function ConciergeForm({addConcierge}) {
    const [newConcierge, setNewConcierge] = useState({
        name: "",
        type: "",
        price: "",
        distance: "",
        note:"",
        user: "",
    });

    function handleAddConcierge(evt){
        evt.preventDefault();
        addConcierge(newConcierge);
        setNewConcierge({
          name: "",
          type: "",
          price: "",
          distance: "",
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
        <form onSubmit={handleAddConcierge}>
            <div className='form-container' id='new-concierge' >
<h3>ADD NEW ITEM</h3>
<div className='form-item' >
    <label>Type</label>
    <input type="text" name='type' value={newConcierge.type} onChange={handleInputChange} required />
</div>
<div className='form-item' >
    <label>Name</label>
    <input type="text" name='name' value={newConcierge.name} onChange={handleInputChange} required />
</div>
<div className='form-item' >
    <label>Price</label>
    <input type="text" name='price' value={newConcierge.price} onChange={handleInputChange} required />
</div>
<div className='form-item' >
    <label>Distance</label>
    <input type="text" name='distance' value={newConcierge.distance} onChange={handleInputChange} required />
</div>
<div className='form-item' >
    <label>Note</label>
    <input type="text" name='note' value={newConcierge.note} onChange={handleInputChange} required />
</div>
<div className='form-item' >
    <label>User</label>
    <input type="text" name='user' value={newConcierge.user} onChange={handleInputChange} required />
</div>
<div className="form-item">
                    <button type="submit">ADD</button>
                </div>

            </div>

        </form>

    );

}
