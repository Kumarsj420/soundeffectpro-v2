import mongoose, { Schema, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
    uid: string,
    name?: string,
    email: string,
    image?: string | null,
    provider?: string,
    favCount: number,
    isProfileCompleted: boolean,
    emailVerified: Date,
    filesCount: number,
    categoriesCount: number,
    preference: {
        theme: string,
        nsfw: boolean,
        cookies: boolean,
        language: "en" | "hi" | "ar" | "ur" | "fr" | "de" | "es" | "pt" | "zh";
    },
    createdAt: Date,
    updatedAt: Date,
}

const UserSchema = new Schema<IUser>({
    uid: {
        type: String,
        required: true,
        unique: true,
        default: () => uuidv4().replace(/-/g, ''),
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
    },
    filesCount: {
        type: Number,
        default: 0,
        min: 0
    },
    categoriesCount: {
        type: Number,
        default: 0,
        min: 0
    },
    preference: {
        theme: {
            type: String,
            default: null
        },
        nsfw: {
            type: Boolean,
            default: true
        },
        cookies: {
            type: Boolean,
            default: true
        },
        language: {
            type: String,
            default: null
        }
    }
}, {
    timestamps: true,
    collection: 'users'
})

UserSchema.index({ uid: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;