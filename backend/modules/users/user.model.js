const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    
    password: {
      type: String,
      required: true,
      select: false // do not return password by default
    },

    role: {
      type: String,
      enum: ['patient', 'staff', 'admin'],
      default: 'patient'
    },

    phone: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
