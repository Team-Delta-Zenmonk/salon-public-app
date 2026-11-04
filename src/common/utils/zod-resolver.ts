import type { Resolver, FieldErrors } from "react-hook-form";
import type { ZodType } from "zod";

export const createZodResolver = <T extends Record<string, any>>(
  schema: ZodType<T>
): Resolver<T> => {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      };
    }

    const errors: FieldErrors<T> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof T;
      if (field && !errors[field]) {
        errors[field] = {
          type: issue.code,
          message: issue.message,
        } as any;
      }
    }

    return {
      values: {} as any,
      errors,
    };
  };
};
