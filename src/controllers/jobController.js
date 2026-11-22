const mongoose = require('mongoose');
const Job = require('../models/Job');
const Company = require('../models/Company');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const pick = require('../utils/pick');
const { parseJobQuery } = require('../utils/jobQuery');
const { JOB_TYPES, SHIFTS, VEHICLES } = require('../constants/job');

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
  const { filter, sort, projection, applied, page, limit, skip } = parseJobQuery(req.query);

  const [data, total] = await Promise.all([
    Job.find(filter, projection).populate('company', 'name city').sort(sort).skip(skip).limit(limit).lean(),
    Job.countDocuments(filter)
  ]);

  res.json({
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    filters: applied,
    ...(total === 0 && { message: 'No jobs match your search. Try fewer filters or a different keyword.' })
  });
});

// Options for the search form: cities and salary range that exist in open jobs
exports.getFilterOptions = asyncHandler(async (req, res) => {
  const [locations, salary] = await Promise.all([
    Job.distinct('location', { status: 'open' }),
    Job.aggregate([
      { $match: { status: 'open' } },
      { $group: { _id: null, min: { $min: '$salaryMin' }, max: { $max: '$salaryMax' } } }
    ])
  ]);
  res.json({
    data: {
      locations: locations.sort(),
      jobTypes: JOB_TYPES,
      shifts: SHIFTS,
      vehicleTypes: VEHICLES,
      salary: salary[0] ? { min: salary[0].min, max: salary[0].max, currency: 'PKR' } : null
    }
  });
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
