# AquaFresh Water Delivery - Job Board API (Task 1)

REST API for **jobs and companies** of a drinking water delivery business (19-litre bottle delivery, RO plant, logistics).
Built with **Node.js, Express and MongoDB (Mongoose)**. Later tasks (search, applicant accounts, employer dashboard, email alerts) build on this API.

**Live API:** `https://aquafresh-job-board.vercel.app`  (replace after deploying)
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

Tests use a separate database so your real data is never touched. Add this to your `.env` first (the database name must contain `test`):

```
TEST_MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/aquafresh-jobs-test?retryWrites=true&w=majority
```

Tests cover: creating a company and a job (success), missing job title (failure with a clear message), salaryMax below salaryMin, duplicate company, unknown company, invalid id, malformed JSON, pagination, and update and delete.

## Deploy (Vercel)

The API is deployed on Vercel as a serverless function.

**Files used for deployment**
- `api/index.js`: connects to MongoDB and passes requests to the Express app
- `vercel.json`: sends every URL to `api/index.js`

**Steps**
1. Push the project to GitHub (`.env` must not be pushed).
2. In MongoDB Atlas, open Network Access and allow `0.0.0.0/0`.
3. On vercel.com, sign up with GitHub, then click **Add New, Project** and import this repository.
4. Set Framework Preset to **Other** and keep the other settings as default.
5. Add these Environment Variables:
   - `MONGODB_URI`: your Atlas connection string
   - `NODE_ENV`: `production`
6. Click **Deploy**.
7. Open `<your-vercel-link>/api/health` and `<your-vercel-link>/api/jobs` to check it works.
8. Load sample data once from your computer with `npm run seed` (it uses the same Atlas database).

After changing an environment variable, redeploy the project in Vercel.

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
