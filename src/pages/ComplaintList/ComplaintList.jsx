import ComplaintListItem from "../../components/ListItems/ComplaintListItem.jsx";
import "../ComplaintList/ComplaintList.css"


export default function ComplaintList({ complaints}) {
    return (
        <div className="complaint-list">
          
            {complaints.map((complaint, index) => (
                <ComplaintListItem key={index} complaint={complaint} index={index} />
            ))}
        </div>
    );
}