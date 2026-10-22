import { z } from "zod";

export const enquirySchema = z.object({
  grade: z.string().trim().min(1, "Tell us the grade or product").max(120),
  quantity: z.string().trim().min(1, "Add a quantity").max(40),
  unit: z.enum(["tonnes", "bags"]),
  deliverTo: z.string().trim().min(2, "Where should it be delivered?").max(120),
  name: z.string().trim().min(2, "Your name").max(80),
  company: z.string().trim().max(120).optional().default(""),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{7,16}$/, "A phone number we can call or WhatsApp"),
  note: z.string().trim().max(600).optional().default(""),
  website: z.string().optional().default(""), // honeypot
});

export type Enquiry = z.infer<typeof enquirySchema>;
