import { z } from "zod";
import { TAG_LIMIT, TAG_MAX_LENGTH, MIN_TAGS } from '@/app/global'

const DURATION_REGEX = /^(0[0-9]|1[0-9]|20):[0-5][0-9]$|^02:00$/;


export const UserSchema = z.object({
    uid: z
        .string()
        .min(1, "User ID is required"),

    name: z
        .string()
        .trim()
        .min(3, "User name must be at least 3 characters")
        .max(15, "User name must not exceed 15 characters"),
});


export const StatsSchema = z.object({
    views: z
        .number()
        .min(0, "Views cannot be negative")
        .default(0),

    likes: z
        .number()
        .min(0, "Likes cannot be negative")
        .default(0),

    downloads: z
        .number()
        .min(0, "Downloads cannot be negative")
        .default(0),

    reports: z
        .number()
        .min(0, "Reports cannot be negative")
        .default(0),
});



export const FileSchema = z.object({
    s_id: z.string().optional(),

    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must not exceed 100 characters"),

    slug: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, "Slug is required"),

    duration: z
        .string()
        .regex(
            DURATION_REGEX,
            "Duration must be in MM:SS format (00:00–20:59)"
        ),

    tags: z
        .array(
            z
                .string()
                .min(1, `Minimum ${MIN_TAGS} character required`)
                .max(
                    TAG_MAX_LENGTH,
                    `Tag must not exceed ${TAG_MAX_LENGTH} characters`
                )
        )
        .max(TAG_LIMIT, `Maximum ${TAG_LIMIT} tags are allowed`)
        .min(MIN_TAGS, `Minimum ${MIN_TAGS} tags are required`)
        .refine(
            (tags) => {
                const seen = new Set();
                return tags.every(tag => {
                    if (seen.has(tag)) return false;
                    seen.add(tag);
                    return true;
                });
            },
            {
                message: 'Tags must be unique. Duplicate tags are not allowed',
            }
        ),

    category: z
        .enum([
            "Meme",
            "Anime",
            "Gaming",
            "Music",
            "Movies",
            "Sports",
            "Series",
            "Politics",
            "Comedy",
            "Random",
        ])
        .default("Random"),

    description: z
        .string()
        .min(2, "Description must be at least 2 characters")
        .max(600, "Description must not exceed 600 characters")
        .optional(),

    btnColor: z
        .enum(["0", "20", "125", "145", "195", "225", "255", "280", "305", "335"])
        .default("0"),

    user: UserSchema,

    stats: StatsSchema.optional(),

    visibility: z.boolean().default(true),
});



export type FileInput = z.infer<typeof FileSchema>;
