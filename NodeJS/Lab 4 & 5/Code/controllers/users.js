const CustomError = require('../helpers/CustomError');
const { Users } = require('../models');

const create = async (data) => {
  const user = await Users.create(data);
  const token = user.generateJwt();

  return { user, token };
};

const login = async (data) => {
  const user = await Users.findOne({ username: data.username }).exec();

  if (!user) throw new CustomError({ statusCode: 401, code: 'AUTH_ERROR', message: 'Username or password is not correct' });

  const isValidPassword = user.verifyPassword(data.password);
  if (!isValidPassword) throw new CustomError({ statusCode: 401, code: 'AUTH_ERROR', message: 'Username or password is not correct' });
  const token = user.generateJwt();

  return { user, token };
};

const listFirstNames = async () => {
  const users = await Users.find({}, { firstName: 1 }).exec();
  return users.map(user => user.firstName);
};

const updateById = async ({ id, loggedInUserId, data }) => {
  if (id !== String(loggedInUserId)) {
    throw new CustomError({ statusCode: 403, code: 'FORBIDDEN', message: 'You can only edit your own account' });
  }

  const user = await Users.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  }).exec();

  if (!user) {
    throw new CustomError({ statusCode: 404, code: 'NOT_FOUND', message: 'User not found' });
  }

  return user;
};

const deleteById = async ({ id, loggedInUserId }) => {
  if (id !== String(loggedInUserId)) {
    throw new CustomError({ statusCode: 403, code: 'FORBIDDEN', message: 'You can only delete your own account' });
  }

  const user = await Users.findByIdAndDelete(id).exec();

  if (!user) {
    throw new CustomError({ statusCode: 404, code: 'NOT_FOUND', message: 'User not found' });
  }
};

module.exports = {
  create,
  login,
  listFirstNames,
  updateById,
  deleteById
};
