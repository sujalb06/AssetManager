const Maintenance = require('../models/Maintenance');
const Asset = require('../models/Asset');

// @desc    Log an asset for maintenance
// @route   POST /api/maintenance
const logMaintenance = async (req, res) => {
    try {
        const { assetId, issueDescription, cost } = req.body;

        // 1. Find the asset and verify it exists
        const asset = await Asset.findById(assetId);
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // 2. Create the Maintenance log
        const maintenanceLog = await Maintenance.create({
            asset: assetId,
            issueDescription,
            cost: cost || 0
        });

        // 3. Update Asset status to "Maintenance"
        asset.status = 'Maintenance';
        await asset.save();

        res.status(201).json(maintenanceLog);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Mark maintenance as completed
// @route   PUT /api/maintenance/:id/resolve
const resolveMaintenance = async (req, res) => {
    try {
        const logId = req.params.id;
        const { finalCost } = req.body; // Optional: update the cost when it's finished

        // 1. Find the log
        const maintenanceLog = await Maintenance.findById(logId);
        if (!maintenanceLog || maintenanceLog.status === 'Completed') {
            return res.status(400).json({ message: 'Invalid log or already completed' });
        }

        // 2. Update log status and cost
        maintenanceLog.status = 'Completed';
        if (finalCost) maintenanceLog.cost = finalCost;
        await maintenanceLog.save();

        // 3. Update the Asset status back to "Available"
        const asset = await Asset.findById(maintenanceLog.asset);
        if (asset) {
            asset.status = 'Available';
            await asset.save();
        }

        res.status(200).json({ message: 'Maintenance resolved', maintenanceLog });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all maintenance logs
// @route   GET /api/maintenance
const getMaintenanceLogs = async (req, res) => {
    try {
        const logs = await Maintenance.find({})
            .populate('asset', 'name assetTag category'); // Pulls in the asset details
            
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    logMaintenance,
    resolveMaintenance,
    getMaintenanceLogs
};