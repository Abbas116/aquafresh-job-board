# AquaFresh Water Delivery - Job Board API (Task 1)

REST API for **jobs and companies** of a drinking water delivery business (19-litre bottle delivery, RO plant, logistics).
Built with **Node.js, Express and MongoDB (Mongoose)**. Later tasks (search, applicant accounts, employer dashboard, email alerts) build on this API.

**Live API:** `https://YOUR-APP.onrender.com`  (replace after deploying)
**Health check:** `GET /api/health`

## Features
- Full CRUD for companies and jobs
- Jobs fit the water delivery business: vehicle type (bike, Suzuki Bolan, pickup, truck), license required, shift, bottles per day, salary in PKR
- Realistic seed data (3 companies, 10 jobs)
- Clear error messages: `{ "error": "Job title is required", "details": [...] }`, the server never crashes on bad input
- Pagination (`?page=1&limit=10`, max 50)
- Security: helmet, CORS, rate limiting (200 requests / 15 min), 10kb body limit, whitelisted fields, id validation
- Performance: indexes on `company`, `location`, `status`, `city`, `createdAt`; lean queries
- Tests with Jest + Supertest (in-memory MongoDB)

## Run locally
```bash
git clone <your-repo-url>
cd aquafresh-job-board
npm install
cp .env.example .env      # then put your MongoDB Atlas (or local) URI in .env
npm run seed              # loads sample companies and jobs
npm run dev               # http://localhost:5000
```

### Environment variables
| Name | Meaning |
|---|---|
| `PORT` | Port of the server (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `NODE_ENV` | `development` or `production` |

## Endpoints
| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Server status |
| POST | `/api/companies` | Create company |
| GET | `/api/companies?city=Peshawar&page=1&limit=10` | List companies |
| GET | `/api/companies/:id` | One company |
| PUT | `/api/companies/:id` | Update company |
| DELETE | `/api/companies/:id` | Delete company (and its jobs) |
| POST | `/api/jobs` | Create job |
| GET | `/api/jobs?status=open&company=<id>&page=1` | List jobs |
| GET | `/api/jobs/:id` | One job (with company details) |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |

### Example: create a job
```bash
curl -X POST http://localhost:5000/api/jobs -H "Content-Type: application/json" -d '{
  "title": "Delivery Driver (Suzuki Bolan)",
  "description": "Deliver up to 120 bottles a day on fixed routes.",
  "company": "<companyId>",
  "location": "Islamabad",
  "jobType": "full-time",
  "salaryMin": 45000,
  "salaryMax": 60000,
  "vehicleType": "suzuki-bolan",
  "licenseRequired": true,
  "shift": "morning",
  "bottleCapacityPerDay": 120
}'
```

### Error codes
| Code | When |
|---|---|
| 400 | Missing/invalid field, bad id, malformed JSON |
| 404 | Company/job/route not found |
| 409 | Duplicate company name |
| 413 | Body larger than 10kb |
| 429 | Too many requests |

## Tests
```bash
npm test
```
The first run downloads a MongoDB binary for the in-memory database (one time, needs internet). Tests cover: create company/job (success), missing title (failure), salaryMax < salaryMin, duplicate company, unknown company, invalid id, bad JSON, pagination, update/delete.

## Deploy (Render)
1. Push to GitHub. 2. In MongoDB Atlas allow network access `0.0.0.0/0`. 3. On render.com create a **Web Service** from the repo:
   Build command `npm install`, Start command `npm start`. 4. Add env vars `MONGODB_URI` and `NODE_ENV=production`. 5. Run the seed once with your Atlas URI from your computer (`npm run seed`). 6. Put the live URL at the top of this README.

## Project structure
```
src/
  config/db.js            MongoDB connection
  models/                 Company.js, Job.js
  controllers/            business logic
  routes/                 URL routes
  middleware/             errorHandler, validateObjectId
  utils/                  asyncHandler, ApiError, pick, pagination
  seed/                   data.js, seed.js
  app.js / server.js
tests/api.test.js
```
