const Task = require('../../models/task')

module.exports = {
    create,
    index
};


async function index(req, res) {
    const tasks = await Task.find({})
    res.json(tasks)
}

async function create(req, res) {
    const newTask = await Task.create(req.body)
    return res.json(newTask)
}