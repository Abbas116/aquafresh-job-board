const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      minlength: [2, 'Company name must be at least 2 characters'],
      maxlength: [100, 'Company name cannot exceed 100 characters'],
      unique: true
    },
    description: { type: String, trim: true, maxlength: [1000, 'Description cannot exceed 1000 characters'] },
    city: { type: String, required: [true, 'City is required'], trim: true, index: true },
    address: { type: String, trim: true, maxlength: 200 },
    phone: {
      type: String,
      trim: true,
      match: [/^(\+92|0)\d{2,3}-?\d{6,8}$/, 'Enter a valid Pakistani phone number']
    },
    email: {
      type: String,
      required: [true, 'Company email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address']
    },
    website: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
