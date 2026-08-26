const Task = require('../../models/task')
const notifications = require('./notifications')
const audit = require('./audit')

module.exports = {
    create,
    index,
    update,
    delete: deleteTask
};


async function index(req, res) {
    const tasks = await Task.find({})
    res.json(tasks)
}

async function create(req, res) {
    const newTask = await Task.create(req.body)
    // Notify the related department about the new task, flagging urgency.
    const priorityTag = newTask.priority && newTask.priority !== 'Normal' ? `[${newTask.priority}] ` : ''
    await notifications.notify({
        department: newTask.department,
        message: `${priorityTag}New task for ${newTask.department || 'the team'}: ${newTask.task}`,
        type: 'task'
    })
    await audit.record({ req, action: 'create', entity: 'task', entityId: newTask._id, details: `${newTask.priority} · ${newTask.department} · ${newTask.task}` })
    return res.json(newTask)
}

const TASK_UPDATABLE = ['status', 'priority', 'department', 'room', 'user', 'task', 'acknowledgedAt', 'acknowledgedBy'];

async function update(req, res) {
    // Whitelist updatable fields to prevent mass assignment.
    const updates = {}
    for (const key of TASK_UPDATABLE) {
        if (req.body[key] !== undefined) updates[key] = req.body[key]
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    await audit.record({ req, action: 'update', entity: 'task', entityId: req.params.id, details: `${updatedTask ? updatedTask.task : ''} → ${JSON.stringify(updates)}` })
    return res.json(updatedTask)
}

async function deleteTask(req, res) {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json('Task not found')
    // Managers can only delete tasks within their own department; admins any.
    if (req.user.role === 'manager' && task.department !== req.user.department) {
        return res.status(403).json('Forbidden: managers can only manage tasks in their own department')
    }
    await task.deleteOne()
    await audit.record({ req, action: 'delete', entity: 'task', entityId: task._id, details: `${task.department} · ${task.task}` })
    return res.json(task)
}
