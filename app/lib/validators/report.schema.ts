import { z } from "zod";

export const reportValidationSchema = z.object({
    senderEmail: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please provide a valid email address")
        .min(1, "Email is required"),

    type: z.enum(
        [
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
        {
            message: "Please select a valid report reason from the options",
        }
    ),

    content: z
        .string()
        .trim()
        .min(10, "Message must be at least 10 characters")
        .max(600, "Message must not exceed 600 characters"),
});

// Type inference
export type ReportValidation = z.infer<typeof reportValidationSchema>;