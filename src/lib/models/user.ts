import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

const { Schema, model, models } = mongoose;

export interface IUser
	extends Partial<Document>,
		DeepPartial<{
			name: string;
			email: string;
			hashedPassword: string;
			hashedResetPasswordOTP: number;
			createdAt: Date;
			updatedAt: Date;
		}> {}

interface IUserModel extends Model<IUser> {}

const UserSchema = new Schema<IUser, IUserModel>(
	{
		name: String,
		email: String,
		hashedPassword: String,
		hashedResetPasswordOTP: Number,
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
		collation: {
			locale: 'en_US',
			numericOrdering: true,
		},
	},
);

if (models['User']) {
	delete models['User'];
}

export const User = model<IUser, IUserModel>('User', UserSchema);

User.syncIndexes().catch((err) => {});
