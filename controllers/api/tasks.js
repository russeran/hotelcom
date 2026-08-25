const Task = require('../../models/task')
const notifications = require('./notifications')

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
    return res.json(newTask)
}

async function update(req, res) {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.json(updatedTask)
}

async function deleteTask(req, res) {
    const deletedTask = await Task.findByIdAndDelete(req.params.id)
    return res.json(deletedTask)
}
