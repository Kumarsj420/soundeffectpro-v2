import mongoose, { Schema, Model } from "mongoose";

export interface IReport {
    senderEmail: string;
    type:
    | "hate speech"
    | "abuse"
    | "inappropriate content"
    | "sexual content"
    | "harassment and bullying"
    | "terrorism advocacy"
    | "misinformation"
    | "spam and scams"
    | "copyright violation"
    | "privacy violation"
    | "other";
    from: "sound" | "soundboard";
    content: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
    {

        senderEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email address",
            ],
        },

        type: {
            type: String,
            required: true,
            enum: [
                "hate speech",
                "abuse",
                "inappropriate content",
                "sexual content",
                "harassment and bullying",
                "terrorism advocacy",
                "misinformation",
                "spam and scams",
                "copyright violation",
                "privacy violation",
                "other",
            ],
            default: "other",
            index: true,
        },

        from: {
            type: String,
            required: true,
            enum: ["sound", "soundboard"],
            index: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 1000,
        },

        read: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
        collection: "reports",
    }
);

ReportSchema.index({ createdAt: -1 });
ReportSchema.index({ read: 1 });
ReportSchema.index({ type: 1 });
ReportSchema.index({ from: 1 });
ReportSchema.index({ senderEmail: 1 });

const Report: Model<IReport> =
    mongoose.models.Report ||
    mongoose.model<IReport>("Report", ReportSchema);

export default Report;
