import { z } from "zod";
import { FIELD_LIMITS } from "@/common/field-limits";
import { VALIDATE_PATTERN } from "@/common/validate-pattern";

export const GENDER_OPTIONS = [
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Other", value: "other" },
] as const;

export const editCustomerProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(FIELD_LIMITS.NAME, `Name cannot exceed ${FIELD_LIMITS.NAME} characters`)
    .regex(
      VALIDATE_PATTERN.alphaNumericSpecialWithSpace,
      "Only alphabets with numbers and allowed characters are permitted"
    ),
  phone_number: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || /^\d{10}$/.test(val),
      "Phone number must be exactly 10 digits"
    )
    .optional()
    .or(z.literal("")),
  gender: z
    .string()
    .trim()
    .max(50, "Gender cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
  profile_image: z.string().optional().or(z.literal("")),
});

export type EditCustomerProfileFormValues = z.infer<typeof editCustomerProfileSchema>;
