const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findOne({
					_id: context.user._id,
				}).select('-__v -password');

				return userData;
			}

			throw new AuthenticationError('No user logged in.');
		},
	},

	Mutation: {
		addUser: async (parent, args) => {
			const userData = await User.create(args);
			const token = signToken(userData);

			return { token, userData };
		},
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
        saveBook: async (parent, args) => {
            con
        }
	},
};

module.exports = resolvers;
