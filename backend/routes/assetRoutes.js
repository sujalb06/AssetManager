const express = require('express');
const router = express.Router();

// Import the logic from our controller

// 1. Add deleteAsset to the import list
const { createAsset, getAssets, deleteAsset, updateAsset } = require('../controllers/assetController');

// Map the routes to the functions
router.post('/', createAsset);
router.get('/', getAssets);
router.delete('/:id', deleteAsset);
router.put('/:id', updateAsset);

module.exports = router;