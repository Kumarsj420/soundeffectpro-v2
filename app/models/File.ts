import mongoose, { Schema, Model } from "mongoose";
import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

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
    category: 'Meme' | 'Anime' | 'Gaming' | 'Music' | 'Movies' | 'Sports' | 'Series' | 'Politics' | 'Comedy' | 'Random';
    description: string,
    btnColor: '0' | '20' | '125' | '145' | '195' | '225' | '255' | '280' | '305' | '335',
    user: IUser;
    stats: IStats;
    visibility: boolean,
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    uid: {
        type: String,
        required: true,
        index: true,

    },
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 15,
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
        index: true,
        default: () => uuidv4().replace(/-/g, ''),
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    slug: {
        type: String,
        lowercase: true,
        trim: true
    },
    duration: {
        type: String,
        required: true,
        match: /^(0[0-9]|1[0-9]|20):[0-5][0-9]$|^02:00$/,
    },
    tags: {
        type: [String],
        required: true,
        validate: [
            {
                validator: function (v: string[]) {
                    return v.length <= 10;
                },
                message: 'Maximum 10 tags are allowed'
            },
            {
                validator: function (v: string[]) {
                    return v.every(tag => typeof tag === 'string' && tag.length > 0);
                },
                message: 'All tags must be non-empty strings'
            },
            {
                validator: function (v: string[]) {
                    return v.every(tag => tag.length <= 15);
                },
                message: 'Each tag must not exceed 15 characters'
            }
        ]
    },

    category: {
        type: String,
        required: false,
        enum: ['Meme', 'Anime', 'Gaming', 'Music', 'Movies', 'Sports', 'Series', 'Politics', 'Comedy', 'Random'],
        default: 'Random',
    },

    description: {
        type: String,
        required: false,
        minLength: 2,
        maxLength: 600,
    },

    btnColor: {
        type: String,
        enum: ['0', '20', '125', '145', '195', '225', '255', '280', '305', '335'],
        required: false,
        default: '0'
    },
    user: {
        type: UserSchema,
        required: true
    },
    stats: {
        type: StatsSchema,
    },
    visibility: { type: Boolean, default: true },
}, {
    timestamps: true,
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

FileSchema.pre('save', function (next) {
    if (!this.slug || this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
    next();
});


const File: Model<IFile> = mongoose.models.File || mongoose.model<IFile>('File', FileSchema);

export default File