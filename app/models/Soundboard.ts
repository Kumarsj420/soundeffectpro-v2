import mongoose, { Schema, Model } from "mongoose";
import { Document } from "mongoose";

export interface ISoundboard extends Document {
    sb_id: string;
    s_id: string;
    createdAt: Date;
    updatedAt: Date;
}

const FavSchema = new Schema<ISoundboard>(
    {
        sb_id: {
            type: String,
            required: true,
        },
        s_id: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: "soundboard",
    }
);

FavSchema.index({ sb_id: 1, s_id: 1 }, { unique: true });


const Soundboard: Model<ISoundboard> =
    mongoose.models.Soundboard || mongoose.model<ISoundboard>("Soundboard", FavSchema, "soundboard");

export default Soundboard;