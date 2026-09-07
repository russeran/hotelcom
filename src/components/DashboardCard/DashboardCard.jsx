import React from 'react';
import './DashboardCard.css';

export default function DashboardCard({ children, title, onRemove, customizeMode }) {
    return (
        <div className="dashboard-widget">
            {customizeMode && (
                <button className="widget-remove" onClick={onRemove} title="Remove card">
                    ✕
                </button>
            )}
            {title && <h3 className="widget-title">{title}</h3>}
            <div className="widget-content">
                {children}
            </div>
        </div>
    );
}
