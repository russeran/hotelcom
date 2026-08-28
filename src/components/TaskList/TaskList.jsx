import TaskListItem from "../TaskListItem/TaskListItem";
import { Table, Button } from "react-bootstrap";
import StatusBadge from "../StatusBadge/StatusBadge";
import PriorityBadge from "../PriorityBadge/PriorityBadge";


export default function TaskList({ tasks, handleDelete, handleUpdateStatus, handleAcknowledge, currentUser }) {
    if (!tasks.length) {
        return <div className="empty-state">No tasks match your filters yet.</div>;
    }

    // Desktop table view
    const desktopView = (
        <Table hover responsive className="align-middle mb-0 task-table">
            <thead>
                <tr>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Department</th>
                    <th>Room</th>
                    <th>Assignee</th>
                    <th>Task</th>
                    <th className="text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((task, index) => (
                    <TaskListItem key={task._id || index} task={task} handleDelete={handleDelete} handleUpdateStatus={handleUpdateStatus} handleAcknowledge={handleAcknowledge} currentUser={currentUser} />
                ))}
            </tbody>
        </Table>
    );

    // Mobile card view
    const mobileView = (
        <div className="task-list-mobile">
            {tasks.map((task, index) => (
                <div key={task._id || index} className="task-card-mobile">
                    <div className="task-card-mobile-header">
                        <div className="task-card-mobile-priority">
                            <PriorityBadge priority={task.priority} />
                            <StatusBadge status={task.status} />
                        </div>
                    </div>

                    <div className="task-card-mobile-task">
                        {task.task}
                    </div>

                    <div className="task-card-mobile-details">
                        <div className="task-card-mobile-detail">
                            <span className="task-card-mobile-detail-label">Department</span>
                            <span>{task.department || '—'}</span>
                        </div>
                        <div className="task-card-mobile-detail">
                            <span className="task-card-mobile-detail-label">Room</span>
                            <span>{task.room || '—'}</span>
                        </div>
                        <div className="task-card-mobile-detail">
                            <span className="task-card-mobile-detail-label">Assignee</span>
                            <span>{task.user || '—'}</span>
                        </div>
                        <div className="task-card-mobile-detail">
                            <span className="task-card-mobile-detail-label">Created</span>
                            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="task-card-mobile-actions">
                        {task.status?.toLowerCase() === 'open' && (
                            <Button 
                                size="sm" 
                                variant="outline-primary"
                                onClick={() => handleAcknowledge(task)}
                            >
                                Acknowledge
                            </Button>
                        )}
                        {task.status?.toLowerCase() !== 'done' && (
                            <Button 
                                size="sm" 
                                variant="success"
                                onClick={() => handleUpdateStatus(task, 'Done')}
                            >
                                Mark Done
                            </Button>
                        )}
                        {(currentUser?.role === 'manager' || currentUser?.role === 'admin') && (
                            <Button 
                                size="sm" 
                                variant="outline-danger"
                                onClick={() => {
                                    if (window.confirm('Delete this task?')) {
                                        handleDelete(task._id);
                                    }
                                }}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <>
            {desktopView}
            {mobileView}
        </>
    );
}
