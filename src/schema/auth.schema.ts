
import * as zod from "zod";


export const RegisterSchema = zod
  .object({
    name: zod.string().min(1, "Name is required"),
    email: zod
      .string()
      .email()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
    dateOfBirth: zod
      .string()
      .nonempty()
      .refine((dateOfBirthValue) => {
        const selectedDate = new Date(dateOfBirthValue);
        const today = new Date();
        return selectedDate > today ? false : true;
      }, "Date of birth cannot be in the future"),

    gender: zod.enum(["male", "female"]),

    password: zod
      .string()
      .nonempty("password is required")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
        `The password must be > 8 characters and contain: an uppercase letter + a lowercase letter + a number +
a special character from the list above.`,
      ),
    rePassword: zod.string().nonempty("Please confirm your password"),
  })
  .refine(
  (data) => data.password === data.rePassword,
  {
    path: ["rePassword"],
    message: "Passwords do not match",
  }
);

export type RegisterSchemaType = zod.infer<typeof RegisterSchema>;


////////////////////////////////////////////////////////////////////////////


export const LoginSchema = zod
  .object({
    email: zod
      .string()
      .email()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
    

    password: zod
      .string()
      .nonempty("password is required")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
        `The password must be > 8 characters and contain: an uppercase letter + a lowercase letter + a number +
a special character from the list above.`,
      ),
  });

export type LoginSchemaType = zod.infer<typeof LoginSchema>;