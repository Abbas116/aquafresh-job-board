const mongoose = require('mongoose');

const VEHICLES = ['none', 'bike', 'suzuki-bolan', 'pickup', 'truck'];

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
      enum: { values: ['full-time', 'part-time', 'contract'], message: 'jobType must be full-time, part-time or contract' },
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
      enum: { values: ['morning', 'evening', 'night', 'rotating'], message: 'shift must be morning, evening, night or rotating' },
      default: 'morning'
    },
    bottleCapacityPerDay: { type: Number, min: [0, 'bottleCapacityPerDay cannot be negative'] },
    status: {
      type: String,
      enum: { values: ['open', 'closed'], message: 'status must be open or closed' },
      default: 'open',
      index: true
    }
  },
  { timestamps: true }
);

jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
