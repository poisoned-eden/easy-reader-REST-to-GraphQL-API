const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
	Query: {
		// WORKS front and back
		me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findOne({
					_id: context.user._id,
				}).select('-__v -password');

				return userData;
			}

			throw new AuthenticationError('No user found');
		},
	},

	Mutation: {
		// WORKS front and back
		addUser: async (parent, args) => {
			const userData = await User.create(args);
			const token = signToken(userData);

			return { token, userData };
		},
		// WORKS front and back
		login: async (parent, args) => {
			const user = await User.findOne({
				$or: [{ username: args.username }, { email: args.email }],
			});
			if (!user) {
				throw new AuthenticationError('Cant find this user');
			}

			const correctPw = await user.isCorrectPassword(args.password);

			if (!correctPw) {
				throw new AuthenticationError('incorrect password');
			}
			const token = signToken(user);
			return { token, user };
		},
		// WORKS ON BACKEND
        saveBook: async (parent, args, context) => {
			if (context.user) {
				return User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $addToSet: {
						savedBooks: args.bookData
					}},
					{
						new: true,
						runValidators: true,
					}
				);
			} else {
				throw new AuthenticationError('Invalid authentication');
			}
			
        },
		// WORKS ON BACKEND
		removeBook: async (parent, {bookId}, context) => {
			if (context.user) {
				try {
					const userData = User.findOneAndUpdate(
						{ _id: context.user._id },
						{ $pull: { savedBooks: { bookId: bookId } } },
						{ new: true }
					);
					return userData;
				} catch (error) {
					return error;
				}
				
			} else {
				throw new AuthenticationError('Invalid authentication');
			}
		}
	},
};

module.exports = resolvers;
