import { z } from "zod";

export const messageTypeEnum = z.enum(
  [
    "contact",
    "feedback",
    "inquiry",
    "support",
    "technical issue",
    "other",
  ],
  {
    message: "Select correct type",
  }
);

export const messageSchema = z.object({
  senderEmail: z
    .string({
      message: "Email address is required and must be a valid string",
    })
    .trim()
    .toLowerCase()
    .min(1, "Email address cannot be empty")
    .email("Please provide a valid email address"),

  type: messageTypeEnum.default("contact"),

  content: z
    .string({
      message: "Message content is required and must be a valid string",
    })
    .trim()
    .min(5, "Message must be at least 5 characters long")
    .max(600, "Message cannot exceed 600 characters"),

  read: z
    .boolean({
      message: "Read status must be a boolean value",
    })
    .default(false),
});


export const messageUpdateSchema = messageSchema.partial();

export const messageCreateSchema = messageSchema.omit({ read: true });

export const messageQuerySchema = z
  .object({
    senderEmail: z
      .string()
      .email("Invalid email format for filter")
      .optional(),

    type: messageTypeEnum.optional(),

    read: z
      .boolean({
        message: "Read filter must be true or false",
      })
      .optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    }
  );


export type MessageInput = z.infer<typeof messageSchema>;
export type MessageCreateInput = z.infer<typeof messageCreateSchema>;
export type MessageUpdateInput = z.infer<typeof messageUpdateSchema>;
export type MessageQueryInput = z.infer<typeof messageQuerySchema>;
export type MessageType = z.infer<typeof messageTypeEnum>;