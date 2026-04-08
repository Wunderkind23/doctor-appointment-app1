import { z } from 'zod';

export const studentPatientSchema = z.object({
  matricNumber: z
    .string()
    .min(3, 'Matric number is required'),

  department: z
    .string()
    .min(2, 'Department is required'),

  faculty: z
    .string()
    .min(2, 'Faculty is required'),

  level: z
    .string()
    .min(1, 'Level is required'),
});

export type StudentPatientFormValues = z.infer<
  typeof studentPatientSchema
>;
