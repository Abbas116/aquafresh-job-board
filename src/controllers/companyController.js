const Company = require('../models/Company');
const Job = require('../models/Job');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const pick = require('../utils/pick');
const paginate = require('../utils/pagination');

const FIELDS = ['name', 'description', 'city', 'address', 'phone', 'email', 'website'];
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.createCompany = asyncHandler(async (req, res) => {
  const company = await Company.create(pick(req.body, FIELDS));
  res.status(201).json({ data: company });
});

exports.getCompanies = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.query.city) filter.city = new RegExp(`^${escapeRegex(String(req.query.city))}$`, 'i');

  const [data, total] = await Promise.all([
    Company.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    Company.countDocuments(filter)
  ]);
  res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
});

exports.getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) throw new ApiError(404, 'Company not found');
  res.json({ data: company });
});

exports.updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, pick(req.body, FIELDS), {
    new: true,
    runValidators: true
  });
  if (!company) throw new ApiError(404, 'Company not found');
  res.json({ data: company });
});

exports.deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndDelete(req.params.id);
  if (!company) throw new ApiError(404, 'Company not found');
  await Job.deleteMany({ company: company._id }); // no orphan jobs
  res.json({ message: 'Company and its jobs deleted' });
});
