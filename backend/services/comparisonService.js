const mongoose = require('mongoose');
const Comparison = require('../models/Comparison');
const { createHttpError } = require('../utils');

const BUCKET_NAME = 'resumes';
const { GridFSBucket } = mongoose.mongo;

function getResumeBucket() {
  const database = mongoose.connection.db;

  if (!database) {
    throw createHttpError(503, 'MongoDB is not connected.');
  }

  return new GridFSBucket(database, { bucketName: BUCKET_NAME });
}

function uploadResume(bucket, file) {
  const uploadStream = bucket.openUploadStream(file.originalname, {
    contentType: 'application/pdf',
    metadata: { purpose: 'resume-comparison' },
  });

  const uploaded = new Promise((resolve, reject) => {
    uploadStream.once('error', reject);
    uploadStream.once('finish', resolve);
    uploadStream.end(file.buffer);
  });

  return uploaded.then(
    () => uploadStream.id,
    async (error) => {
      try {
        await bucket.delete(uploadStream.id);
      } catch (cleanupError) {
        throw new AggregateError(
          [error, cleanupError],
          'Resume upload failed and its partial GridFS data could not be removed.',
        );
      }
      throw error;
    },
  );
}

async function createComparison({ file, jobDescription }) {
  const bucket = getResumeBucket();
  const resumeFileId = await uploadResume(bucket, file);

  try {
    return await Comparison.create({
      resumeFileId,
      resumeOriginalName: file.originalname,
      resumeSize: file.size,
      jobDescription,
    });
  } catch (error) {
    try {
      await bucket.delete(resumeFileId);
    } catch (cleanupError) {
      throw new AggregateError(
        [error, cleanupError],
        'Comparison could not be saved and its uploaded resume could not be removed.',
      );
    }
    throw error;
  }
}

function getComparison(id) {
  return Comparison.findById(id).select('-__v').lean();
}

module.exports = { createComparison, getComparison };
