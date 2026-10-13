const express = require('express');
const comparisonController = require('../controllers/comparisonController');
const { uploadResume } = require('../middleware/uploadResume');
const { asyncHandler } = require('../utils');

const router = express.Router();

router.post(
  '/',
  uploadResume,
  asyncHandler(comparisonController.createComparison),
);
router.get('/:id', asyncHandler(comparisonController.getComparison));

module.exports = router;
