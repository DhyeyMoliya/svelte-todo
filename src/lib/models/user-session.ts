import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';
import type { IUser } from './user';

const { Schema, model, models } = mongoose;

export interface IUserSession
	extends Partial<Document>,
		DeepPartial<{
			user: string | IUser;
			lastAccessedAt: Date;
			createdAt: Date;
			updatedAt: Date;
		}> {}

interface IUserSessionModel extends Model<IUserSession> {}

const UserSessionSchema = new Schema<IUserSession, IUserSessionModel>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		lastAccessedAt: Date,
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

if (models['UserSession']) {
	delete models['UserSession'];
}

export const UserSession = model<IUserSession, IUserSessionModel>('UserSession', UserSessionSchema);

UserSession.syncIndexes().catch((err) => {});
