const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema(
  {
    resumeFileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      immutable: true,
    },
    resumeOriginalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    resumeSize: {
      type: Number,
      required: true,
      min: 1,
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20000,
    },
    status: {
      type: String,
      enum: ['pending_analysis'],
      default: 'pending_analysis',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Comparison', comparisonSchema);
