const Complaint = require('../../models/complaint')

module.exports = {
    create,
    index
};

async function index(req, res) {
    const complaint = await Complaint.find({ user: req.user._id })
    res.json(complaint)
}

async function create(req, res) {
    req.body.user = req.user._id
    const newComplaint = await Complaint.create(req.body)
    console.log(newComplaint)
    return res.json(newComplaint)
}





// //get all complaints
// const getAllComplaints = async(req, res) => {
//     try {
//         const complaints = await Complaint.find({}).sort({ createdAt: -1 })
//         res.status(200).json(complaints)
//     } catch (err) {
//         res.status(500).json(err)
//     }
// }


// //get one complaint
// const getOneComplaint = async(req, res) => {
//     const { id } = req.params
//     try {
//         const complaint = await Complaint.findById(req.params.id)
//         res.status(200).json(complaint)
//     } catch (err) {
//         res.status(500).json(err)
//     }
// }


// //create new complaint
// const createComplaint = async(req, res) => {
//     const { date, room, name, issue, solution, status, user } = req.body
//     try {
//         const complaint = await Complaint.create(req.body)
//         res.status(200).json(complaint)
//     } catch (err) {
//         res.status(400).json(err)
//     }
// }


// //delete one complaint
// const deleteComplaint = async(req, res) => {
//     const { id } = req.params
//     try {
//         const complaint = await Complaint.findOneAndDelete({ _id: id })
//         res.status(200).json(complaint)
//     } catch (err) {
//         res.status(500).json(err)
//     }
// }



// //update one complain
// const updateComplaint = async(req, res) => {
//     const { id } = req.params
//     const { date, room, name, issue, solution, status, user } = req.body
//     try {
//         const complaint = await Complaint.findOneAndUpdate({ _id: id }, {...req.body }, { new: true })
//         res.status(200).json(complaint)
//     } catch (err) {
//         res.status(500).json(err)
//     }
// }




// module.exports = {
//     createComplaint,
//     getAllComplaints,
//     getOneComplaint,
//     deleteComplaint,
//     updateComplaint

// }