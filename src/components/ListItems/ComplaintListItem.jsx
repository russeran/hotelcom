import "./ListItems.css";

export default function ComplaintListItem({ complaint, index }) {
    return (
        <div className="complaint-list-item">
            <div className="complaint-list-item-header">
                <div className="date">
                    <h2>{complaint.date}- <button>{complaint.status}</button></h2>
                </div>
                <div className="room">
                    <h2>{complaint.room}-{complaint.name}</h2>
                </div>
             
            </div>
            <div className="complaint-list-item-body">
                <div className="description">
                    <p><button>COMPLAINT</button>{complaint.complaint}</p>
                    <p><button>SOLUTION</button>{complaint.solution}</p>
                </div>
                <div className="user">
                    <p><button>Created by</button>{complaint.user}</p>
                </div>
            </div>
        </div>
    );
}