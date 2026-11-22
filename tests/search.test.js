// Integration tests for job search with filters. Needs TEST_MONGODB_URI in .env (database name must contain "test").
process.env.NODE_ENV = 'test';
require('dotenv').config({ quiet: true });
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Company = require('../src/models/Company');
const Job = require('../src/models/Job');

let rawalpindiCo;
let peshawarCo;

const job = (company, overrides) => ({
  description: 'Deliver 19-litre bottles to homes and offices on a fixed route.',
  company: company._id,
  location: 'Rawalpindi',
  jobType: 'full-time',
  salaryMin: 40000,
  salaryMax: 50000,
  vehicleType: 'none',
  licenseRequired: false,
  shift: 'morning',
  ...overrides
});

jest.setTimeout(60000);

beforeAll(async () => {
  const uri = process.env.TEST_MONGODB_URI;
  if (!uri || !uri.includes('test')) {
    throw new Error('Set TEST_MONGODB_URI in .env (database name must contain "test")');
  }
  await mongoose.connect(uri);
  await Company.init();
  await Job.syncIndexes(); // creates the text index used by ?q=
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Job.deleteMany({});
  await Company.deleteMany({});
  rawalpindiCo = await Company.create({ name: 'AquaFresh Water Delivery', city: 'Rawalpindi', email: 'careers@aquafresh.pk' });
  peshawarCo = await Company.create({ name: 'Khyber Aqua Distributors', city: 'Peshawar', email: 'jobs@khyberaqua.pk' });

  await Job.insertMany([
    job(rawalpindiCo, { title: 'Delivery Rider (19L Bottle Delivery)', vehicleType: 'bike', licenseRequired: true, salaryMin: 38000, salaryMax: 48000 }),
    job(rawalpindiCo, { title: 'Delivery Driver (Suzuki Bolan)', location: 'Islamabad', vehicleType: 'suzuki-bolan', licenseRequired: true, salaryMin: 45000, salaryMax: 60000 }),
    job(rawalpindiCo, { title: 'Customer Support & Order Taker', shift: 'evening', salaryMin: 30000, salaryMax: 40000 }),
    job(peshawarCo, { title: 'Truck Driver (Peshawar to Mardan Route)', location: 'Peshawar', jobType: 'contract', vehicleType: 'truck', licenseRequired: true, shift: 'rotating', salaryMin: 65000, salaryMax: 85000 }),
    job(peshawarCo, { title: 'Weekend Bottle Loader', location: 'Peshawar', jobType: 'part-time', salaryMin: 14000, salaryMax: 18000 }),
    job(peshawarCo, { title: 'Customer Support Agent (Urdu & Pashto)', location: 'Peshawar', status: 'closed', salaryMin: 28000, salaryMax: 36000 })
  ]);
});

const titles = (res) => res.body.data.map((j) => j.title);

describe('GET /api/jobs - search and filters (main path)', () => {
  test('lists open jobs by default and hides closed ones', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(5);
    expect(titles(res)).not.toContain('Customer Support Agent (Urdu & Pashto)');
  });

  test('keyword search finds matching jobs only', async () => {
    const res = await request(app).get('/api/jobs?q=driver');
    expect(res.status).toBe(200);
    expect(titles(res).sort()).toEqual(['Delivery Driver (Suzuki Bolan)', 'Truck Driver (Peshawar to Mardan Route)']);
    expect(res.body.filters.sort).toBe('relevance');
  });

  test('location filter ignores letter case', async () => {
    const res = await request(app).get('/api/jobs?location=peshawar');
    expect(res.body.total).toBe(2);
    res.body.data.forEach((j) => expect(j.location).toBe('Peshawar'));
  });

  test('several filters work together', async () => {
    const res = await request(app).get('/api/jobs?vehicleType=suzuki-bolan&licenseRequired=true&location=Islamabad&shift=morning');
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].title).toBe('Delivery Driver (Suzuki Bolan)');
  });

  test('keyword and filter together', async () => {
    const res = await request(app).get('/api/jobs?q=driver&location=Peshawar');
    expect(titles(res)).toEqual(['Truck Driver (Peshawar to Mardan Route)']);
  });

  test('salary range keeps jobs whose pay overlaps it', async () => {
    const res = await request(app).get('/api/jobs?salaryMin=60000');
    expect(titles(res).sort()).toEqual(['Delivery Driver (Suzuki Bolan)', 'Truck Driver (Peshawar to Mardan Route)']);
    const low = await request(app).get('/api/jobs?salaryMax=20000');
    expect(titles(low)).toEqual(['Weekend Bottle Loader']);
  });

  test('several values for one filter', async () => {
    const res = await request(app).get('/api/jobs?jobType=part-time,contract');
    expect(titles(res).sort()).toEqual(['Truck Driver (Peshawar to Mardan Route)', 'Weekend Bottle Loader']);
  });

  test('status=all includes closed jobs', async () => {
    const res = await request(app).get('/api/jobs?status=all');
    expect(res.body.total).toBe(6);
  });

  test('sort by salary, highest first', async () => {
    const res = await request(app).get('/api/jobs?sort=salary_high');
    const max = res.body.data.map((j) => j.salaryMax);
    expect(max).toEqual([...max].sort((a, b) => b - a));
  });

  test('pagination returns page details', async () => {
    const res = await request(app).get('/api/jobs?limit=2&page=2');
    expect(res.body.data).toHaveLength(2);
    expect(res.body).toMatchObject({ page: 2, limit: 2, total: 5, totalPages: 3 });
  });

  test('no match returns 200 with an empty list and a message', async () => {
    const res = await request(app).get('/api/jobs?q=astronaut');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(0);
    expect(res.body.data).toEqual([]);
    expect(res.body.message).toMatch(/No jobs match/);
  });

  test('GET /api/jobs/filters returns options for the search form', async () => {
    const res = await request(app).get('/api/jobs/filters');
    expect(res.status).toBe(200);
    expect(res.body.data.locations).toEqual(['Islamabad', 'Peshawar', 'Rawalpindi']);
    expect(res.body.data.vehicleTypes).toContain('suzuki-bolan');
    expect(res.body.data.salary).toEqual({ min: 14000, max: 85000, currency: 'PKR' });
  });
});

describe('GET /api/jobs - wrong input (failure path)', () => {
  test('wrong jobType returns 400 with a clear message', async () => {
    const res = await request(app).get('/api/jobs?jobType=weekly');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('jobType must be one or more of: full-time, part-time, contract');
  });

  test('salaryMin above salaryMax returns 400', async () => {
    const res = await request(app).get('/api/jobs?salaryMin=70000&salaryMax=30000');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('salaryMin cannot be greater than salaryMax');
  });

  test('empty search text returns 400', async () => {
    const res = await request(app).get('/api/jobs?q=');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/q cannot be empty/);
  });

  test('injection style input returns 400, not a crash', async () => {
    const res = await request(app).get('/api/jobs?location[$ne]=x');
    expect(res.status).toBe(400);
  });

  test('bad limit and unknown filter return 400', async () => {
    expect((await request(app).get('/api/jobs?limit=abc')).status).toBe(400);
    const res = await request(app).get('/api/jobs?locaton=Peshawar');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Unknown filter/);
  });
});
