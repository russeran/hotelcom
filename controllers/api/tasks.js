const Task = require('../../models/task')

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
