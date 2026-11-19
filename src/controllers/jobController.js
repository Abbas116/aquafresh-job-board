const mongoose = require('mongoose');
const Job = require('../models/Job');
const Company = require('../models/Company');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const pick = require('../utils/pick');
const paginate = require('../utils/pagination');

const FIELDS = [
  'title', 'description', 'company', 'location', 'jobType', 'salaryMin', 'salaryMax',
  'vehicleType', 'licenseRequired', 'shift', 'bottleCapacityPerDay', 'status'
];

async function assertCompanyExists(id) {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'company must be a valid company id');
  if (!(await Company.exists({ _id: id }))) throw new ApiError(404, 'Company not found for this job');
}

exports.createJob = asyncHandler(async (req, res) => {
  const body = pick(req.body, FIELDS);
  if (body.company) await assertCompanyExists(body.company);
  const job = await Job.create(body);
  res.status(201).json({ data: job });
});

exports.getJobs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  // Basic filters only; full search & filters come in Task 2
  if (req.query.status) filter.status = String(req.query.status);
  if (mongoose.isValidObjectId(req.query.company)) filter.company = req.query.company;

  const [data, total] = await Promise.all([
    Job.find(filter).populate('company', 'name city').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Job.countDocuments(filter)
  ]);
  res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
});

exports.getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('company', 'name city phone email');
  if (!job) throw new ApiError(404, 'Job not found');
  res.json({ data: job });
});

exports.updateJob = asyncHandler(async (req, res) => {
  const body = pick(req.body, FIELDS);
  if (body.company) await assertCompanyExists(body.company);
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');
  job.set(body);
  await job.save(); // full validation incl. salaryMax >= salaryMin
  res.json({ data: job });
});

exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');
  res.json({ message: 'Job deleted' });
});
