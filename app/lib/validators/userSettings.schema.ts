import { z } from "zod";

export const uidSchema = z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(
        /^(?=.*[a-z])(?=.*[0-9])[a-z0-9][a-z0-9_]*[a-z0-9]$/,
        "Username must start and end with a letter or number, and contain at least one letter and one number"
    );


export const userNameSchema = z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .optional()
    .or(z.literal(""))


export const profileSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(30, "Name is too long")
        .optional()
        .or(z.literal("")),

    uid: uidSchema,
});

export const preferenceSchema = z.object({
    theme: z.enum(["light", "dark"]),
    nsfw: z.boolean(),
    cookies: z.boolean(),
    language: z.enum(["en", "hi", "ar", "ur", "fr", "de", "es", "pt", "zh"]),
});
