const Assignment = require('../models/Assignment');
const Asset = require('../models/Asset');

// @desc    Assign an asset to an employee
// @route   POST /api/assignments
const assignAsset = async (req, res) => {
    try {
        const { assetId, employeeId, assignedDate } = req.body;

        // 1. Verify the asset is actually "Available"
        const asset = await Asset.findById(assetId);
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        if (asset.status !== 'Available') {
            return res.status(400).json({ message: 'Asset is currently not available' });
        }

        // 2. Create the Assignment record
        const assignment = await Assignment.create({
            asset: assetId,
            employee: employeeId,
            assignedDate: assignedDate || Date.now()
        });

        // 3. Update the Asset's status to "In Use"
        asset.status = 'In Use';
        await asset.save();

        res.status(201).json(assignment);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Mark an asset as returned
// @route   PUT /api/assignments/:id/return
const returnAsset = async (req, res) => {
    try {
        const assignmentId = req.params.id; // Gets the ID from the URL

        // 1. Find the assignment
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment || assignment.status === 'Returned') {
            return res.status(400).json({ message: 'Invalid assignment or already returned' });
        }

        // 2. Update the assignment status and return date
        assignment.status = 'Returned';
        assignment.returnedDate = Date.now();
        await assignment.save();

        // 3. Update the actual Asset's status back to "Available"
        const asset = await Asset.findById(assignment.asset);
        asset.status = 'Available';
        await asset.save();

        res.status(200).json({ message: 'Asset returned successfully', assignment });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all assignments
// @route   GET /api/assignments
const getAssignments = async (req, res) => {
    try {
        // .populate() pulls in the actual Asset and Employee data instead of just showing their IDs!
        const assignments = await Assignment.find({})
            .populate('asset', 'name assetTag category') 
            .populate('employee', 'name email department');
            
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    assignAsset,
    returnAsset,
    getAssignments
};