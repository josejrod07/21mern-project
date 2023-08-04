const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      const { user } = context;
      if (user) {
        const userData = await User.findById(user._id).select('-__v -password');
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      try {
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        throw new Error('Failed to create user');
      }
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { bookData }, context) => {
      const { user } = context;
      if (user) {
        try {
          const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $push: { savedBooks: bookData } },
            { new: true }
          );
          return updatedUser;
        } catch (err) {
          throw new Error('Failed to save book');
        }
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    removeBook: async (parent, { bookId }, context) => {
      const { user } = context;
      if (user) {
        try {
          const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );
          return updatedUser;
        } catch (err) {
          throw new Error('Failed to remove book');
        }
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
