const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  documents: [
    {
      name: String,
      reference: String,
    },
  ],
  last_connection: Date,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
