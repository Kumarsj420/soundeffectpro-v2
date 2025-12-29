import mongoose, { Schema, Model } from "mongoose";
import { Types } from "mongoose";

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
    visibility: 'public' | 'private',
    total_sfx: number,
    stats: CatStats,
    createdOn: Date,
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
});

const CategorySchema = new Schema<CategoryInterface>({
    sb_id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    thumb: {
        type: String,  
        required: true,
        default: null
    },
    visibility: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    total_sfx: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    stats: {
        type: CatStatsSchema
    } ,
    createdOn: {
        type: Date,
        default: Date.now
    }

})

CategorySchema.index({name: 'text'})
CategorySchema.index({createdOn: -1})
CategorySchema.index({'stats.views': -1})
CategorySchema.index({'stats.downloads': -1})

const Category: Model<CategoryInterface> = mongoose.models.Categories || mongoose.model<CategoryInterface>('Categories', CategorySchema)

export default Category