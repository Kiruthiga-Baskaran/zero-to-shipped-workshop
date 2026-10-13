const comparisonService = require('../services/comparisonService');
const {
  createHttpError,
  isPdfBuffer,
  isValidObjectId,
} = require('../utils');

async function createComparison(req, res) {
  const { file } = req;
  const jobDescription = typeof req.body.jobDescription === 'string'
    ? req.body.jobDescription.trim()
    : '';

  if (!file) {
    throw createHttpError(400, 'A resume PDF is required.');
  }

  if (!isPdfBuffer(file.buffer)) {
    throw createHttpError(400, 'The uploaded file is not a valid PDF.');
  }

  if (!jobDescription) {
    throw createHttpError(400, 'A job description is required.');
  }

  if (jobDescription.length > 20000) {
    throw createHttpError(400, 'The job description must be 20,000 characters or fewer.');
  }

  const comparison = await comparisonService.createComparison({
    file,
    jobDescription,
  });

  res.status(201).json({
    message: 'Comparison materials saved. Analysis is not available yet.',
    comparison: {
      id: comparison.id,
      status: comparison.status,
      resumeOriginalName: comparison.resumeOriginalName,
      createdAt: comparison.createdAt,
    },
  });
}

async function getComparison(req, res) {
  if (!isValidObjectId(req.params.id)) {
    throw createHttpError(400, 'Invalid comparison ID.');
  }

  const comparison = await comparisonService.getComparison(req.params.id);

  if (!comparison) {
    throw createHttpError(404, 'Comparison not found.');
  }

  res.json({
    comparison: {
      id: comparison.id,
      status: comparison.status,
      resumeOriginalName: comparison.resumeOriginalName,
      resumeSize: comparison.resumeSize,
      jobDescription: comparison.jobDescription,
      createdAt: comparison.createdAt,
      updatedAt: comparison.updatedAt,
    },
  });
}

module.exports = { createComparison, getComparison };
