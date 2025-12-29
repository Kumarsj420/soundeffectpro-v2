import mongoose, { Schema, Model } from "mongoose";
import { Types } from "mongoose";

export interface IUser {
    uid: string,
    name: string
}

export interface IStats {
    views: number,
    likes: number,
    downloads: number,
    reports: number,
}

export interface IFile {
    _id: Types.ObjectId;
    s_id: string;
    title: string;
    slug: string;
    duration: string;
    tags: string[];
    category: string;
    createdAt: Date;
    description: string,
    btnColor: string,
    user: IUser;
    stats: IStats;
}

const UserSchema = new Schema<IUser>({
    uid: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false })

const StatsSchema = new Schema<IStats>({
    views: {
        type: Number,
        default: 0,
        min: 0
    },
    likes: {
        type: Number,
        default: 0,
        min: 0
    },
    downloads: {
        type: Number,
        default: 0,
        min: 0
    },
    reports: {
        type: Number,
        default: 0,
        min: 0
    }
}, { _id: false })

const FileSchema = new Schema<IFile>({
    s_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    duration: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },

    category: {
        type: String,
        default: 'Random'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    description: {
        type: String
    },

    btnColor: {
        type: String
    },
    user: {
        type: UserSchema,
        required: true
    },
    stats: {
        type: StatsSchema
    }
}, {
    timestamps: false,
    collection: 'files'
})

FileSchema.index({
    title: "text",
    description: "text",
    tags: "text",
});
FileSchema.index({ createdAt: -1 });
FileSchema.index({ 'stats.views': -1 });
FileSchema.index({ 'stats.downloads': -1 });
FileSchema.index({ 'user.uid': 1 });
FileSchema.index({ tags: 1 });

const File: Model<IFile> = mongoose.models.File || mongoose.model<IFile>('File', FileSchema);

export default File