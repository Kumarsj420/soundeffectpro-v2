import mongoose, { Schema, Model } from "mongoose";
import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface CatStats {
    likes: number,
    views: number,
    downloads: number
}

export interface CategoryInterface {
    _id: Types.ObjectId,
    sb_id: string,
    name: string,
    slug: string,
    thumb: string | null,
    visibility: boolean,
    total_sfx: number,
    stats: CatStats,
    createdAt: Date,
    updatedAt: Date,
    user: {
        uid: string,
        name: string
    }
}

const CatStatsSchema = new Schema<CatStats>({
    likes: {
        type: Number,
        default: 0,
        min: 0
    },
    views: {
        type: Number,
        default: 0,
        min: 0
    },
    downloads: {
        type: Number,
        default: 0,
        min: 0
    }
}, { _id: false });

const CategorySchema = new Schema<CategoryInterface>({
    sb_id: {
        type: String,
        required: true,
        unique: true,
        default: () => uuidv4().replace(/-/g, ''),
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    thumb: {
        type: String,
        default: null
    },
    visibility: {
        type: Boolean,
        required: true,
        default: true
    },
    total_sfx: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    stats: {
        type: CatStatsSchema
    },
    user: {
        uid: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }
},
    { 
        timestamps: true,
        collection: 'categories' 

    }
)

CategorySchema.index({ name: 'text' })
CategorySchema.index({ createdOn: -1 })
CategorySchema.index({ 'stats.views': -1 })
CategorySchema.index({ 'stats.downloads': -1 })

const Category: Model<CategoryInterface> = mongoose.models.Categories || mongoose.model<CategoryInterface>('Categories', CategorySchema)

export default Category