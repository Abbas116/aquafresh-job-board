// Unit tests for search/filter validation. No database needed.
const { parseJobQuery } = require('../src/utils/jobQuery');

const fails = (query) => {
  try {
    parseJobQuery(query);
  } catch (err) {
    return err;
  }
  throw new Error('Expected parseJobQuery to throw');
};

describe('parseJobQuery - main path', () => {
  test('no filters: open jobs only, newest first, page 1, limit 10', () => {
    const r = parseJobQuery({});
    expect(r.filter).toEqual({ status: 'open' });
    expect(r.applied.sort).toBe('newest');
    expect(r.page).toBe(1);
    expect(r.limit).toBe(10);
    expect(r.skip).toBe(0);
  });

  test('keyword search sorts by relevance and uses a text search', () => {
    const r = parseJobQuery({ q: ' driver ' });
    expect(r.filter.$text).toEqual({ $search: 'driver' });
    expect(r.applied.sort).toBe('relevance');
    expect(r.projection).toEqual({ score: { $meta: 'textScore' } });
  });

  test('combines several filters', () => {
    const r = parseJobQuery({
      location: 'islamabad',
      vehicleType: 'bike,suzuki-bolan',
      licenseRequired: 'true',
      shift: 'morning',
      salaryMin: '40000',
      salaryMax: '60000',
      sort: 'salary_high'
    });
    expect(r.filter.location.test('Islamabad')).toBe(true);
    expect(r.filter.vehicleType).toEqual({ $in: ['bike', 'suzuki-bolan'] });
    expect(r.filter.licenseRequired).toBe(true);
    expect(r.filter.shift).toEqual({ $in: ['morning'] });
    expect(r.filter.salaryMax).toEqual({ $gte: 40000 });
    expect(r.filter.salaryMin).toEqual({ $lte: 60000 });
    expect(r.sort).toEqual({ salaryMax: -1, _id: 1 });
  });

  test('status=all removes the status filter', () => {
    expect(parseJobQuery({ status: 'all' }).filter.status).toBeUndefined();
  });

  test('pagination sets skip', () => {
    const r = parseJobQuery({ page: '3', limit: '20' });
    expect(r.skip).toBe(40);
  });

  test('location text cannot act as a regex', () => {
    const r = parseJobQuery({ location: '.*' });
    expect(r.filter.location.test('Rawalpindi')).toBe(false);
  });
});

describe('parseJobQuery - failure path (clear messages)', () => {
  test('wrong jobType', () => {
    const err = fails({ jobType: 'weekly' });
    expect(err.status).toBe(400);
    expect(err.message).toBe('jobType must be one or more of: full-time, part-time, contract');
  });

  test('wrong vehicleType, shift and boolean', () => {
    expect(fails({ vehicleType: 'helicopter' }).message).toMatch(/vehicleType must be one or more of/);
    expect(fails({ shift: 'noon' }).message).toMatch(/shift must be one or more of/);
    expect(fails({ licenseRequired: 'maybe' }).message).toBe('licenseRequired must be true or false');
  });

  test('salary must be a number and min cannot exceed max', () => {
    expect(fails({ salaryMin: 'abc' }).message).toMatch(/salaryMin must be a whole number/);
    expect(fails({ salaryMin: '-5' }).message).toMatch(/salaryMin must be a whole number/);
    expect(fails({ salaryMin: '70000', salaryMax: '40000' }).message).toBe('salaryMin cannot be greater than salaryMax');
  });

  test('empty search text', () => {
    expect(fails({ q: '   ' }).message).toMatch(/q cannot be empty/);
    expect(fails({ location: '' }).message).toMatch(/location cannot be empty/);
  });

  test('too long search text', () => {
    expect(fails({ q: 'a'.repeat(101) }).message).toMatch(/q cannot be longer than 100/);
  });

  test('page and limit', () => {
    expect(fails({ page: '0' }).message).toMatch(/page must be/);
    expect(fails({ limit: '500' }).message).toBe('limit must be a whole number between 1 and 50');
    expect(fails({ limit: 'ten' }).message).toMatch(/limit must be/);
  });

  test('arrays and objects are rejected (injection attempts)', () => {
    expect(fails({ location: ['a', 'b'] }).message).toBe('location must be a single value');
    expect(fails({ location: { $ne: 'x' } }).message).toBe('location must be a single value');
  });

  test('unknown filter names are listed', () => {
    const err = fails({ locaton: 'Peshawar' });
    expect(err.status).toBe(400);
    expect(err.message).toMatch(/Unknown filter: locaton/);
  });

  test('bad company id, sort and relevance without q', () => {
    expect(fails({ company: '123' }).message).toBe('company must be a valid company id');
    expect(fails({ sort: 'random' }).message).toMatch(/sort must be one of/);
    expect(fails({ sort: 'relevance' }).message).toBe('sort=relevance needs a search text (q)');
  });
});
