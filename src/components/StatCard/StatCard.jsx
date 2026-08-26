import { useNavigate } from "react-router-dom";
import './StatCard.css';

export default function StatCard({ label, value, sub, icon, accent = 'primary', to }) {
    const navigate = useNavigate();
    return (
        <button
            type="button"
            className={`stat-card accent-${accent}`}
            onClick={() => to && navigate(to)}
        >
            <div className="stat-icon">{icon}</div>
            <div className="stat-body">
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
                {sub && <div className="stat-sub">{sub}</div>}
            </div>
        </button>
    );
}
