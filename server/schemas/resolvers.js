const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
	Query: {
		// WORKS WHEN LOGGED IN
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
		// WORKS
		addUser: async (parent, args) => {
			const userData = await User.create(args);
			const token = signToken(userData);

			return { token, userData };
		},
		// WORKS
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
		// FIXME
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

				// try {
				// 	const updatedUser = await User.findOneAndUpdate(
				// 	  { _id: context.user._id },
				// 	  { $addToSet: { 
				// 		  savedBooks: args.bookData 
				// 	  }},
				// 	  { new: true, runValidators: true }
				// 	);
				// 	return updatedUser;
				//   } catch (err) {
				// 	throw new AuthenticationError(err);
				//   }	
			} else {
				throw new AuthenticationError('Invalid authentication');
			}
			
        },
		// TODO TEST THIS
		removeBook: async (parent, args, context) => {
			const updatedUser = await User.findOneAndUpdate(
				{ _id: args.user._id },
				{ $pull: { savedBooks: { bookId: args.bookId } } },
				{ new: true }
			  );
			  if (!updatedUser) {
				throw new AuthenticationError("Couldn't find user with this id");
			  }
			  return updatedUser;
		}
	},
};

module.exports = resolvers;
