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
  },
  {
    name: 'Rawal Pure Water Supply',
    description: 'Bottled water and dispenser refill service for homes, schools and offices in Rawalpindi.',
    city: 'Rawalpindi',
    address: 'Committee Chowk, Murree Road, Rawalpindi',
    phone: '051-5772211',
    email: 'hr@rawalpure.pk'
  },
  {
    name: 'Khyber Aqua Distributors',
    description: 'Wholesale and door-to-door distribution of 19-litre bottles across Peshawar and Mardan.',
    city: 'Peshawar',
    address: 'University Road, Peshawar',
    phone: '091-5703344',
    email: 'jobs@khyberaqua.pk'
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
  },
  {
    companyName: 'AquaFresh Water Delivery',
    title: 'Evening Delivery Rider (Bahria Town)',
    description: 'Deliver evening orders in Bahria Town phases 1 to 6 on a company bike. Collect empty bottles and update the order sheet.',
    location: 'Rawalpindi', jobType: 'part-time', salaryMin: 22000, salaryMax: 30000,
    vehicleType: 'bike', licenseRequired: true, shift: 'evening', bottleCapacityPerDay: 40
  },
  {
    companyName: 'AquaFresh Water Delivery',
    title: 'Delivery Helper (Suzuki Bolan)',
    description: 'Ride along with the driver, carry 19-litre bottles to flats and offices, and count empties returned at each stop.',
    location: 'Islamabad', jobType: 'full-time', salaryMin: 28000, salaryMax: 35000,
    vehicleType: 'none', licenseRequired: false, shift: 'morning', bottleCapacityPerDay: 120
  },
  {
    companyName: 'AquaFresh Water Delivery',
    title: 'Accounts & Cash Collection Officer',
    description: 'Match daily cash from drivers with the delivery sheet, prepare monthly customer bills, and follow up on unpaid accounts.',
    location: 'Rawalpindi', jobType: 'full-time', salaryMin: 50000, salaryMax: 65000,
    vehicleType: 'none', licenseRequired: false, shift: 'morning'
  },
  {
    companyName: 'AquaFresh Water Delivery',
    title: 'Fleet Mechanic (Bolan & Pickup)',
    description: 'Service and repair delivery vehicles, keep the maintenance log, and make sure every vehicle is ready before the morning run.',
    location: 'Rawalpindi', jobType: 'full-time', salaryMin: 55000, salaryMax: 75000,
    vehicleType: 'none', licenseRequired: false, shift: 'morning'
  },
  {
    companyName: 'Rawal Pure Water Supply',
    title: 'Delivery Driver (Pickup, Dispenser Refill)',
    description: 'Drive a pickup on school and office routes, refill dispensers, and deliver up to 150 bottles a day.',
    location: 'Rawalpindi', jobType: 'full-time', salaryMin: 48000, salaryMax: 62000,
    vehicleType: 'pickup', licenseRequired: true, shift: 'morning', bottleCapacityPerDay: 150
  },
  {
    companyName: 'Rawal Pure Water Supply',
    title: 'Bottle Filling Operator',
    description: 'Run the night filling line, check cap seals and labels, and record how many bottles are filled each hour.',
    location: 'Rawalpindi', jobType: 'full-time', salaryMin: 30000, salaryMax: 38000,
    vehicleType: 'none', licenseRequired: false, shift: 'night', bottleCapacityPerDay: 1500
  },
  {
    companyName: 'Rawal Pure Water Supply',
    title: 'Sales Executive (Offices & Schools)',
    description: 'Visit offices, schools and shops to sign monthly bottle supply customers. Commission paid on every new account.',
    location: 'Rawalpindi', jobType: 'full-time', salaryMin: 40000, salaryMax: 60000,
    vehicleType: 'bike', licenseRequired: true, shift: 'morning'
  },
  {
    companyName: 'Khyber Aqua Distributors',
    title: 'Delivery Rider (Hayatabad & University Town)',
    description: 'Deliver 19-litre bottles in Hayatabad and University Town, collect payment, and report any customer complaints.',
    location: 'Peshawar', jobType: 'full-time', salaryMin: 35000, salaryMax: 45000,
    vehicleType: 'bike', licenseRequired: true, shift: 'morning', bottleCapacityPerDay: 55
  },
  {
    companyName: 'Khyber Aqua Distributors',
    title: 'Truck Driver (Peshawar to Mardan Route)',
    description: 'Drive a loaded truck with up to 700 bottles between the Peshawar depot and Mardan distributors, three trips a week.',
    location: 'Peshawar', jobType: 'contract', salaryMin: 65000, salaryMax: 85000,
    vehicleType: 'truck', licenseRequired: true, shift: 'rotating', bottleCapacityPerDay: 700
  },
  {
    companyName: 'Khyber Aqua Distributors',
    title: 'Dispatch & Route Coordinator',
    description: 'Assign daily orders to riders and drivers, track deliveries by phone, and send the end-of-day bottle count to the manager.',
    location: 'Peshawar', jobType: 'full-time', salaryMin: 45000, salaryMax: 60000,
    vehicleType: 'none', licenseRequired: false, shift: 'rotating'
  },
  {
    companyName: 'Khyber Aqua Distributors',
    title: 'Weekend Bottle Loader',
    description: 'Load and unload trucks at the Peshawar depot on Saturdays and Sundays. Able to lift 19-litre bottles all day.',
    location: 'Peshawar', jobType: 'part-time', salaryMin: 14000, salaryMax: 18000,
    vehicleType: 'none', licenseRequired: false, shift: 'morning', bottleCapacityPerDay: 250
  },
  {
    companyName: 'PureDrop Filtration Plant',
    title: 'Lab Assistant (Water Testing)',
    description: 'Help the quality inspector collect samples, run TDS and pH tests, and keep the daily test register up to date.',
    location: 'Peshawar', jobType: 'part-time', salaryMin: 25000, salaryMax: 32000,
    vehicleType: 'none', licenseRequired: false, shift: 'morning'
  },
  {
    companyName: 'Margalla Bottle Logistics',
    title: 'Delivery Driver (Suzuki Bolan, G-13 Route)',
    description: 'Deliver up to 110 bottles a day to apartments in G-13 and G-14 on a fixed route, and return empties to the warehouse.',
    location: 'Islamabad', jobType: 'full-time', salaryMin: 44000, salaryMax: 58000,
    vehicleType: 'suzuki-bolan', licenseRequired: true, shift: 'morning', bottleCapacityPerDay: 110
  },
  {
    companyName: 'Margalla Bottle Logistics',
    title: 'Night Shift Warehouse Loader',
    description: 'Load trucks overnight so deliveries leave by 6 am. Count bottles out and empties in, and report breakages.',
    location: 'Islamabad', jobType: 'full-time', salaryMin: 30000, salaryMax: 38000,
    vehicleType: 'none', licenseRequired: false, shift: 'night', bottleCapacityPerDay: 600
  },
  {
    companyName: 'Khyber Aqua Distributors',
    title: 'Customer Support Agent (Urdu & Pashto)',
    description: 'Answer customer calls in Urdu and Pashto, take bottle orders, and log complaints. This position has been filled.',
    location: 'Peshawar', jobType: 'full-time', salaryMin: 28000, salaryMax: 36000,
    vehicleType: 'none', licenseRequired: false, shift: 'evening', status: 'closed'
  },
  {
    companyName: 'Rawal Pure Water Supply',
    title: 'Trainee RO Technician',
    description: 'Learn to service RO membranes and change filters under a senior technician. This position has been filled.',
    location: 'Rawalpindi', jobType: 'contract', salaryMin: 25000, salaryMax: 30000,
    vehicleType: 'none', licenseRequired: false, shift: 'morning', status: 'closed'
  }
];

module.exports = { companies, jobs };
