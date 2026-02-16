const process = require('node:process');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 8,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    minLength: 3,
    maxLength: 15,
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    minLength: 3,
    maxLength: 15,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  dob: Date
}, {
  timestamps: true
});

usersSchema.pre('save', function () {
  if (!this.isModified('password')) return;
  this.password = bcrypt.hashSync(this.password, 10);
});

usersSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate();
  if (!update) return;

  if (update.password) {
    update.password = bcrypt.hashSync(update.password, 10);
  }

  if (update.$set && update.$set.password) {
    update.$set.password = bcrypt.hashSync(update.$set.password, 10);
  }
});

usersSchema.set('toJSON', {
  transform: (doc, { __v, password, ...rest }, options) => rest
});

usersSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in .env');
}

usersSchema.methods.generateJwt = function () {
  return jwt.sign({ userId: this._id, username: this.username }, JWT_SECRET, { expiresIn: '1d' });
};

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
