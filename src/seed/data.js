// Realistic sample data for a drinking water delivery business (Pakistan)
const companies = [
  {
    name: 'AquaFresh Water Delivery',
    description: 'Home and office delivery of 19-litre RO purified drinking water bottles across Rawalpindi and Islamabad.',
    city: 'Rawalpindi',
    address: 'Amna Plaza, Peshawar Road, Rawalpindi',
    phone: '051-5551234',
    email: 'careers@aquafresh.pk',
    website: 'https://aquafresh.pk'
  },
  {
    name: 'PureDrop Filtration Plant',
    description: 'RO and UV filtration plant supplying bottled water to AquaFresh and local retailers.',
    city: 'Peshawar',
    address: 'Industrial Estate, Hayatabad Phase 3, Peshawar',
    phone: '091-5812345',
    email: 'hr@puredrop.pk',
    website: 'https://puredrop.pk'
  },
  {
    name: 'Margalla Bottle Logistics',
    description: 'Fleet and route partner handling bulk bottle transport for water companies.',
    city: 'Islamabad',
    address: 'I-9 Industrial Area, Islamabad',
    phone: '051-4445566',
    email: 'jobs@margallalogistics.pk'
  }
];

// "companyName" is replaced with the real company id by the seed script
const jobs = [
  {
    companyName: 'AquaFresh Water Delivery',
    title: 'Delivery Rider (19L Bottle Delivery)',
    description: 'Deliver 19-litre bottles to homes and offices in Satellite Town and Saddar. Collect empty bottles and cash, update the daily delivery sheet.',
    location: 'Rawalpindi', jobType: 'full-time', salaryMin: 38000, salaryMax: 48000,
    vehicleType: 'bike', licenseRequired: true, shift: 'morning', bottleCapacityPerDay: 60
  },
  {
    companyName: 'AquaFresh Water Delivery',
    title: 'Delivery Driver (Suzuki Bolan)',
    description: 'Drive a Suzuki Bolan on fixed routes, deliver up to 120 bottles a day, and report bottle damage or shortages to the route supervisor.',
    location: 'Islamabad', jobType: 'full-time', salaryMin: 45000, salaryMax: 60000,
    vehicleType: 'suzuki-bolan', licenseRequired: true, shift: 'morning', bottleCapacityPerDay: 120
  },
  {
    companyName: 'AquaFresh Water Delivery',
    title: 'Customer Support & Order Taker',
    description: 'Take bottle orders by phone and WhatsApp, schedule deliveries, and handle complaints about late or missing bottles.',
    location: 'Rawalpindi', jobType: 'full-time', salaryMin: 30000, salaryMax: 40000,
    vehicleType: 'none', licenseRequired: false, shift: 'evening'
  },
  {
    companyName: 'AquaFresh Water Delivery',
    title: 'Route Supervisor',
    description: 'Plan daily delivery routes for 8 drivers, track bottle stock per route, and resolve delivery issues on the same day.',
    location: 'Rawalpindi', jobType: 'full-time', salaryMin: 65000, salaryMax: 85000,
    vehicleType: 'bike', licenseRequired: true, shift: 'rotating'
  },
  {
    companyName: 'AquaFresh Water Delivery',
    title: 'Weekend Bottle Loader',
    description: 'Load and unload 19-litre bottles on delivery trucks every Saturday and Sunday. Lifting ability required.',
    location: 'Rawalpindi', jobType: 'part-time', salaryMin: 15000, salaryMax: 20000,
    vehicleType: 'none', licenseRequired: false, shift: 'morning', bottleCapacityPerDay: 300
  },
  {
    companyName: 'PureDrop Filtration Plant',
    title: 'RO Plant Operator',
    description: 'Run and maintain the 3-stage RO plant, change sediment and carbon filters on schedule, and log daily output (about 4,000 litres per hour).',
    location: 'Peshawar', jobType: 'full-time', salaryMin: 50000, salaryMax: 70000,
    vehicleType: 'none', licenseRequired: false, shift: 'rotating'
  },
  {
    companyName: 'PureDrop Filtration Plant',
    title: 'Water Quality Inspector (TDS & pH)',
    description: 'Test every batch for TDS, pH and chlorine, keep lab records, and stop any batch that fails the PSQCA limits.',
    location: 'Peshawar', jobType: 'full-time', salaryMin: 55000, salaryMax: 75000,
    vehicleType: 'none', licenseRequired: false, shift: 'morning'
  },
  {
    companyName: 'PureDrop Filtration Plant',
    title: 'Bottle Washing & Filling Technician',
    description: 'Operate the bottle washing and filling line, sanitise returned bottles, and seal and label filled bottles.',
    location: 'Peshawar', jobType: 'full-time', salaryMin: 32000, salaryMax: 42000,
    vehicleType: 'none', licenseRequired: false, shift: 'night', bottleCapacityPerDay: 2000
  },
  {
    companyName: 'Margalla Bottle Logistics',
    title: 'Truck Driver (Bulk Bottle Transport)',
    description: 'Drive a 10-wheel truck carrying up to 800 bottles between the plant and distribution points in Islamabad and Rawalpindi.',
    location: 'Islamabad', jobType: 'contract', salaryMin: 70000, salaryMax: 90000,
    vehicleType: 'truck', licenseRequired: true, shift: 'evening', bottleCapacityPerDay: 800
  },
  {
    companyName: 'Margalla Bottle Logistics',
    title: 'Warehouse Stock Keeper',
    description: 'Count incoming and outgoing bottles, keep the empty-bottle register, and report losses to the manager every evening.',
    location: 'Islamabad', jobType: 'full-time', salaryMin: 40000, salaryMax: 55000,
    vehicleType: 'none', licenseRequired: false, shift: 'morning'
  }
];

module.exports = { companies, jobs };
