import ComplaintListItem from "../ComplaintListItem/ComplaintListItem.jsx";
import "./ComplaintList.css"

export default function ComplaintList({ complaints, handleDelete, updateComplaint, currentUser }) {
    return (
        <div className="complaint-grid">
            {complaints.map((complaint, index) => (
                <ComplaintListItem
                    key={complaint._id || index}
                    complaint={complaint}
                    handleDelete={handleDelete}
                    updateComplaint={updateComplaint}
                    currentUser={currentUser}
                />
            ))}
        </div>
    );
}
