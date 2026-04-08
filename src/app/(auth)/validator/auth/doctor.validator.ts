import { z } from 'zod'
import { GenderEnum, SpecialtyEnum } from '../../types'

export const doctorSignupSchema = z
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
        'Password must contain uppercase, lowercase, number and special character',
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
      .optional()
      .refine((date) => {
        if (!date) return true
        const selectedDate = new Date(date)
        const today = new Date()
        return selectedDate <= today
      }, 'Date of birth cannot be in the future'),

    medicalLicense: z.string().min(1, 'Medical license is required for doctors').trim(),

    specialization: z.enum(SpecialtyEnum),

    yearsOfExperience: z
      .string()
      .min(1, 'Years of experience is required')
      .refine((val) => {
        const num = Number(val)
        return !isNaN(num) && Number.isInteger(num)
      }, 'Years of experience must be a valid number')
      .transform((val) => Number(val)),
    hospitalAffiliation: z
      .string()
      .min(1, 'Hospital affiliation is required for doctors')
      .min(2, 'Hospital affiliation must be at least 2 characters')
      .trim(),

    professionalBio: z
      .string()
      .min(1, 'Professional bio is required for doctors')
      .max(1000, 'Professional bio must not exceed 1000 characters')
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Type inference from schema
export type DoctorSignupFormData = z.infer<typeof doctorSignupSchema>

// Usage in your component
export const useDoctorsSignupValidation = () => {
  const validateField = (field: keyof DoctorSignupFormData, value: unknown) => {
    try {
      doctorSignupSchema.shape[field].parse(value)
      return { success: true, error: null }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message }
      }
      return { success: false, error: 'Validation error' }
    }
  }

  const validateForm = (data: DoctorSignupFormData) => {
    try {
      doctorSignupSchema.parse(data)
      return { success: true, errors: null }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, errors: error.issues }
      }
      return { success: false, errors: null }
    }
  }

  return { validateField, validateForm }
}
