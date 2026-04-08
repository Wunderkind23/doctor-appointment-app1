import { z } from 'zod';
import { GenderEnum } from '../types';

// Base schema for patient signup
export const patientSignupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must not exceed 50 characters')
      .trim(),

    lastName: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must not exceed 50 characters')
      .trim(),

    matricNumber: z
      .string()
      .min(1, 'Matric Number is required')
      .min(2, 'Matric Number must be at least 2 characters')
      .max(50, 'Matric Number must not exceed 50 characters')
      .trim(),

    hospitalId: z
      .string()
      .min(1, 'Hospital Id is required')
      .min(2, 'Hospital Id  must be at least 2 characters')
      .max(50, 'Hospital Id  must not exceed 50 characters')
      .trim()
      .optional(),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please provide a valid email address')
      .toLowerCase()
      .trim(),

    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain uppercase, lowercase, number and special character'
      ),

    confirmPassword: z.string().min(1, 'Please confirm your password'),

    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^[+]?[\d\s()-]+$/, 'Please provide a valid phone number')
      .trim(),

    gender: z.enum(GenderEnum),

    dob: z
      .string()
      .min(1, 'Date of birth is required')
      .refine((date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        return selectedDate <= today;
      }, 'Date of birth cannot be in the future')
      .refine((date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - selectedDate.getFullYear();
        const monthDiff = today.getMonth() - selectedDate.getMonth();
        const dayDiff = today.getDate() - selectedDate.getDate();

        const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

        return actualAge >= 13;
      }, 'You must be at least 15 years old'),

    // role: z.literal(UserRoleEnum.PATIENT),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Type inference from schema
export type PatientSignupFormData = z.infer<typeof patientSignupSchema>;

// Usage in your component
export const usePatientSignupValidation = () => {
  const validateField = (field: keyof PatientSignupFormData, value: unknown) => {
    try {
      patientSignupSchema.shape[field].parse(value);
      return { success: true, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message };
      }
      return { success: false, error: 'Validation error' };
    }
  };

  const validateForm = (data: PatientSignupFormData) => {
    try {
      patientSignupSchema.parse(data);
      return { success: true, errors: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, errors: error.issues };
      }
      return { success: false, errors: null };
    }
  };

  return { validateField, validateForm };
};
