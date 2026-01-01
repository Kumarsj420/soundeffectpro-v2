import mongoose, { Schema, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
    uid: string,
    name?: string,
    email: string,
    image?: string,
    provider?: string,
    favCount: number,
    isProfileCompleted: boolean,
    emailVerified: Date,
}

const UserSchema = new Schema<IUser>({
    uid: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4,
    },
    name: {
        type: String,
        trim: true,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    image: {
        type: String,
        default: null
    },
    provider: {
        type: String
    },
    favCount: {
        type: Number,
        default: 0,
        min: 0
    },
    isProfileCompleted: {
        type: Boolean,
        default: false,
    },
    emailVerified: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    collection: 'users'
})

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;