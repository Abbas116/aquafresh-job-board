const mongoose = require('mongoose');

const { JOB_TYPES, SHIFTS, VEHICLES, STATUSES } = require('../constants/job');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [3, 'Job title must be at least 3 characters'],
      maxlength: [100, 'Job title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters']
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
      index: true
    },
    location: { type: String, required: [true, 'Location is required'], trim: true, index: true },
    jobType: {
      type: String,
      enum: { values: JOB_TYPES, message: 'jobType must be full-time, part-time or contract' },
      default: 'full-time'
    },
    salaryMin: { type: Number, required: [true, 'salaryMin is required'], min: [0, 'salaryMin cannot be negative'] },
    salaryMax: {
      type: Number,
      required: [true, 'salaryMax is required'],
      min: [0, 'salaryMax cannot be negative'],
      validate: {
        validator: function (v) {
          return typeof this.salaryMin !== 'number' || v >= this.salaryMin;
        },
        message: 'salaryMax must be greater than or equal to salaryMin'
      }
    },
    currency: { type: String, default: 'PKR' },
    vehicleType: {
      type: String,
      enum: { values: VEHICLES, message: `vehicleType must be one of: ${VEHICLES.join(', ')}` },
      default: 'none'
    },
    licenseRequired: { type: Boolean, default: false },
    shift: {
      type: String,
      enum: { values: SHIFTS, message: 'shift must be morning, evening, night or rotating' },
      default: 'morning'
    },
    bottleCapacityPerDay: { type: Number, min: [0, 'bottleCapacityPerDay cannot be negative'] },
    status: {
      type: String,
      enum: { values: STATUSES, message: 'status must be open or closed' },
      default: 'open',
      index: true
    }
  },
  { timestamps: true }
);

// Indexes for search and filters (Task 2)
jobSchema.index({ createdAt: -1 });
jobSchema.index({ status: 1, location: 1, createdAt: -1 }); // default list + location filter
jobSchema.index({ status: 1, vehicleType: 1 });
jobSchema.index({ salaryMin: 1, salaryMax: 1 });
// Keyword search: title matters more than description
jobSchema.index(
  { title: 'text', description: 'text' },
  { weights: { title: 10, description: 2 }, name: 'job_text_search' }
);

module.exports = mongoose.model('Job', jobSchema);
