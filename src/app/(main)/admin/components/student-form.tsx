'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StudentPatientFormValues, studentPatientSchema } from '../schema/student-patient.schema';
import { Loader2Icon } from 'lucide-react';

type Props = {
  onSubmit: (data: StudentPatientFormValues) => void;
  defaultValues?: Partial<StudentPatientFormValues>;
  isLoading: boolean;
};

export function StudentPatientForm({ onSubmit, defaultValues, isLoading }: Props) {
  const form = useForm<StudentPatientFormValues>({
    resolver: zodResolver(studentPatientSchema),
    defaultValues: {
      matricNumber: '',
      department: '',
      faculty: '',
      level: '',
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Matric Number */}
        <FormField
          control={form.control}
          name="matricNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matric Number</FormLabel>
              <FormControl>
                <Input placeholder="CSC/2021/001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Department */}
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="Computer Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Faculty */}
        <FormField
          control={form.control}
          name="faculty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Faculty</FormLabel>
              <FormControl>
                <Input placeholder="Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Level */}
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <FormControl>
                <Input placeholder="300" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={isLoading}
          type="submit"
          className="w-full bg-brand-600 hover:bg-brand-700"
        >
          {isLoading ? (
            <>
              <Loader2Icon className="animate-spin" />
              Saving Student Info
            </>
          ) : (
            <> Save Student Info</>
          )}
        </Button>
      </form>
    </Form>
  );
}
