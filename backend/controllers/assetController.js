// Import our Asset Model (the blueprint)
const Asset = require('../models/Asset');

// @desc    Create a new asset
// @route   POST /api/assets
const createAsset = async (req, res) => {
    try {
        // req.body contains the data sent from Postman or our Frontend form
        const { assetTag, name, category, status } = req.body;

        // 1. Check if the asset already exists in the database
        const assetExists = await Asset.findOne({ assetTag });
        if (assetExists) {
            return res.status(400).json({ message: 'Asset with this tag already exists' });
        }

        // 2. Create the new asset in the database
        const asset = await Asset.create({
            assetTag,
            name,
            category,
            status
        });

        // 3. Send a success response back
        res.status(201).json(asset);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all assets
// @route   GET /api/assets
const getAssets = async (req, res) => {
    try {
        // Find ALL assets in the database
        const assets = await Asset.find({});
        res.status(200).json(assets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};



const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // Remove it from the database
        await asset.deleteOne();
        res.status(200).json({ message: 'Asset deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// @desc    Update an asset
// @route   PUT /api/assets/:id
const updateAsset = async (req, res) => {
    try {
        // 1. Find the asset by the ID in the URL
        const asset = await Asset.findById(req.params.id);
        
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // 2. Update the fields with the new data from the frontend
        asset.assetTag = req.body.assetTag || asset.assetTag;
        asset.name = req.body.name || asset.name;
        asset.category = req.body.category || asset.category;
        asset.status = req.body.status || asset.status;

        // 3. Save the updated asset back to the database
        const updatedAsset = await asset.save();
        res.status(200).json(updatedAsset);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};



// Export the functions so our routes can use them
module.exports = {
    createAsset,
    getAssets,
    deleteAsset,
    updateAsset
};