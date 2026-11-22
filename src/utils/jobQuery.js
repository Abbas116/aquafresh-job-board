const mongoose = require('mongoose');
const ApiError = require('./ApiError');
const { JOB_TYPES, SHIFTS, VEHICLES, SORTS } = require('../constants/job');

const ALLOWED_PARAMS = [
  'q', 'location', 'jobType', 'shift', 'vehicleType', 'licenseRequired',
  'salaryMin', 'salaryMax', 'company', 'status', 'sort', 'page', 'limit'
];
const MAX_SALARY = 10000000;
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Every value must be one plain, non-empty string (blocks arrays and objects = NoSQL injection)
function text(name, value, maxLength = 60) {
  if (typeof value !== 'string') throw new ApiError(400, `${name} must be a single value`);
  const v = value.trim();
  if (!v) throw new ApiError(400, `${name} cannot be empty. Remove it or give a value`);
  if (v.length > maxLength) throw new ApiError(400, `${name} cannot be longer than ${maxLength} characters`);
  return v;
}

// "bike,suzuki-bolan" -> ['bike', 'suzuki-bolan'], each checked against the allowed list
function list(name, value, allowed) {
  const parts = text(name, value, 100).split(',').map((p) => p.trim().toLowerCase());
  if (parts.some((p) => !p) || parts.length > 5 || parts.some((p) => !allowed.includes(p))) {
    throw new ApiError(400, `${name} must be one or more of: ${allowed.join(', ')}`);
  }
  return [...new Set(parts)];
}

function bool(name, value) {
  const v = text(name, value, 10).toLowerCase();
  if (v !== 'true' && v !== 'false') throw new ApiError(400, `${name} must be true or false`);
  return v === 'true';
}

function whole(name, value, min, max, hint) {
  const v = text(name, value, 12);
  const n = Number(v);
  if (!/^\d+$/.test(v) || !Number.isSafeInteger(n) || n < min || n > max) {
    throw new ApiError(400, `${name} must be ${hint}`);
  }
  return n;
}

function parseJobQuery(query = {}) {
  const unknown = Object.keys(query).filter((k) => !ALLOWED_PARAMS.includes(k));
  if (unknown.length) {
    throw new ApiError(400, `Unknown filter: ${unknown.join(', ')}. Allowed filters: ${ALLOWED_PARAMS.join(', ')}`);
  }

  const filter = {};
  const applied = {};

  // Status: only open jobs are shown unless the caller asks otherwise
  let status = 'open';
  if (query.status !== undefined) {
    status = text('status', query.status, 10).toLowerCase();
    if (!['open', 'closed', 'all'].includes(status)) throw new ApiError(400, 'status must be one of: open, closed, all');
  }
  if (status !== 'all') filter.status = status;
  applied.status = status;

  let q;
  if (query.q !== undefined) {
    q = text('q', query.q, 100);
    filter.$text = { $search: q };
    applied.q = q;
  }

  if (query.location !== undefined) {
    const location = text('location', query.location, 50);
    filter.location = new RegExp(`^${escapeRegex(location)}$`, 'i');
    applied.location = location;
  }
  if (query.jobType !== undefined) {
    applied.jobType = list('jobType', query.jobType, JOB_TYPES);
    filter.jobType = { $in: applied.jobType };
  }
  if (query.shift !== undefined) {
    applied.shift = list('shift', query.shift, SHIFTS);
    filter.shift = { $in: applied.shift };
  }
  if (query.vehicleType !== undefined) {
    applied.vehicleType = list('vehicleType', query.vehicleType, VEHICLES);
    filter.vehicleType = { $in: applied.vehicleType };
  }
  if (query.licenseRequired !== undefined) {
    applied.licenseRequired = bool('licenseRequired', query.licenseRequired);
    filter.licenseRequired = applied.licenseRequired;
  }
  if (query.company !== undefined) {
    const company = text('company', query.company, 24);
    if (!mongoose.isValidObjectId(company)) throw new ApiError(400, 'company must be a valid company id');
    filter.company = company;
    applied.company = company;
  }

  // Salary range (PKR per month): keep jobs whose pay range overlaps the range asked for
  const hint = `a whole number between 0 and ${MAX_SALARY} (PKR per month)`;
  if (query.salaryMin !== undefined) {
    applied.salaryMin = whole('salaryMin', query.salaryMin, 0, MAX_SALARY, hint);
    filter.salaryMax = { $gte: applied.salaryMin };
  }
  if (query.salaryMax !== undefined) {
    applied.salaryMax = whole('salaryMax', query.salaryMax, 0, MAX_SALARY, hint);
    filter.salaryMin = { $lte: applied.salaryMax };
  }
  if (applied.salaryMin !== undefined && applied.salaryMax !== undefined && applied.salaryMin > applied.salaryMax) {
    throw new ApiError(400, 'salaryMin cannot be greater than salaryMax');
  }

  // Sorting
  let sortName = q ? 'relevance' : 'newest';
  if (query.sort !== undefined) {
    sortName = text('sort', query.sort, 20).toLowerCase();
    if (!SORTS.includes(sortName)) throw new ApiError(400, `sort must be one of: ${SORTS.join(', ')}`);
    if (sortName === 'relevance' && !q) throw new ApiError(400, 'sort=relevance needs a search text (q)');
  }
  applied.sort = sortName;

  const sorts = {
    relevance: { score: { $meta: 'textScore' }, _id: 1 },
    newest: { createdAt: -1, _id: -1 },
    oldest: { createdAt: 1, _id: 1 },
    salary_high: { salaryMax: -1, _id: 1 },
    salary_low: { salaryMin: 1, _id: 1 }
  };
  const projection = sortName === 'relevance' ? { score: { $meta: 'textScore' } } : undefined;

  // Pagination
  const page = query.page === undefined ? 1 : whole('page', query.page, 1, 100000, 'a whole number of 1 or more');
  const limit = query.limit === undefined ? 10 : whole('limit', query.limit, 1, 50, 'a whole number between 1 and 50');

  return { filter, sort: sorts[sortName], projection, applied, page, limit, skip: (page - 1) * limit };
}

module.exports = { parseJobQuery, ALLOWED_PARAMS };
