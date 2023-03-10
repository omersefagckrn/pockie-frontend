import bcrypt from 'bcrypt';
import { Document, model, Schema } from 'mongoose';

export interface IUser {
	name: string;
	surname: string;
	email: string;
	password: string;
	phone: string;
	isAdmin: boolean;
}

export interface UserDocument extends Document, IUser {
	matchPassword: (password: string) => Promise<Boolean>;
	updatedAt: Date;
}

const UserSchema = new Schema(
	{
		name: { type: String, required: true },
		surname: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		phone: { type: String, required: true },
		isAdmin: {
			type: Boolean,
			required: true,
			default: false
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (this: any, enteredPassword: string) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
UserSchema.pre('save', async function (this: UserDocument, next) {
	if (!this.isModified('password')) next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

export default model<UserDocument>('User', UserSchema);
