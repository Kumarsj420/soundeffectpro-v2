import mongoose, { Schema, Model } from "mongoose";

export interface IOAuth {
    provider: string,
    uid: string
}

export interface IUser extends Document {
    uid: string,
    name: string,
    email: string,
    picture?: string,
    oauth?: IOAuth,
    favCount: number,
}

const UserSchema = new Schema<IUser>({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    picture: {
        type: String
    },
    oauth: {
        provider: { type: String },
        uid: { type: String }
    },
    favCount: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true,
    collection: 'users'
})

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;