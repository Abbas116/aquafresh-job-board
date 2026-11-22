require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('../models/Company');
const Job = require('../models/Job');
const { companies, jobs } = require('./data');

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing in .env');
  await mongoose.connect(process.env.MONGODB_URI);

  await Job.syncIndexes(); // makes sure the search (text) index exists
  await Job.deleteMany({});
  await Company.deleteMany({});

  const created = await Company.insertMany(companies);
  const idByName = Object.fromEntries(created.map((c) => [c.name, c._id]));

  const jobDocs = jobs.map(({ companyName, ...rest }) => ({ ...rest, company: idByName[companyName] }));
  await Job.insertMany(jobDocs);

  console.log(`Seeded ${created.length} companies and ${jobDocs.length} jobs`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
