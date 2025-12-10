import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser {
    uid: string,
    name: string
}

export interface IFile extends Document {
    s_id: string;
    title: string;
    slug: string;
    duration: string;
    tags: string[];
    views: number;
    downloads: number;
    category: string;
    reports: number;
    createdAt: Date;
    user: IUser;
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
        unique: true,
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
    views: {
        type: Number,
        default: 0,
        min: 0
    },
    category: {
        type: String,
        default: 'Random'
    },
    reports: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: UserSchema,
        required: true
    }
}, {
    timestamps: false,
    collection: 'files'
})

FileSchema.index({ title: 'text' }); 
FileSchema.index({ createdAt: -1 }); 
FileSchema.index({ views: -1 }); 
FileSchema.index({ downloads: -1 });
FileSchema.index({ 'user.uid': 1 }); 
FileSchema.index({ tags: 1 }); 

const File : Model<IFile> = mongoose.models.File || mongoose.model<IFile>('File', FileSchema) ;

export default File