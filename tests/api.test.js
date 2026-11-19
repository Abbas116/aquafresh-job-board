process.env.NODE_ENV = 'test';
require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Company = require('../src/models/Company');
const Job = require('../src/models/Job');

let company;

const validCompany = {
  name: 'AquaFresh Water Delivery',
  city: 'Rawalpindi',
  email: 'careers@aquafresh.pk',
  phone: '051-5551234'
};

const validJob = () => ({
  title: 'Delivery Rider (19L Bottle Delivery)',
  description: 'Deliver 19-litre bottles to homes and offices.',
  company: company._id.toString(),
  location: 'Rawalpindi',
  jobType: 'full-time',
  salaryMin: 38000,
  salaryMax: 48000,
  vehicleType: 'bike',
  licenseRequired: true,
  shift: 'morning'
});

jest.setTimeout(60000);

beforeAll(async () => {
  const uri = process.env.TEST_MONGODB_URI;
  if (!uri || !uri.includes('test')) {
    throw new Error('Set TEST_MONGODB_URI in .env (database name must contain "test")');
  }
  await mongoose.connect(uri);
  await Company.init();
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Job.deleteMany({});
  await Company.deleteMany({});
  company = await Company.create(validCompany);
});

describe('Companies', () => {
  test('POST /api/companies creates a company (201)', async () => {
    const res = await request(app).post('/api/companies').send({ ...validCompany, name: 'PureDrop Filtration Plant' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('PureDrop Filtration Plant');
  });

  test('POST /api/companies with missing fields returns 400 and a clear message', async () => {
    const res = await request(app).post('/api/companies').send({ name: 'X' });
    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe('string');
    expect(res.body.details.length).toBeGreaterThan(0);
  });

  test('duplicate company name returns 409', async () => {
    const res = await request(app).post('/api/companies').send(validCompany);
    expect(res.status).toBe(409);
  });

  test('GET /api/companies/:id with invalid id returns 400', async () => {
    const res = await request(app).get('/api/companies/not-an-id');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid id format');
  });

  test('GET unknown company returns 404', async () => {
    const res = await request(app).get(`/api/companies/${new mongoose.Types.ObjectId()}`);
    expect(res.status).toBe(404);
  });
});

describe('Jobs', () => {
  test('POST /api/jobs creates a job (201)', async () => {
    const res = await request(app).post('/api/jobs').send(validJob());
    expect(res.status).toBe(201);
    expect(res.body.data.title).toMatch(/Delivery Rider/);
    expect(res.body.data.status).toBe('open');
  });

  test('POST /api/jobs without title returns 400 with clear message', async () => {
    const body = validJob();
    delete body.title;
    const res = await request(app).post('/api/jobs').send(body);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Job title is required');
  });

  test('salaryMax lower than salaryMin returns 400', async () => {
    const res = await request(app).post('/api/jobs').send({ ...validJob(), salaryMin: 50000, salaryMax: 40000 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/salaryMax/);
  });

  test('job for a company that does not exist returns 404', async () => {
    const res = await request(app).post('/api/jobs').send({ ...validJob(), company: new mongoose.Types.ObjectId().toString() });
    expect(res.status).toBe(404);
  });

  test('GET /api/jobs returns paginated list with company name', async () => {
    await request(app).post('/api/jobs').send(validJob());
    const res = await request(app).get('/api/jobs?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].company.name).toBe('AquaFresh Water Delivery');
  });

  test('PUT /api/jobs/:id updates and DELETE removes', async () => {
    const created = await request(app).post('/api/jobs').send(validJob());
    const id = created.body.data._id;
    const upd = await request(app).put(`/api/jobs/${id}`).send({ status: 'closed' });
    expect(upd.status).toBe(200);
    expect(upd.body.data.status).toBe('closed');
    const del = await request(app).delete(`/api/jobs/${id}`);
    expect(del.status).toBe(200);
    expect((await request(app).get(`/api/jobs/${id}`)).status).toBe(404);
  });

  test('malformed JSON body returns 400, not a crash', async () => {
    const res = await request(app).post('/api/jobs').set('Content-Type', 'application/json').send('{bad json');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Request body is not valid JSON');
  });

  test('unknown route returns 404 JSON', async () => {
    const res = await request(app).get('/api/nothing');
    expect(res.status).toBe(404);
  });
});
